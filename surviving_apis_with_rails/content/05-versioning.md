## API Versioning and Custom Media Type

Once our API is deployed to production and clients start relying on it, any change that needs to be introduced will need to be done so in a way that doesn't disrupt existing clients.

Versioning our API helps prevent major changes from breaking existing API clients. Every time a new, backwards-incompatible change needs to be made, we create a new API version and add the change only to this new version. This way, old clients relying in previous versions are not affected.

There are multiple strategies to API versioning. We are going to be looking at the two most popular:

  * Using the URI
  * Using the **Accept** header

## Versioning using the URI

[Demo app](https://github.com/codeschool/BananaPodcast/tree/uri_version)

The simplest and most straight forward way to version our API is to add the version to the URI:

```
api.cs-zombies.com/v1/zombies
api.cs-zombies.com/v2/humans
```

Including the API version in the URI makes it easy to see which version is being used just by looking at it. It also allows us to test our API using the browser, which is pretty handy.

To add support for versioned URIs in our Rails app, we first add a **namespace** for each version supported by our application:

```ruby
# config/routes.rb
namespace :v1 do
  resources :zombies
end

namespace :v2 do
  resources :zombies
end
```

If we run `rake routes`, we'll see the URI patterns for both versions of our Zombies resources:

```
            Prefix Verb   URI Pattern                    Controller#Action
    api_v1_zombies GET    /v1/zombies(.:format)          v1/zombies#index
                   POST   /v1/zombies(.:format)          v1/zombies#create
 new_api_v1_zombie GET    /v1/zombies/new(.:format)      v1/zombies#new
edit_api_v1_zombie GET    /v1/zombies/:id/edit(.:format) v1/zombies#edit
     api_v1_zombie GET    /v1/zombies/:id(.:format)      v1/zombies#show
                   PATCH  /v1/zombies/:id(.:format)      v1/zombies#update
                   PUT    /v1/zombies/:id(.:format)      v1/zombies#update
                   DELETE /v1/zombies/:id(.:format)      v1/zombies#destroy
    api_v2_zombies GET    /v2/zombies(.:format)          v2/zombies#index
                   POST   /v2/zombies(.:format)          v2/zombies#create
 new_api_v2_zombie GET    /v2/zombies/new(.:format)      v2/zombies#new
edit_api_v2_zombie GET    /v2/zombies/:id/edit(.:format) v2/zombies#edit
     api_v2_zombie GET    /v2/zombies/:id(.:format)      v2/zombies#show
                   PATCH  /v2/zombies/:id(.:format)      v2/zombies#update
                   PUT    /v2/zombies/:id(.:format)      v2/zombies#update
                   DELETE /v2/zombies/:id(.:format)      v2/zombies#destroy
```

Before we write any controller code, let's write some route tests. These tests will ensure that our routes are dispatching requests to the proper controller and action.

Let's pick these two entries from `rake routes`:

```ruby
            Prefix Verb   URI Pattern                    Controller#Action
    api_v1_zombies GET    /v1/zombies(.:format)          v1/zombies#index
    api_v2_zombies GET    /v2/zombies(.:format)          v2/zombies#index
```

From these entries, we can see that a GET request to the **/v1/zombies** URI should be mapped to a `ZombiesController` in `v1` and its `index` action; and a GET request to **/v2/zombies**, mapped to a `ZombiesController` in `v2` and its `index` action.

We'll bring these two into our tests: 

```ruby
# test/integration/routes_tests.rb
require 'test_helper'

class RoutesTest < ActionDispatch::IntegrationTest
  test 'routes version' do
    assert_generates '/v1/zombies', { controller: 'v1/zombies', action: 'index' }
    assert_generates '/v2/zombies', { controller: 'v2/zombies', action: 'index' }
  end
end

```

The `assert_generates` method asserts that the provided options can be used to generate the expected path.

Since we have not written our controller code yet, running this test should fail.

Resources defined inside our versioned namespaces are expected to have a matching controller under the same namespace. In this case, we'll need a `ZombiesController` under the *app/controllers/v1* directory:

```ruby
# app/controllers/v1/zombies_controller.rb
module V1
  class ZombiesController < ApplicationController
  end
end
```

and another one under *app/controllers/v2*:

```ruby
# app/controllers/v2/zombies_controller.rb
module V2
  class ZombiesController < ApplicationController
  end
end
```

If we run our routes test now, they should pass.

We've successfully added URI versioning to our API, so that each request gets routed to the proper namespace. Now that our codebase supports multiple versions, we need to be extra careful about how we organize our code.

Let's look at a couple of ways we can avoid code duplication and keep our code organized.

### ApplicationController

While additional major features might be placed under new namespaced versions, we should expect most of our application code to be re-used across all versions.

Suppose our API tracks the IP from each request using a `before_action` and we simply include its value back in the response. We've been doing this since our API version 1, and version 2 should also support this.

This is our **ZombiesController** for v1:

```ruby
# app/controllers/v1/zombies_controller.rb
module V1
  class ZombiesController < ApplicationController
    before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }

    def index
      render json: "#{@remote_ip} Version One!", status: 200
    end
  end
end
```

And our controller for v2:

```ruby
# app/controllers/v2/zombies_controller.rb
module V2
  class ZombiesController < ApplicationController
    before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }

    def index
      render json: "#{@remote_ip} Version Two!", status: 200
    end
  end
end
```

In the previous example, we are repeating the exact same `before_action` on both controllers.

Before we refactor our code to something DRYer, let's write an integration test to make sure we don't break things.

```ruby
# test/integration/changing_api_versions_test.rb
require 'test_helper'

class ChangingApiVersionsTest < ActionDispatch::IntegrationTest
  setup { @ip = '123.123.12.12' }

  test '/v1 returns version 1' do
    get '/v1/zombies', {}, { 'REMOTE_ADDR' => @ip }
    assert_equal 200, response.status
    assert_equal "#{@ip} Version One!", response.body
  end

  test '/v2 returns version 2' do
    get '/v2/zombies', {}, { 'REMOTE_ADDR' => @ip }
    assert_equal 200, response.status
    assert_equal "#{@ip} Version Two!", response.body
  end
end

```

Running the previous test should pass.

To reduce the unnecessary duplication, we'll extract the common code out to **ApplicationController**.

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }
end
```

Both our `V1::ZombiesController` and `V2::ZombiesController` are a bit cleaner now:

```ruby
# app/controllers/v1/zombies_controller.rb
module V1
  class ZombiesController < ApplicationController
    def index
      render json: "#{@remote_ip} using version 1", status: 200
    end
  end
