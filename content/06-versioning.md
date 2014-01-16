## API Versioning and Custom Media Type

Once our API is deployed to production and clients start relying on it, any change or new feature that needs to be introduced will need to be done so in a way that doesn't disrupt existing clients.

Versioning our API helps prevent major changes from breaking existing API clients. Every time a new, backwards-incompatible change needs to be made, we create a new API version and add the change only to this new version. This way, old clients relying in previous versions are not be affected.

There are multiple strategies to API versioning and we are going to be looking at the two most popular:

  * Using the URI
  * Using the **Accept** header

## Versioning using the URI

The simplest and most straight forward way to version our API is to add the version to the URI:

```
api.ZombieApocalypse.com/v1/zombies
api.ZombieApocalypse.com/v2/humans
```

Including the API version in the URI makes it easy to see which version is being used just by looking at it. It also allows us to test our API using the browser, which is pretty handy.

To add support for versioned URIs in our Rails app, we first add a **namespace** for each version supported by our application:

```ruby
# config/routes.rb
namespace :api, path: '/', constraints: { subdomain: 'api' } do
  namespace :v1 do
    resources :zombies
  end

  namespace :v2 do
    resources :zombies
  end
end
```

If we run `rake routes`, we'll see the URI patterns for both versions of our Zombies resources:

```
Prefix Verb   URI Pattern                    Controller#Action
    api_v1_zombies GET    /v1/zombies(.:format)          api/v1/zombies#index
                   POST   /v1/zombies(.:format)          api/v1/zombies#create
 new_api_v1_zombie GET    /v1/zombies/new(.:format)      api/v1/zombies#new
edit_api_v1_zombie GET    /v1/zombies/:id/edit(.:format) api/v1/zombies#edit
     api_v1_zombie GET    /v1/zombies/:id(.:format)      api/v1/zombies#show
                   PATCH  /v1/zombies/:id(.:format)      api/v1/zombies#update
                   PUT    /v1/zombies/:id(.:format)      api/v1/zombies#update
                   DELETE /v1/zombies/:id(.:format)      api/v1/zombies#destroy
    api_v2_zombies GET    /v2/zombies(.:format)          api/v2/zombies#index
                   POST   /v2/zombies(.:format)          api/v2/zombies#create
 new_api_v2_zombie GET    /v2/zombies/new(.:format)      api/v2/zombies#new
edit_api_v2_zombie GET    /v2/zombies/:id/edit(.:format) api/v2/zombies#edit
     api_v2_zombie GET    /v2/zombies/:id(.:format)      api/v2/zombies#show
                   PATCH  /v2/zombies/:id(.:format)      api/v2/zombies#update
                   PUT    /v2/zombies/:id(.:format)      api/v2/zombies#update
                   DELETE /v2/zombies/:id(.:format)      api/v2/zombies#destroy
```

Before we write any controller code, let's write some routing specs. These specs will ensure that our routes are dispatching requests to the proper controller and action.

Let's pick these two entries from `rake routes`:

```ruby
Prefix Verb   URI Pattern                    Controller#Action
    api_v1_zombies GET    /v1/zombies(.:format)          api/v1/zombies#index
    api_v2_zombies GET    /v2/zombies(.:format)          api/v2/zombies#index
```

From these entries, we can see that a GET request to the **/v1/zombies** URI should be mapped to a `ZombiesController` in `api/v1/` and its `index` action; and a GET request to **/v2/zombies**, mapped to a `ZombiesController` in `api/v2` and its `index` action.

We'll translate these two requirements to our spec: 

```ruby
# spec/routing/listing_zombies_spec.rb
require 'spec_helper'

describe 'Listing Zombies' do
  context 'for API version 1' do
    it { expect(get: '/v1/zombies').to route_to(controller: 'api/v1/zombies', action: 'index') }
  end

  context 'for API version 2' do
    it { expect(get: '/v2/zombies').to route_to(controller: 'api/v2/zombies', action: 'index') }
  end
end
```

Since we have not written our controller code yet, running this spec should fail.

Resources defined inside our versioned namespaces are expected to have a matching controller under the same namespace. In this case, we'll need a `ZombiesController` under the *app/controllers/api/v1* directory:

