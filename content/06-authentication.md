# Authentication

TODO: elaborate intro.

> With the growing use of distributed web services and cloud computing, clients need to allow other parties access to the resources they control. / http://tools.ietf.org/html/draft-hammer-http-token-auth-01

We are going to be looking at two different authentication strategies:

* [HTTP Basic Auth](http://guides.rubyonrails.org/action_controller_overview.html#http-authentications)
* [Token based Auth](http://api.rubyonrails.org/classes/ActionController/HttpAuthentication/Token.html)

## HTTP Basic Auth

[Demo app](https://github.com/codeschool/BananaPodcast/tree/http_basic_auth)

The HTTP Basic Auth is part of the standard ([RFC 2617](http://www.ietf.org/rfc/rfc2617.txt)) and it's supported by Rails out of the box. When using Basic Auth, access credentials must be provided though the **Authorization** header.

The Authorization header format for Basic Auth is composed of the word *Basic* followed by a base64 encoded version of our username and password:

```
GET /episodes HTTP/1.1
Host: localhost:3000
Authorization: Basic Y2Fpa2U6c2VjcmV0
```

Before we add support for Basic Auth to our API, let's write some integration tests:

```ruby
require 'test_helper'

class ListingEpisodesTest < ActionDispatch::IntegrationTest
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

We can use the `encode_credentials` method from `ActionController::HttpAuthentication::Basic` to handle the encoding and formatting for us.

In our `EpisodesController`, we create a *before_action* to check the users' credentials using Basic Auth:

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

We call the built-in `authenticate_or_request_with_http_basic` method, which reads the `username` and `password` from the **Authorization** header and passes them to the block given. Inside that block, we can use the credentials to authenticate the user.

Using **curl**, we can test our Basic Auth authentication using the `-u` option. curl automatically converts our credentials to the proper Basic Auth header format.

```
$ curl -Iu 'carlos:secret' http://localhost:3000/episodes
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

If the authentication fails and our block returns false, the request is halted and our application immediately responds with a `401 - Unauthorized`.

```
$ curl -Iu 'carlos:fakesecret' http://localhost:3000/episodes
HTTP/1.1 401 Unauthorized 
Content-Type: text/html; charset=utf-8
WWW-Authenticate: Basic realm="Application"
```

According to the spec, a `401 - Unauthorized` must include a **WWW-Authenticate** header with a challenge applicable to the requested resource. The `authenticate_or_request_with_http_basic` automatically includes that header for us:

```
WWW-Authenticate: Basic realm="Application"
```

The *Basic* part means the given resource uses HTTP Basic authentication and that the resource under that URI is currently part of the "Application" realm. 

The *realm* value allows protected resources to be partitioned into different sets of protection spaces, each with its own access policies. The default value used by Rails is "Application". To change the realm name, we can pass the new name as an argument to the `authenticate_or_request_with_http_basic` method.

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
      authenticate_or_request_with_http_basic('Episodes') do |username, password|
        User.authenticate(username, password)
      end
    end
end
```

Which will be automatically set to the proper header:

```
$ curl -Iu 'carlos:fakesecret' http://localhost:3000/episodes/preview
HTTP/1.1 401 Unauthorized 
WWW-Authenticate: Basic realm="Episodes"
Content-Type: text/html; charset=utf-8
```

One limitation we might come across when using `authenticate_or_request_with_http_basic` is the fact that this method doesn't allow for much customization. For example, it always responds with the Content-Type set to HTML regardless of the mime type requested by the API client. There's also no easy way to add a custom error message to the response body if we wanted to.

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
      self.headers['WWW-Authenticate'] = 'Basic realm="Application"'
      render json: 'Invalid credentials.', status: 401
    end
end
```

This method simply returns false. It is now up to us developers to craft the response. We do that on the `render_unauthorized` method, returning a message in JSON format and the `401 Unauthorized` status code. We also need to set the proper **WWW-Authenticate** header.

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

Using HTTPS can help with preventing sniffers, but there's no such thing as an app that's 100% safe. Even using Basic Auth with HTTPS, our app and our users are still in risk of being attacked. If users have their credentials stolen, then not only their API access will be compromised, but also the access to the web site since it's highly probable that we'll end up using the same username and passwords. Since users tend to reutilize username/password combinations across different services, their account on all those other services will also be compromised. **HAVOC!**

Let's look at another API authentication strategy that can help mitigate these risks.

## Token

[Demo app](https://github.com/codeschool/BananaPodcast/tree/token_based_authentication)

A token based authentication is when an API client uses a token identifier for making authenticated HTTP requests. A lot of popular services offer token based authentication for connecting with their API, like HipChat, Campfire, Backpack, Last.fm and many others. It's not yet a standard, but there is an official draft that specifies the scheme.

Pros:

  * More convenient, as we can easily expire or regenerate tokens without affecting the user's account password.
  * If compromised, vulnerability limited to API, not the user's master account
  * We could have multiple tokens for a user, which they can use to grant access to different API clients.
  * For each token, different access rules can be implemented.
  * Draft <http://tools.ietf.org/html/draft-hammer-http-token-auth-01>

Getting an API token usually means visiting a profile settings page on the service's website and requesting an access key. Some might already have a key generated for us.

![](https://www.evernote.com/shard/s37/sh/70286f99-4f35-45f3-acb1-c796eed11de7/9b1d50385934d58541afa47d95654bdb/deep/0/Backpack--Your-user-settings.png)

The Authorization header format for Token based authentication looks like so:

```
GET /episodes HTTP/1.1
Host: localhost:3000
Authorization: Token token=123123123
```

Similar to Basic Auth, Rails also offers the `authenticate_or_request_with_http_token` method. This method automatically checks the **Authorization** request header for a token and passes it as an argument to the given block:

```ruby
authenticate_or_request_with_http_token do |token, options|
  # authenticate user...
end
```

Inside that block is where we implement our authentication strategy.

Let's look at how our integration tests look like using the token based authentication.

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
    get '/episodes', {}, { 'Authorization' => @auth_header }
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

Back in our `EpisodesController` we call the `authenticate_or_request_with_http_token` method. For the time being, we only care about the first argument, which is the token we'll use to look the user up.

```ruby
class EpisodesController < ApplicationController
  before_action :authenticate

  def index
    episodes = Episode.all
    render json: episodes, status: 200
  end

  protected
    def authenticate
      authenticate_or_request_with_http_token do |token, options|
        User.find_by(auth_token: token)
      end
    end
end
```

It is very important that the auth_token is unique across all users. In our User model, we use a *before_create* callback to generate the token. The token generation code is placed inside a while loop - in case `SecureRandom` generates a token that's already being used, we'll just keep looping until it generates one that's unique.

```ruby
class User < ActiveRecord::Base
  before_create :set_auth_token

  private
    def set_auth_token
      return if auth_token.present?

      begin
        self.auth_token = SecureRandom.hex
      end while self.class.exists?(auth_token: self.auth_token)
    end
end
```

If we wanted to take it one step further, we could also add an unique constraint on the auth_token on the database.

Using curl, we can test our Token based authentication by passing a valid token in the Authorization header:

```
$ curl -IH "Authorization: Token token=16d7d6089b8fe0c5e19bfe10bb156832" \
  http://localhost:3000/episodes
HTTP/1.1 200 OK 
Content-Type: application/json; charset=utf-8
```

For unsuccessful token based requests, notice how the **WWW-Authorization** header is different. The realm still defaults to *Application*, but instead of *Basic*, it uses *Token*:

```
$ curl -IH "Authorization: Token token=fake" http://localhost:3000/episodes.json
HTTP/1.1 401 Unauthorized 
Content-Type: text/html; charset=utf-8
WWW-Authenticate: Token realm="Application"
```

The `authenticate_or_request_with_http_token` method has the same limitations as Basic Auth, in that it doesn't allow for easy customization and always returns HTML.

For more flexibility we can use the `authenticate_with_http_token` method instead and build the response ourselves:

```ruby
class EpisodesController < ApplicationController
  before_action :authenticate

  def index
    render json: [], status: 200
  end

  protected
    def authenticate
      authenticate_token || render_unauthorized
    end

    def authenticate_token
      authenticate_with_http_token do |token, options|
        User.find_by(auth_token: token)
      end
    end

    def render_unauthorized
      self.headers['WWW-Authenticate'] = 'Token realm="Application"'
      render json: 'Bad credentials', status: 401
    end
end
```

And that gives us a proper JSON response:

```ruby
$ curl -IH "Authorization: Token token=fake" http://localhost:3000/episodes/1.json
HTTP/1.1 401 Unauthorized 
Content-Type: application/json; charset=utf-8
```