end
```

and

```ruby
module V2
  class ZombiesController < ApplicationController
    def index
      render json: "#{@remote_ip} using version 2", status: 200
    end
  end
end
```

We were able to remove the duplicate code and all our tests should still pass.

A similar approach can be used for code that needs to be shared within only a specific version.

### VersionController

Suppose version 2 of our API needs some special logging feature for auditing reasons. We can't place this feature on **ApplicationController** because we don't want it to run on all API versions - just version 2. 

We'll create a new abstract controller that's specific for version 2. Let's call it **V2::VersionController**:

```ruby
# app/controllers/v2/version_controller.rb
module V2
  class VersionController < BaseController
    abstract!

    before_action :audit_logging

    def audit_logging
      # log stuff
    end
  end
end
```

Since this controller should never have actions of its own, we add `abstract!` to the top of our class. Then, we'll inherit all our version 2 controllers from it:

```ruby
module V2
  class ZombiesController < VersionController
    def index
      render json: "#{@remote_ip} Version Two!"
    end
  end
end
```

## Versioning using the Accept header

[Demo app](https://github.com/codeschool/BananaPodcast/tree/accept_header_version)

Although API versioning using the URI is more common to find in the wild and it's simple to implement, some people don't consider it to be the best strategy. An argument can be made that URIs which API clients can depend on should be preserved over time, and the API version should be indicated elsewhere.

An alternative to using the URI for versioning is including the version number as part of a custom media type. A couple of popular services already provide API versioning this way. [Github](http://developer.github.com/changes/2014-01-07-upcoming-change-to-default-media-type/), for example, uses `application/vnd.github.v3+json` and [Heroku](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api) which uses `application/vnd.heroku+json; version=3`.


The custom media type we'll create for our application is `application/vnd.apocalypse[.version]+json`.

The media type name **application** tells us that the payload is to be treated as part of an application-specific interaction. The **vnd.apocalypse** part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The **+json** part declares JSON is the format used for the response body.

While Rails does have a built in way of registering custom mime types, it doesn't offer an easy way to work with API versioning as part of those media types, so we are going to write our own solution.

### Tests

Let's change our tests to pass our new custom media type using the **Accept** request header.

```ruby
# test/integration/changing_api_versions_test.rb
require 'test_helper'