```ruby
# app/controllers/api/v1/zombies_controller.rb
module API
  module V1
    class ZombiesController < ApplicationController
    end
  end
end
```

and another one under *app/controllers/api/v2*:

```ruby
# app/controllers/api/v2/zombies_controller.rb
module API
  module V2
    class ZombiesController < ApplicationController
    end
  end
end
```

If we run our routing spec now, it should pass.

We've successfully added URI versioning to our API, so that each request gets routed to the proper namespace. Now that our codebase supports multiple versions, we need to be extra careful about how we organize our code.

Let's look at a couple of ways we can avoid code duplication and keep our code organized.

### API::BaseController

While additional major features might be placed under new namespaced versions, we should expect most of our application code to be re-used across all versions.

Suppose our API tracks the IP from each request using a `before_action` and we simply include its value back in the response. We've been doing this since our API version 1, and version 2 should also support this.

This is our **ZombiesController** for v1:

```ruby
# app/controllers/api/v1/zombies_controller.rb
module API
  module V1
    class ZombiesController < ApplicationController

      before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }

      def index
        render text: "#{@remote_ip} using version 1", status: 200
      end
    end
  end
end
```

And our controller for v2:

```ruby
# app/controllers/api/v2/zombies_controller.rb
module API
  module V2
    class ZombiesController < ApplicationController

      before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }

      def index
        render text: "#{@remote_ip} using version 2", status: 200
      end
    end
  end
end
```

In the previous example, we repeat the exact same `before_action` on both controllers.

Before we refactor our code to something DRYer, let's write a request spec to make sure we don't break things.

```ruby
describe 'Listing Zombies' do
  let(:ip) { '123.123.123.123' }

  context 'using V1' do
    it 'returns version one' do
      get '/v1/zombies', {}, { 'REMOTE_ADDR' => ip }
      expect(response).to be_success
      expect(response.body).to eq("#{ip} using version 1")
    end
  end

  context 'using V2' do
    it 'returns version two' do
      get '/v2/zombies', {}, { 'REMOTE_ADDR' => ip }
      expect(response).to be_success
      expect(response.body).to eq("#{ip} using version 2")
    end
  end
end
```

Running the previous spec should pass.

To reduce the unnecessary duplication, we'll extract the common code out to an **API::BaseController** class.

```ruby
# app/controllers/api/base_controller.rb
module API
  class BaseController < ApplicationController
    abstract!

    before_action ->{ @remote_ip = request.headers['REMOTE_ADDR'] }
  end
end
```

We add `abstract!` to the top of our **API::BaseController** controller, since this controller should never have actions of its own.

Then, we'll use the **API::BaseController** class as the base class for our controllers across all different API versions:

```ruby
# app/controllers/api/v1/zombies_controller.rb
module API
  module V1
    class ZombiesController < BaseController # instead of ApplicationController
      def index
        render text: "#{@remote_ip} using version 1", status: 200
      end
    end
  end
end
```

```ruby
module API
  module V2
    class ZombiesController < BaseController # instead of ApplicationController
      def index
        render text: "#{@remote_ip} using version 2", status: 200
      end
    end
  end
end
```

We were able to remove the duplicate code and all our tests should still pass. We can now use **API::BaseController** for code common to all API versions.

We can use a similar approach for code that needs to be shared within only a specific version.

### VersionController

Suppose version 2 of our API needs some special logging feature for auditing reasons. We can't place this feature on **API::BaseController** because we don't want it to run on previous API versions. We'll create a new abstract controller that's specific for version 2. Let's call it **API::V2::VersionController**:

```ruby
# app/controllers/api/v2/version_controller.rb
module API
  module V2
    class VersionController < BaseController
      abstract!

      before_action :audit_logging

      def audit_logging
        # log stuff
      end
    end
  end
end
```

Then, we'll inherit all our version 2 controllers from it:

```ruby
module API
  module V2
    class ZombiesController < VersionController
      def index
        render text: "#{@remote_ip} Version Two!"
      end
    end
  end
end
```

## Versioning using the Accept header


Although API versioning using the URI is more common to find in the wild and it's simple to implement, some people don't consider it to be the best strategy. An argument can be made that URIs which API clients can depend on should be preserved over time, so embedding information that’s likely to change into them make them unstable and reduce their value.

