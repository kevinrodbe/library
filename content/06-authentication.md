# Authentication

All of the following strategies are supported by Rails out of the box. See [ActionController::HttpAuthentication](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/http_authentication.rb).

We are going to be looking at three different authentication strategies:

* Token based
* [HTTP Basic Auth](http://guides.rubyonrails.org/action_controller_overview.html#http-authentications)
* [HTTP Digest Auth](http://guides.rubyonrails.org/action_controller_overview.html#http-authentications)

## Token

[Demo app](https://github.com/codeschool/BananaPodcast/tree/token_based_authentication)

The token based authentication is when the API client includes an application provided API token for each request. A lot of popular services offer token based authentication for connecting with their API, like HipChat, Campfire, Backpack, Last.fm and many others.

Getting a token usually means visiting your profile settings page on the service's website and requesting an access key - or they might already have one generated for you which you can just copy and paste.

![](https://www.evernote.com/shard/s37/sh/70286f99-4f35-45f3-acb1-c796eed11de7/9b1d50385934d58541afa47d95654bdb/deep/0/Backpack--Your-user-settings.png)

On a token based authentication, the two most common ways that APIs accept these tokens are from a custom request header or as a query string parameter.

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
# app/controllers/payments_controller.rb
class PaymentsController < ApplicationController
  def index
    payments = current_user.payments
    render json: payments, status: 200
  end
end
```

The token based authentication we've just seen is simple to implement, but other than using an HTTP header, we are not properly following the HTTP protocol. We are going to look at two other options that come built into Rails.

## HTTP Basic Auth

[Demo app](https://github.com/codeschool/BananaPodcast/tree/http_basic_auth)
    
* HTTP Basic Auth (see **Rest in Practice** page 517)
    * Native HTTP Basic Authentication
    * caveat, *Although the username and password are never sent in plain text, the base64-encoded text is easily intercepted and decoded*. Solution is to use HTTPS.
    * Rails support out of the box

> When a consumer attempts to access a privileged resource, credentials must be provided in an Authorization header, or the consumer will be refused access. Ian Robinson. “REST in Practice.”

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user

  protected

    def authenticate_user
      current_user || render_unauthorized
    end

    def current_user
      @current_user ||= begin
                          authenticate_with_http_basic do |username, password|
                            user = User.find_by(username: username)
                            user && user.authenticate(password)
                          end
                        end
    end

    def render_unauthorized
      head 401
    end
end
```

```ruby
require 'test_helper'

class ListingPaymentsTest < ActionDispatch::IntegrationTest
  setup do
    password = 'secret'
    @user = User.create!(username: 'foobar',
                         password: password, password_confirmation: password)
    @user.payments.create!(amount: 99.99)
  end

  teardown do
    User.destroy_all
  end

  test 'valid username and password' do
    auth = ActionController::HttpAuthentication::Basic.encode_credentials(@user.username, @user.password)
    get '/payments', {}, { 'HTTP_AUTHORIZATION' =>  auth }
    assert_equal 200, response.status
  end

  test 'missing credentials' do
    get '/payments', {}, {}
    assert_equal 401, response.status
  end

  test 'invalid username' do
    auth = ActionController::HttpAuthentication::Basic.encode_credentials('', @user.password)
    get '/payments', {}, { 'HTTP_AUTHORIZATION' =>  auth }
    assert_equal 401, response.status
  end

  test 'invalid password' do
    auth = ActionController::HttpAuthentication::Basic.encode_credentials(@user.username, '')
    get '/payments', {}, { 'HTTP_AUTHORIZATION' =>  auth }
    assert_equal 401, response.status
  end
end
```

## HTTP Digest Auth

* HTTP Digest Auth (see **Rest in Practice** page 519)
    * From the [http://www.ietf.org/rfc/rfc2617.txt](RFC) *unlike Basic,this verification can be done without sending the password in the clear*
    * Rails support out of the box


I've decided not to include SSO for now due to its complexity and because most public API services provide some sort of token-based solutions.
