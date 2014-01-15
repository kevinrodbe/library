## API Versioning and Custom Media Type

Once our API is deployed to production and clients start relying on it, any change or new feature that needs to be introduced will need to be done so in a way that doesn't disrupt existing clients.

Versioning our API helps prevent major changes from breaking existing API clients. Everytime a new, backwards-incompatible change needs to be made, we create a new API version and add the change only to this new version. This way, old clients relying in previous versions are not be affected.

We are going to be looking at two ways to version our Rails API:

  * Using the URI
  * Using the **Accept** header

## Versioning using the URI

The easiest and most straight forward way to version our API is to add the version to the URI:

```
api.ZombieApocalypse.com/v1/zombies
api.ZombieApocalypse.com/v2/humans
```

Including the API version in the URL makes it easy to see which version is being used by simply looking at it. It also allows us to test our API using the browser, which is pretty handy.

To add support for API versions in our Rails app URIs, we first add a **namespace** for each version supported by our application:

```ruby
# config/routes.rb
namespace :api, path: '/' do
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

Before we write any of our controller code, let's write some routing specs. TODO: elaborate on routing specs.

Let's pick these two entries from `rake routes`:

```ruby
Prefix Verb   URI Pattern                    Controller#Action
    api_v1_zombies GET    /v1/zombies(.:format)          api/v1/zombies#index
    api_v2_zombies GET    /v2/zombies(.:format)          api/v2/zombies#index
```

From these entries, we can see that a GET request to the **/v1/zombies** URI should be mapped to a `ZombiesController` in `api/v1/` and its `index` action; and a GET request to **/v2/zombies**, mapped to a `ZombiesController` in `api/v2` and its `index` action.

We'll translate these two requirements into our routing spec: 

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

### API::BaseController

While additional major features might be placed under new namespace versions, we should expect most of our application code to be re-used across all versions.

Suppose our API tracks the IP from each request using a `before_action` and we simply include its value back in the response. We've been doing this since our API version 1, and version 2 still supports it.

This is our **ZombiesController** for v1:

```ruby
# app/controllers/api/v1/zombies_controller.rb
module API
  module V1
    class ZombiesController < ApplicationController

      before_action :track_ip

      def index
        render text: "#{@remote_ip} using version 1", status: 200
      end

      protected
        def track_ip
          @remote_ip = request.headers['REMOTE_ADDR']
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

      before_action :track_ip

      def index
        render text: "#{@remote_ip} using version 2", status: 200
      end

      protected
        def track_ip
          @remote_ip = request.headers['REMOTE_ADDR']
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
    before_action :track_ip

    protected
      def track_ip
        @remote_ip = request.headers['REMOTE_ADDR']
      end
  end
end
```

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

We were able to remove duplicate code and all our tests should still pass. You can now use **API::BaseController** to place any code common to all API versions, like authentication, auditing, logging, etc.

## Versioning using the Accept header

Why not use version on the URI ?

> Because URIs are used in the Web as the fundamental identifier by so many things — caches, spiders, forms, and so on — embedding information that’s likely to change into them make them unstable, thereby reducing their value. For example, a cache invalidates content associated with a URL when a POST request flows through it; if the URL is different because there are different versions floating around, it doesn’t work.

TODO: Elaborate; See [Github API](http://developer.github.com/changes/2014-01-07-upcoming-change-to-default-media-type/) and [Heroku](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api)
TODO: add ApiVersion constraint to routes and scope controllers to proper version module.

Our custom media type will be `application/vnd.apocalypse[.version]+json`.

The media type name **application** tells us that the payload is to be treated as part of an application-specific interaction. The **vnd.apocalypse** part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The **+json** part declares JSON is the format used for the response body.

Let's go to `config/initializers/mime_types.rb` and register our custom `apocalypse` media type for version 1 of our API:

```ruby
Mime::Type.register 'application/vnd.apocalypse.v1+json', :apocalypse_v1
```

Back in our controller, we need to add an entry to `respond_to` with our custom format. Inside of the `format.apocalypse_v1` block, we'll call our JSON serializer:

```ruby
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.apocalypse_v1 { render json: @zombies, status: 200 }
  end
end
```

We can now ask for our custom mime type:

```
$ curl -H "Accept: application/vnd.apocalypse.v1+json" \
  http://api.ZombieBroadcast.com/zombies
```

And we'll get our proper response back:

```
[{"id":1,"name":"Jon","age":21,"created_at":"2013-12-13T17:00:21.925Z",
"updated_at":"2013-12-13T17:00:21.925Z"},{"id":2,"name":"Angela",
"age":251,"created_at":"2013-12-13T17:00:21.949Z",
"updated_at":"2013-12-13T17:00:21.949Z"}]
```

If we look at the response Headers, we'll notice the server sent back the correct media type under the **Content-Type** Header.

```
HTTP/1.1 200 OK
Content-Type: application/vnd.apocalypse.v1+json; charset=utf-8 # W00t
```

On the previous level, we've looked at using the `respond_to` method for detecting the correct media type request by the client. Another method we can use is `respond_with`. To use `respond_with` from our controller action, we first need to call `respond_to` from our controller class, which tells the controller which formats to respond to:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1
end
```

If we needed to be able to respond to multiple formats, then we could pass multiple arguments to the `respond_to` method:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1, :json, :xml
end
```

From our controller action, we call `respond_with` passing in our model or collection of models as an argument. Rails automatically figures out what format the current request expects.

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1

  def index
    @zombies = Zombie.all
    respond_with(@zombies)
  end
end
```

One last thing we need to do is add a template for the `apocalypse_v1` format. The template name needs to include the mime type as part of its extension, so for the index action we'll name it *app/views/zombies/index.apocalypse_v1.jbuilder* and we'll use jbuilder to produce a JSON response:

```ruby
# app/views/zombies/index.apocalypse_v1.jbuilder
json.array!(@zombies) do |zombie|
  json.extract! zombie, :name, :age
  json.url zombie_url(zombie, format: :json)
end
```

If we wanted to avoid using templates, we could pass a block to `respond_with`, similar to how we were doing it previously in **respond_to**:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1

  def index
    @zombies = Zombie.all
    respond_with(@zombies) do |format|
      format.apocalypse_v1 { render json: @zombies }
    end
  end
end
```


If you need to POST a custom Mime Type, then you need to tell Rails how to parse its content: (TODO: elaborate more on this.)

> From Nate: It's actually somewhat uncommon that you'd have someone POSTing a custom format into your app.

```ruby
# config/initializers/mime_type.rb
Mime::Type.register 'application/vnd.apocalypse+json', :apocalypse_v1
ActionDispatch::ParamsParser::DEFAULT_PARSERS[Mime::APOCALYPSE]= :json
```

**ACCEPT** -> "here is the mime type that I can understand."
**CONTENT_TYPE** -> "here is the content type of the body I'm sending you."


The biggest take away: try as hard as possible to not introduce breaking changes so that versioning isn’t a big issue; make as many of your changes backwards-compatible as possible.


Inbox:

* Rails Routes -> [http://stackoverflow.com/questions/9627546/api-versioning-for-rails-routes]()
* Checking version -> [http://freelancing-gods.com/posts/versioning_your_ap_is]()
* Steve Klabnik -> [http://blog.steveklabnik.com/posts/2011-07-03-nobody-understands-rest-or-http#i_want_my_api_to_be_versioned]()
* See [http://developer.github.com/v3/media/](http://developer.github.com/v3/media/) for example of API version in header
* See Service-Oriented Design with Ruby on Rails page 65.
* See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
* See [http://railscasts.com/episodes/350-rest-api-versioning?view=asciicast]()
