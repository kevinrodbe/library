# Authentication

All of the following strategies are supported by Rails out of the box. See [ActionController::HttpAuthentication](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/http_authentication.rb).

We are going to be looking at three different authentication strategies:

* [HTTP Basic Auth](http://guides.rubyonrails.org/action_controller_overview.html#http-authentications)
* Token based
* [HTTP Digest Auth](http://guides.rubyonrails.org/action_controller_overview.html#http-authentications) *(might leave this one out...)*

## HTTP Basic Auth

[Demo app](https://github.com/codeschool/BananaPodcast/tree/http_basic_auth)

Pros:

  * Part of the HTTP standard - [RFC2617](http://www.ietf.org/rfc/rfc2617.txt)
  * Rails support out of the box.
  * Leverage existing user credentials.

Cons:

  * Although the username and password are never sent in plain text, the base64-encoded text is easily intercepted and decoded. Use of HTTPS is highly recommended.
  * Your application might not have users with username and password. Some services workaround this by passing a dummy username, like 'xxxx', and then a password.


The HTTP Basic Auth is part of the standard and it's supported by Rails out of the box. When using Basic Auth, access credentials must be provided in an **Authorization** header.

Using curl, we can pass credentials using the `-u` option, and curl automatically converts them into the proper Basic Auth header format. 

```
$ curl -Iu 'carlos:secret' http://localhost:3000/episodes
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

The Authorization header format for Basic Auth is composed of the word *Basic* followed by a base64 encoded version of our credentials:

```
Authorization: Basic Y2Fpa2U6c2VjcmV0
```

Before we add support for Basic Auth to our API, let's write some integration tests:

```ruby
require 'test_helper'

class ListingPaymentsTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(username: 'foo',
                         password: 'secret', password_confirmation: 'secret')
  end

  teardown { User.destroy_all }

  def encode(username, password)
    ActionController::HttpAuthentication::Basic.encode_credentials(username, password)
  end

  test 'valid username and password' do
    # Authorization: Basic Y2Fpa2U6c2VjcmV0
    get '/episodes', {}, { 'Authorization' => encode(@user.username, @user.password) }
    assert_equal 200, response.status
  end

  test 'missing credentials' do
    get '/episodes', {}, {}
    assert_equal 401, response.status
  end
end
```

We use the `encode_credentials` method from `ActionController::HttpAuthentication::Basic` to take care of the encoding and formatting for us.

In our `EpisodesController`, we'll create a *before_action* to check the users' credentials using Basic Auth:

```ruby
# app/controllers/episodes_controller.rb
class EpisodesController < ApplicationController
  before_action :authenticate

  def index
    episodes = Episode.all
    render json: episodes, status: 200
  end

  protected
    def authenticate
      authenticate_or_request_with_http_basic do |username, password|
        User.authenticate(username, password)
      end
    end
end
```

We call the built-in `authenticate_or_request_with_http_basic` method, which reads the `username` and `password` from the **Authorization** header and passes them to the block given. Inside that block, we'll look up the user by the username, and authenticate the user. If the block returns false or nil, then the request is halted and our application immediatelly responds with a `401 - Unauthorized`.

One limitation we might come across is the fact that this method doesn't allow for much customization. For example, it always responds with the Content-Type set to HTML regardless of the mime type requested by the API client. There's also no easy way to add a custom error message if we wanted to.

Another method we can use instead is the `authenticate_with_http_basic`:

```
class EpisodesController < ApplicationController
  before_action :authenticate

  def index
    episodes = Episode.all
    render json: episodes, status: 200
  end

  protected
    def authenticate
      authenticate_basic_auth || render_unauthorized
    end

    def authenticate_basic_auth
      authenticate_with_http_basic do |username, password|
        User.authenticate(username, password)
      end
    end

    def render_unauthorized
      render json: 'Invalid credentials.', status: 401
    end
end
```

This method simply returns false. It is now up to us to craft the response. We do that on the `render_unauthorized` method, returning a message in JSON format and the `401 Unauthorized` status code.

Our tests should all be passing now.

While HTTP Basic Auth is pretty straight forward to implement, it is not as secure as it may appear. If the request is intercepted by an attacker, the base64-encoded text can easily be decoded.

```ruby
> username, password = 'carlos', 'secret'
 => ["carlos", "secret"] 
> encoded = ActionController::HttpAuthentication::Basic.encode_credentials(username, password)
 => "Basic Y2FybG9zOnNlY3JldA==" 
> decoded = Base64.decode64(encoded.split.last).split(/:/)
 => ["carlos", "secret"] 
```

Using HTTPS can help with preventing sniffers, but there's no such thing as an app that's 100% safe. Even using Basic Auth with HTTPS, our app and our users are still in risk of being attacked. If users have their credentials stolen, then not only their API access will be compromised, but also the access to the web site - since we are using the same credentials. And since users tend to reutilize username/password combinations across different services, their account on those services will also be compromised.

Let's look at another API authentication strategy that can help prevent this risk.

## Token

[Demo app](https://github.com/codeschool/BananaPodcast/tree/token_based_authentication)

The token based authentication is when the API client includes an application provided API token for each request. A lot of popular services offer token based authentication for connecting with their API, like HipChat, Campfire, Backpack, Last.fm and many others.

Pros:

  * More convenient, as you can easily expire or regenerate tokens without affecting the user's account password.
  * If compromised, vulnerability limited to API, not the user's master account
  * You can have multiple keys per account (e.g. users can have "test" and "production" keys side by side.)

Getting a token usually means visiting your profile settings page on the service's website and requesting an access key - or they might already have one generated for you.

![](https://www.evernote.com/shard/s37/sh/70286f99-4f35-45f3-acb1-c796eed11de7/9b1d50385934d58541afa47d95654bdb/deep/0/Backpack--Your-user-settings.png)


### Manual Implementation

*(Might not even include this one...)*

On a token based authentication, there are two ways that APIs accept these tokens: either through a request header or as a query string parameter. Using a request header should be preferred over passing the token in the URL, since it helps prevent users from sharing URLs with access credentials in them.

Let's look at an example of passing a token using an HTTP header. We'll start with the integration tests.

First, we'll create a user record and then some payments for that user. We'll set the **USER_AUTH_TOKEN** with the user's authentication token. The name for the header can be anything we want, but we need make sure it doesn't conflict with one of the standard headers.

```ruby
# test/integration/listing_payments_test.rb
require 'test_helper'

class ListingPaymentsTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'foo@bar.com')
    @user.payments.create!(amount: 99.99)
  end

  teardown do
    User.destroy_all
  end

  test 'valid authentication' do
    get '/payments', {}, { 'USER_AUTH_TOKEN' => @user.auth_token }
    assert_equal 200, response.status
  end

  test 'invalid authentication' do
    get '/payments', {}, { 'USER_AUTH_TOKEN' => @user.auth_token + 'fake' }
    assert_equal 401, response.status
  end
end
```

For valid authentication requests, we'll respond with a `200 - OK` status code. Invalid authentication requests will get a `401 - Unauthorized` status code.

In our User model, we'll use a *before_create* callback to generate the token. It's super important to ensure the token is unique in the users table. We'll place the token generation code inside a while loop, and keep regenerating it in case it already exists.

```ruby
# app/models/user.rb
class User < ActiveRecord::Base
  has_many :payments, dependent: :destroy
  before_create :set_auth_token

  private

    def set_auth_token
      return if auth_token.present?

      begin
        self.auth_token = SecureRandom.base64(15)
      end while self.class.exists?(auth_token: self.auth_token)
    end
end
```

For simplicity, we'll assume all requests to our application will need to be authenticated so we'll edit our `ApplicationController`. We'll create a *before_action* that authenticates the user. We'll read from the **USER_AUTH_TOKEN** header and use the value to look the user up.

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user

  protected
    def authenticate_user
      current_user || render_unauthorized
    end

    def current_user
      @current_user ||= User.find_by(auth_token: auth_token)
    end

    def auth_token
      request.headers['USER_AUTH_TOKEN']
    end

    def render_unauthorized
      head 401
    end
end
```

If a user is found for the given token, then `current_user` returns the user object, which is evaluated to truthy; if not, then we'll simply respond with a 401 status code and no content.

Finally, our `PaymentsController` uses `current_user` to fetch its payment records. Then, it renders them as JSON and responds with a 200 status code.

```ruby
# app/controllers/episodes_controller.rb
class Episodes < ApplicationController
  def index
    episodes = Episode.all
    render json: payments, status: 200
  end
end
```

### Rails' Built-in

Advantages of using the `authenticate_or_request_with_http_token` method built into Rails:

* Automatically checks the **Authorization** request header for a token.
* Responds with a `401 Unauthorized` if block returns false

```ruby
# test/integration/listing_episodes.rb
require 'test_helper'

class ListingEpisodesTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(email: 'foo@bar.com')
    @auth_header = "Token token=#{@user.auth_token}"
    @token = ActionController::HttpAuthentication::Token.encode_credentials(@user.auth_token)
  end

  teardown { User.destroy_all }

  # Show this example first
  test 'valid authentication with manual token' do
    get '/episodes', {}, { 'Accept' => Mime::JSON, 'Authorization' => @auth_header }
    assert_equal 200, response.status
    assert_equal Mime::JSON, response.content_type
  end

  # Show this after showing the #encode_credentials method
  test 'valid authentication' do
    get '/episodes', {}, { 'Authorization' => @token }
    assert_equal 200, response.status
    assert_equal Mime::JSON, response.content_type
  end

  test 'invalid authentication' do
    get '/episodes', {}, { 'Authorization' => @token + 'fake' }
    assert_equal 401, response.status
  end
end
```

Back in our controller we call the `authenticate_or_request_with_http_token` method, which takes a block and passes two arguments to it. We only really care about the first one, the token, which we'll use to look the user up.

```ruby
# app/application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate

  protected
    def authenticate
      authenticate_or_request_with_http_token do |token, options|
        User.find_by(auth_token: token)
      end
    end
end
```

If a user is not found and the block returns nil, then the `authenticate_or_request_with_http_token` returns a `401 Unauthorized` response.

Caveat is that it doesn't give you much room for customization. Once it fails, it responds right away with a 401 status code and using an HTML format. If we need to 

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate

  protected
    def authenticate
      token_and_opts = ActionController::HttpAuthentication::Token.token_and_options(request)
      # [<token>, {<opts>}]
      user = User.find_by(auth_token: token_and_opts.first)
      unless user
        render json: 'Bad credentials', status: 401 and return false
      end
    end
end


```

## HTTP Digest Auth

* HTTP Digest Auth (see **Rest in Practice** page 519)
    * From the [http://www.ietf.org/rfc/rfc2617.txt](RFC) *unlike Basic,this verification can be done without sending the password in the clear*
    * Rails support out of the box


I've decided not to include SSO for now due to its complexity and because most public API services provide some sort of token-based solutions.


## Inbox

<http://stackoverflow.com/questions/4968009/api-design-http-basic-authentication-vs-api-token>