class ChangingApiVersionsTest < ActionDispatch::IntegrationTest

  setup { @ip = '123.123.12.12' }

  test 'returns version one via Accept header' do
    get '/zombies', {}, { 'REMOTE_ADDR' => @ip, 'Accept' => 'application/vnd.apocalypse.v1+json' }
    assert_equal 200, response.status
    assert_equal "#{@ip} Version One!", response.body
    assert_equal Mime::JSON, response.content_type
  end

  test 'returns version two via Accept header' do
    get '/zombies', {}, { 'REMOTE_ADDR' => @ip, 'Accept' => 'application/vnd.apocalypse.v2+json' }
    assert_equal 200, response.status
    assert_equal "#{@ip} Version Two!", response.body
    assert_equal Mime::JSON, response.content_type
  end
end
```

For the response format our application will use JSON. Responding with a non-standard media type, like our custom `application/vnd.apocalypse[.version]+json` type, wouldn't work nicely with most HTTP clients, and would require unnecessary intervention on the client side. Use of media types that are not registered with the Internet Assigned Number Authority, or [IANA](http://www.iana.org), is discouraged.

### Route Constraint

In our routes, we'll add a constraint that will be used to determine which API version should be used for each client request. When no specific version is requested, then we'll default to using version 2. This is what the second argument to the constructor means.


```ruby
# config/routes.rb
require 'api_version' # this shows up later in the slides

BananaPodcast::Application.routes.draw do

  scope defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiVersion.new('v1') do
      resources :zombies
    end

    scope module: :v2, constraints: ApiVersion.new('v2', true) do
      resources :zombies
    end
  end
end
```

Because we will not be relying on Rails' default content negotiation mechanism, we'll need to set a default value for the response format with `defaults: { format: 'json' }`

Here's what our `ApiVersion` class looks like:

```ruby
# lib/api_version.rb
class ApiVersion
  def initialize(version, default=false)
    @version, @default = version, default
  end

  def matches?(request)
    @default || check_headers(request.headers)
  end

  private
    def check_headers(headers)
      accept = headers['Accept']
      accept && accept.include?("application/vnd.apocalypse.#{@version}+json")
    end
end
```

One last thing we need to do is to go back and change our route test. Because we are no longer using the URI for versioning, we'll simply change our route tests to verify that `/zombies` routes to the correct default version:

```ruby
require 'test_helper'

class RoutesTest < ActionDispatch::IntegrationTest
  test 'defaults to v2' do
    assert_generates '/zombies', { controller: 'v2/zombies', action: 'index' }
  end
end
```

Our `ApiVersion` class is a good start, but it can only get us so far. For a more robust solution for handling versions through the Accept header - maybe if our API needs to handle multiple formats, other than just JSON - we might want to take a look at the [versionist](https://github.com/bploetz/versionist/) gem.

We've covered two ways of versioning our Rails APIs. Currently, there is no definitive answer as to which one is THE best strategy. Nonetheless, as an API developer, we should avoid introducing breaking changes as much as possible so that versioning doesn't become a big issue.

## Inbox

**ACCEPT** -> "here is the mime type that I can understand."
**CONTENT_TYPE** -> "here is the content type of the body I'm sending you."

Inbox:

* Rails Routes -> <http://stackoverflow.com/questions/9627546/api-versioning-for-rails-routes>
* Checking version -> <http://freelancing-gods.com/posts/versioning_your_ap_is>
* Steve Klabnik -> <http://blog.steveklabnik.com/posts/2011-07-03-nobody-understands-rest-or-http#i_want_my_api_to_be_versioned>
* See Service-Oriented Design with Ruby on Rails page 65.
* See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
* See <http://railscasts.com/episodes/350-rest-api-versioning?view=asciicast>
