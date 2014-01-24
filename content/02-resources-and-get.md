# Resources and GET

[Demo app](https://github.com/codeschool/BananaPodcast/tree/resources_and_get)

This level covers Resources and the GET HTTP verb.

## Resources

The key abstraction of information in REST APIs is a **resource**. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Florida"), a collection of other resources, a non-virtual object (e.g. a person), and so on. 

> Resources are the fundamental building blocks of web-based systems, to the extent that the Web is often referred to as being “resource-oriented.

Resources themselves are not tied to a database, a model, or a controller. They are a high-level description of the thing you’re trying to get hold of when you submit a request. What you actually do get hold of is never the resource itself, but a representation of it.

Basically, anything that can be given a name can be a resource.

For example:

  * Today's weather in Orlando -> /weather/orlando
  * The Zombie Leader -> /zombies/leader
  * Patient Zero -> /infected_humans/1
  * Survivors -> /survivors
  * Remaining Medical Kits. -> /medical_kits/remaining

> A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time. - Steve Klabnik, Designing Hypermedia APIs

Our web API is the mapping between resources and their various representations.

The syntax for declaring resources in Rails should already be familiar to you. We've seen it a couple of times in the previous chapter:

```ruby
resources :zombies
```

Resources can also be singular,

```ruby
resource :session
```

which generates a different set of actions:

```
$ rake routes
      Prefix Verb   URI Pattern             Controller#Action
     session POST   /session(.:format)      sessions#create
 new_session GET    /session/new(.:format)  sessions#new
edit_session GET    /session/edit(.:format) sessions#edit
             GET    /session(.:format)      sessions#show
             PATCH  /session(.:format)      sessions#update
             PUT    /session(.:format)      sessions#update
             DELETE /session(.:format)      sessions#destroy
```

Because we are declaring a single resource for session, notice the missing **index** action and how the **show** action doesn't require an **id**.

## Resources CRUD

By using the `resources` method in the `config/routes.rb` file, Rails automatically sets up the routes for the basic CRUD operations.

```
     Prefix Verb   URI Pattern                 Controller#Action
    zombies GET    /zombies(.:format)          api/zombies#index
            POST   /zombies(.:format)          api/zombies#create
 new_zombie GET    /zombies/new(.:format)      api/zombies#new
edit_zombie GET    /zombies/:id/edit(.:format) api/zombies#edit
     zombie GET    /zombies/:id(.:format)      api/zombies#show
            PATCH  /zombies/:id(.:format)      api/zombies#update
            PUT    /zombies/:id(.:format)      api/zombies#update
            DELETE /zombies/:id(.:format)      api/zombies#destroy
```

Now let's see how to properly build our API in order to respond to client actions on those resources. We'll start with the GET method.


## GET /zombies

From the [RFC](http://tools.ietf.org/search/rfc2616#section-9.3):

The GET method means

> retrieve whatever information is identified by the URI. 

These are the two GET routes we'll implement for our zombies resources:
 
```
    zombies GET    /zombies(.:format)          api/zombies#index
     zombie GET    /zombies/:id(.:format)      api/zombies#show
```

The routes to `/zombies/new` and `/zombies/:id/edit` return HTML forms for both creating new resources and for updating existing ones. Since we won't be serving any HTML from our web API, we'll exclude `new` and `edit`.

```ruby
namespace :api, path: '/', constraints: { subdomain: 'api' } do
  resources :zombies, except: [:new, :edit]
end
```

Two important characteristics about the GET method:

* Safe
* Idempotent

First, it is considered to be a **safe** method because it SHOULD NOT take any action other than retrieval. Safe methods are used to **read** resources from a server. A **GET** request should not create, update or destroy anything in the database.

The **GET** method also has the property of **idempotence**. This means that the side-effects of sequential GET requests to the same URI are the same as for a single request - the application should maintain the same state.

It's worth mentioning there might be some exceptions to this rule. One example is a view counter.

An API for an ecommerce application might need to track unique views for each product. In this case, it's ok to increment a counter on each GET request to a product URI. I've done this a couple of times myself. The important distinction here is that the user did not request the side-effects, so therefore cannot be held accountable for them.

## API Tests

To better understand how Rails implements REST, let's write some basic API integration tests which will represent client interactions with our API.

So, integration tests... you mean Capybara ?

Well, Capybara is **not** the best option when it comes to API testing because its DSL mimics the language an actual user would use when interacting with the **browser**. When it comes to web APIs, actions like *click_link*, *fill_in*, *select_from* and others are not part of our domain.

> Do not test APIs with Capybara. It wasn’t designed for it. 
- Jonas Nicklas, the creator of Capybara.

So we'll stick with MiniTest, used by Rails' `ActiveSupport::TestCase`

To create our first integration test we run `rails g integration_test listing_zombies` which creates the **test/integration/listing_zombies_test.rb** file.

Let's replace the content of that file with the following:

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns list of all zombies' do
    get '/zombies'
    assert_equal 200, response.status
  end
end
```

Every HTTP response includes a status code, which is a 3-digit integer result code of the attempt to understand and satisfy the request.

```
GET /zombies
HTTP/1.1 200 OK # 200 status code
```

The first digit of the status code defines the class of response. The 200 class means the action was successfully received, understood, and accepted by the server.

Another way we can write our asserting is by calling utility methods added by `Rack::Test`

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns list of all zombies' do
    get '/zombies'
    assert_equal 200, response.status
    assert response.success?
    assert response.successful?
  end
end
```

The difference between `success?` and `successful?` is that the latter is a bit more general, and it will return true for any status code >= 200 and < 300.

Back in our controller, we setup the proper response:

```ruby
# app/controllers/api/zombies_controller.rb
module API
  class ZombiesController < ApplicationController
    def index
      zombies = Zombie.all
      render json: zombies
    end
  end
end
```

Unless an error occurs, the default status code is 200. I prefer to be explicit when it comes to status codes, and we can do that by passing the status as a hash option.

```ruby
# app/controllers/api/zombies_controller.rb
module API
  class ZombiesController < ApplicationController
    def index
      zombies = Zombie.all
      render json: zombies, status: 200
    end
  end
end
```

or in a more expressive way

```ruby
# app/controllers/api/zombies_controller.rb
module API
  class ZombiesController < ApplicationController
    def index
      zombies = Zombie.all
      render json: zombies, status: :ok
    end
  end
end
```

which translates to a 200 status code.

Lastly, successful GET requests are expected to include the resource in the response body. We are already doing that by rendering the `zombies` in JSON format. Let's add a simple assertion to verify that.

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns list of all zombies' do
    get '/zombies'
    assert_equal 200, response.status
    refute_empty response.body
  end
end
```

## Query Strings

The style of URI paths used by Rails is called [Path Segmented Expansion](http://tools.ietf.org/html/rfc6570#section-3.2.6).

All information needed to find a specific resource is included as part of the URI and separated by the slash ("/") operator.

```
/zombies
/zombies/:id
/zombies/:id/victims
/zombies/:id/victims/:id
```

For the default resource routes, Rails ignores URL query strings for identifying resources.

```
# routes to Zombies#index
# and NOT to Zombies#show
/zombies?id=1
```

In REST, most URIs will not depend on query strings but there are some situations when it's ok to use them. Some examples are:

* Search, `/zombies?keyword=john`
* Filter, `/zombies?weapon=axe`
* Pagination, `/zombies?page=2&per_page=25`

Let's look at an example of a filter.

In the following code, we want to list all zombies whose weapons are an **axe**. We will pass the weapon name as a query string, which looks like this:

```
/zombies?weapon=axe
```

In our controller, we access the query string from the `params` object:

```ruby
module API
  class ZombiesController < ApplicationController
    def index
      zombies = Zombie.all # remember, starting in Rails 4 this returns a chainable scope
      if weapon = params[:weapon]
        zombies = zombies.where(weapon: weapon)
      end
      render json: zombies, status: 200
    end
  end
end
```

In our test code, we want to start by creating two zombies with two different weapons. Then, we want to issue a GET request to our zombies endpoint passing in the **weapon** query string.

The last step is verifying that our action only returns zombies that use that weapon. In order to do that, we need to parse the response using `JSON.parse`.

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns zombies filtered by weapon' do
    john = Zombie.create!(name: 'John', weapon: 'axe')
    joanna = Zombie.create!(name: 'Joanna', weapon: 'shotgun')

    get '/zombies?weapon=axe'
    assert_equal 200, response.status

    zombies = JSON.parse(response.body, symbolize_names: true)
    names = zombies.collect { |z| z[:name] }
    assert_includes names, 'John'
    refute_includes names, 'Joanna'
  end
end
```

Notice the second argument to the `JSON.parse` method, called **symbolize_names**. As the name implies, this option transforms the keys so we can access them using symbols instead of string,

```ruby
{'id'=>51, 'name'=>"John"}
# becomes
{:id=>51, :name=>"John"}
```

It's not required to transform these keys into symbols, but it's pretty handy since that's the way we typically build and access hashes in Ruby.

## GET /zombies/:id

We've seen how to list zombies. Now, let's see how to fetch a specific Zombie based on its id.

First, the test code:

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns zombie by id' do
    zombie = Zombie.create!(name: 'Joanna', weapon: 'axe')
    get "/zombies/#{zombie.id}" # we could also use api_zombies_url(zombie) here
    assert_equal 200, response.status

    zombie_response = JSON.parse(response.body, symbolize_names: true)
    assert_equal zombie.name, zombie_response[:name]
  end
end
```

We have two assertions. The first one checks for the 200 status code, meaning the response is successful, and the other one verifies the proper Zombie was returned by checking its name. 

Our controller code to make the tests pass is pretty simple. Just find the Zombie and return its JSON representation along with the 200 status code.

```ruby
# app/controllers/api/zombies_controller.rb
module API
  class ZombiesController < ApplicationController
    def show
      zombie = Zombie.find(params[:id])
      render json: zombie, status: 200
    end
  end
end
```

## Extracting a helper method

We'll be doing a lot of JSON parsing in our integration tests. Manually calling `JSON.parse(response.body, symbolize_names: true)` every time we need to parse a response to JSON can quickly become tedious, so let's see how we can extract that to a MiniTest helper method.

We can define helper methods in our `test/test_helper.rb` file.

```ruby
ENV["RAILS_ENV"] ||= "test"
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/pride' # require this to display colored output

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!
  fixtures :all

  def json(body)
    JSON.parse(body, symbolize_names: true)
  end
end
```

Now back in our test file we can replace calls to `JSON.parse` with our new `json` helper method:

```ruby
require 'test_helper'

class ListingZombies < ActionDispatch::IntegrationTest
  setup do
    host! 'api.example.com'
  end

  test 'returns zombie by id' do
    zombie = Zombie.create!(name: 'Joanna', weapon: 'axe')
    get "/zombies/#{zombie.id}"
    assert_equal 200, response.status

    zombie_response = json(response.body)
    assert_equal zombie.name, zombie_response[:name]
  end
end
```

## cURL

Finally, let's look at one other way we can test our web API by issuing real HTTP requests over the network and checking the response. We'll use a command line networking tool called **curl**.

**curl** is shipped with OS X. It should be available on most unix/gnu linux package repositories and you can also find an installer for Windows machines.

Because we'll be issuing real network calls, we'll need to make sure our Rails application is running and accessible via an IP address or URL.

First, a simple GET request to list all zombies:

```
$ curl http://api.cs-zombies-dev.com:3000/zombies
[{"id":5,"name":"Joanna","age":null,"created_at":"2014-01-17T18:40:40.195Z",
"updated_at":"2014-01-17T18:40:40.195Z","weapon":"axe"},
{"id":6,"name":"John","age":null,"created_at":"2014-01-17T18:40:40.218Z",
"updated_at":"2014-01-17T18:40:40.218Z","weapon":"shotgun"}]
```

Now all zombies that use an axe as a weapon:

```
$ curl http://api.cs-zombies-dev.com:3000/zombies?weapon=axe
[{"id":7,"name":"Joanna","age":123,"created_at":"2014-01-17T18:42:47.026Z",
"updated_at":"2014-01-17T18:42:47.026Z","weapon":"axe"}]
```

Now just a specific zombie:

```
$ curl http://api.cs-zombies-dev.com:3000/zombies/7
{"id":7,"name":"Joanna","age":123,"created_at":"2014-01-17T18:42:47.026Z",
"updated_at":"2014-01-17T18:42:47.026Z","weapon":"axe"}
```

Alongside the status code, responses also send back **Headers**.

Headers are like labels that we stick on an envelope. They include additional information that API clients can use to make decisions.

> Headers are like labels that we stick on an envelope to ensure that it’s delivered to the right place and to set processing context for the contents - REST in Practice.

We can ask curl to show response headers with the `-I` option:

```
$ curl -I http://api.cs-zombies-dev.com:3000/zombies/7
HTTP/1.1 200 OK
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-UA-Compatible: chrome=1
Content-Type: application/json; charset=utf-8
ETag: "d8d0d08eb205a5fc46794b29d470396c"
Cache-Control: max-age=0, private, must-revalidate
Set-Cookie: request_method=HEAD; path=/
X-Request-Id: 52c8162f-2407-4e70-a69f-2d10665029a5
X-Runtime: 0.380513
Connection: close
Server: thin 1.5.0 codename Knife
```

As we move along, we'll be looking at some other options we can pass to curl, but for now this should be enough to get through the next set of challenges as we reach the end of this level.