An alternative to using the URI for versioning is including the version number as part of a custom media type. A couple of popular services are already doing this, like [Github](http://developer.github.com/changes/2014-01-07-upcoming-change-to-default-media-type/) and [Heroku](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api).


Here is what our custom media type will look like: `application/vnd.apocalypse[.version]+json`.

The media type name **application** tells us that the payload is to be treated as part of an application-specific interaction. The **vnd.apocalypse** part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The **+json** part declares JSON is the format used for the response body.

While Rails does have a built in way of registering custom mime types, it doesn't offer an easy way to work with custom mime types with API versioning, so we are going to write our own solution.

### Request Specs

Let's change our request spec to pass our custom media type using the **Accept** header instead of URI. For the time being, our custom media type will only serve JSON responses.

```ruby
describe 'Listing Zombies' do
  let(:ip) { '123.123.123' }

  context 'using V1' do
    it 'returns version one' do
      get '/zombies', {}, { 'REMOTE_ADDR' => ip, 'HTTP_ACCEPT' => 'application/vnd.apocalypse.v1+json' }
      expect(response).to be_success
      expect(response.body).to eq("#{ip} Version One!")
      expect(response.content_type).to eq(Mime::JSON)
    end
  end

  context 'using V2' do
    it 'returns version two' do
      get '/zombies', {}, { 'REMOTE_ADDR' => ip, 'HTTP_ACCEPT' => 'application/vnd.apocalypse.v2+json' }
      expect(response).to be_success
      expect(response.body).to eq("#{ip} Version Two!")
      expect(response.content_type).to eq(Mime::JSON)
    end
  end
end
```

### Route Constraint

In our routes, we'll add a constraint that will be used to determine which API version should be used for each client request. When no specific version is requested, then we'll default to using version 2. This is what the second argument to the constructor means.

Because we will not be relying on Rails' default content negotiation mechanism, we'll need to set a default value for the response format with `defaults: { format: 'json' }`

```ruby
# config/routes.rb
require 'api_version' # this shows up later in the slides

BananaPodcast::Application.routes.draw do
  namespace :api, path: '/', defaults: { format: 'json' } do
    scope module: :v1, constraints: ApiVersion.new('v1') do
      resources :zombies
    end

    scope module: :v2, constraints: ApiVersion.new('v2', true) do
      resources :zombies
    end
  end

end
```

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

With these changes in place, our request specs are now passing but our routing spec is failing.

WHOOPS!

Because we've set the default format for json, we need to change our routing spec:

```ruby
describe 'Changing versions spec' do
  context 'the default version' do
    it { expect(get: '/zombies').to route_to(controller: 'api/v2/zombies', action: 'index', format: 'json') }
  end
end
```
Our `ApiVersion` class is a good start, but it can only get us so far. For a more robust solution for handling versions through the Accept header - maybe if our API needs to handle multiple formats, other than just JSON - we might want to take a look at the [versionist](https://github.com/bploetz/versionist/) gem.

## Conclusion

We've covered two ways of versioning our Rails APIs. Currently, there is no definitive answer as to which is THE best strategy, so it really depends on how you want to handle it. Nonetheless, as an API developer, you should avoid introducing breaking changes as much as possible so that versioning doesn't become a big issue. Make as many of your changes as backwards-compatible as possible.

## Inbox

**ACCEPT** -> "here is the mime type that I can understand."
**CONTENT_TYPE** -> "here is the content type of the body I'm sending you."

Inbox:

* Rails Routes -> [http://stackoverflow.com/questions/9627546/api-versioning-for-rails-routes]()
* Checking version -> [http://freelancing-gods.com/posts/versioning_your_ap_is]()
* Steve Klabnik -> [http://blog.steveklabnik.com/posts/2011-07-03-nobody-understands-rest-or-http#i_want_my_api_to_be_versioned]()
* See [http://developer.github.com/v3/media/](http://developer.github.com/v3/media/) for example of API version in header
* See Service-Oriented Design with Ruby on Rails page 65.
* See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
* See [http://railscasts.com/episodes/350-rest-api-versioning?view=asciicast]()
