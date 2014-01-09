# Resources and GET

This level covers Resources and the GET HTTP verb.

TODO: introduce the concept of **HEADER**.

x- headers are non-standard headers.

## Resources

The key abstraction of information in REST is a **resource**. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. 

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
    zombies GET    /zombies(.:format)          zombies#index
            POST   /zombies(.:format)          zombies#create
 new_zombie GET    /zombies/new(.:format)      zombies#new
edit_zombie GET    /zombies/:id/edit(.:format) zombies#edit
     zombie GET    /zombies/:id(.:format)      zombies#show
            PATCH  /zombies/:id(.:format)      zombies#update
            PUT    /zombies/:id(.:format)      zombies#update
            DELETE /zombies/:id(.:format)      zombies#destroy
```

Now let's see how to properly build our API in order to respond to client actions on those resources. We'll start with the GET method.


## GET /zombies

From the [RFC](http://tools.ietf.org/search/rfc2616#section-9.3):

The GET method means

> retrieve whatever information is identified by the URI. 

These are the two GET routes we'll implement for our zombies resources:
 
```
    zombies GET    /zombies(.:format)          zombies#index
     zombie GET    /zombies/:id(.:format)      zombies#show
```

The routes to `/zombies/new` and `/zombies/:id/edit` return HTML forms for both creating new resources and for updating existing ones. Since we won't be serving any HTML from our web API, we'll exclude `new` and `edit`.

```ruby
resources :zombies, except: [:new, :edit]
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

So we'll stick with RSpec request specs using rspec-rails:

```
group :test, :development do
  gem 'rspec-rails', '2.14.0'
end
```

We run `bundle` to resolve our dependencies and `rails g rspec:install` to create our `spec/spec_helper.rb` for us. 

To create our first integration test, or request spec, we run `rails g integration_test listing_zombies` which creates the **spec/requests/listing_zombies_spec.rb** file.

Let's replace the content of that file with the following:

```ruby
# spec/requests/listing_zombies_spec.rb
describe "Listing Zombies" do

  describe "GET /zombies" do
    it "responds with success" do
      get zombies_url
      expect(response.status).to be(200)
    end
  end

end
```

The status code for a successful response from a GET request is typically **200**. We'll look more into the different types of status codes later, but the **200** class of status code indicates the client's request was successfully received, understood, and accepted.

Another way we can write our example is using a more general matcher, `be_success` or `be_successful`:

```ruby
# spec/requests/listing_zombies_spec.rb
describe "Listing Zombies" do

  describe "GET /zombies" do
    it "responds with success" do
      get zombies_url
      expect(response).to be_success
      expect(response).to be_successful
    end
  end

end
```

This matcher is a bit more general, and it will return true for any status code >= 200 and < 300.

Back in our controller, we setup the proper response:

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    zombies = Zombie.all
    render json: zombies
  end
end
```

Unless an error occurs, the default status code is 200. I prefer to be explicit when it comes to status codes, and we can do that by passing the status as a hash option.

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    zombies = Zombie.all
    render json: zombies, status: 200
  end
end
```

or in a more expressive way

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    zombies = Zombie.all
    render json: zombies, status: :ok
  end
end
```

which translates to a 200 status code.

Lastly, successful GET requests are expected to include the resource in the response body. We are already doing that by rendering the `zombies` in JSON format. Let's add a simple expectation to verify that.

```ruby
# spec/requests/listing_zombies_spec.rb
describe "Listing Zombies" do

  describe "GET /zombies" do
    it "responds with success" do
      get zombies_url
      expect(response).to be(200)
      expect(response.body).not_to be_empty
    end
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
class API::ZombiesController < ApplicationController
  def index
    zombies = Zombie.all # remember, starting in Rails 4 this returns a chainable scope
    if weapon = params[:weapon]
      zombies = zombies.where(weapon: weapon)
    end
    render json: zombies, status: 200
  end
end
```

In our test code, we want to start by creating two zombies with two different weapons. Then, we want to issue a GET request to our zombies endpoint passing in the **weapon** query string.

The last step is verifying that our action only returns zombies that use that weapon. In order to do that, we need to parse the response using `JSON.parse`.

```ruby
# spec/request/listing_zombies_spec.rb
require 'spec_helper'

describe "Listing Zombies" do

  describe "GET /zombies" do

    context 'filtering by weapon' do

      it 'returns zombies with specified weapon' do
        Zombie.create!(name: 'Joanna', weapon: 'axe')
        Zombie.create!(name: 'John', weapon: 'shotgun')

        get api_zombies_url(weapon: 'axe') # becomes http://api.example.com/zombies?weapon=axe
        expect(response.status).to be(200)

        zombies = JSON.parse(response.body, symbolize_names: true)
        names = zombies.collect { |z| z[:name] }
        expect(names).to include('Joanna')
        expect(names).to_not include('John')
      end
    end
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
require 'spec_helper'

describe "Finding Zombies" do

  describe "GET /zombies/:id" do
    it 'finds a zombie from its id' do
      zombie = Zombie.create!(name: 'Joanna')

      get api_zombie_url(zombie) # becomes http://api.example.com/zombies/1
      expect(response.status).to be(200)

      zombie_response = JSON.parse(response.body, symbolize_names: true)
      expect(zombie_response[:name]).to eq(zombie.name)
    end
  end
end
```

The route helper `api_zombie_url(zombie)` gets translated to the URI `http://api.example.com/zombies/:id` which is routed to the `API::Zombies#show` controller action.

We have two assertions. The first one checks for the 200 status code, meaning the response is successful, and the other one verifies the proper Zombie was returned by checking its name. 

Our controller code to make the tests pass is pretty simple. Just find the Zombie and return its JSON representation along with the 200 status code.

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def show
    zombie = Zombie.find(params[:id])
    render json: zombie, status: 200
  end
end
```

## Extracting a helper method

We'll be doing a lot of JSON parsing in our integration tests. Manually calling `JSON.parse(response.body, symbolize_names: true)` every time we need to parse a response to JSON can quickly become tedious, so let's see how we can extract that to an RSpec helper method.

We can define helper methods in a module and include them in our integration tests using RSpec's **config.include** option. Let's create a new file under *spec/support/request_helpers.rb* and add our new module:

```ruby
# spec/support/request_helpers.rb
module RequestHelpers
  def json(body)
    JSON.parse(body, symbolize_names: true)
  end
end

RSpec.configure do |config|
  config.include RequestHelpers, type: :request
end
```

The `type: :request` option ensures that our **RequestHelpers** module is only mixed into request type specs.

Back in our request specs we can replace our call to `JSON.parse` with our `json` helper method:

```ruby
require 'spec_helper'

describe "Finding Zombies" do

  describe "GET /zombies/:id" do
    it 'finds a zombie from its id' do
      zombie = Zombie.create!(name: 'Joanna')

      get api_zombie_url(zombie)
      expect(response.status).to be(200)

      zombie_response = json(response.body)
      expect(zombie_response[:name]).to eq(zombie.name)
    end
  end
end
```