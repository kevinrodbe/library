# Resources and GET

This level covers Resources and the GET HTTP verb.

## Resources

> The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. 

> Resources are the fundamental building blocks of web-based systems, to the extent that the Web is often referred to as being “resource-oriented.

> Resources themselves are not tied to a database, a model, or a controller. They are a high-level description of the thing you’re trying to get hold of when you submit a request. What you actually do get hold of is never the resource itself, but a representation of it.

Basically, anything that can be given a name can be a resource.

For example:

  * Today's weather in Orlando -> /weather/orlando
  * The Zombie Leader -> /zombies/leader
  * Patient Zero -> /infected_humans/1
  * Survivors -> /survivors
  * Remaining Medical Kits. -> /medical_kits/remaining

Our web API is the mapping between resources and their various representations.

> A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.

The syntax for declaring resources in Rails should already be familiar to you. We've seen it a couple of times in the previous chapter, and it's super simple:

```ruby
resources :zombies
```

Resources can also be singular,

```ruby
resources :zombies
resource :session
resource :zombie_leader
```

## Resources CRUD

By using the `resources` method in `config/routes.rb` file, Rails automatically sets up the routes for the basic CRUD operations.

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


## GET (with API tests)

From the [RFC](http://tools.ietf.org/search/rfc2616#section-9.3):

The GET method means

> retrieve whatever information is identified by the URI. 

These are the two GET routes we'll implement:
 
```
    zombies GET    /zombies(.:format)          zombies#index
     zombie GET    /zombies/:id(.:format)      zombies#show
```

The route to `/zombies/:id/edit` returns an edit form for an existing resource. Since we won't be serving HTML forms from our web API, we'll skip that one.

Two important characteristics about the GET method:

* Safe
* Idempotent

First, it is considered to be a **safe** method because it SHOULD NOT take any action other than retrieval. A **GET** request should not create, update or destroy anything in the database, for example.

The **GET** method also has the property of "idempotence". This means that the side-effects of sequential GET requests to the same URI are the same as for a single request - the application should maintain the same state.

It's worth mentioning one exception that sort of breaks this rule. For example, if you have an API for an ecommerce application, you might need to track unique views for each product. In this case, it's ok to increment a counter on each GET request to a product URI. I've done this a couple of times myself. The important distinction here is that the user did not request the side-effects, so therefore cannot be held accountable for them.

## RSpec Rails

In order to test our API, we will write integration tests.

So, integration tests... you mean Capybara ? Capybara is **not** the best option when it comes to API testing because its DSL mimics the language an actual user would use when interacting with the **browser**. When it comes to web APIs, actions like *click_link*, *fill_in*, *select_from* and others are not part of our domain.

> Do not test APIs with Capybara. It wasn’t designed for it. 
- Jonas Nicklas, the creator of Capybara.

So we'll stick with RSpec and rspec-rails:

```
group :test, :development do
  gem 'rspec-rails', '2.14.0'
end
```

Then we run `bundle` to resolve our dependencies and `rails g rspec:install` to create our `spec/spec_helper.rb` for us. To create our integration test, we run `rails g integration_test listing_zombies` which creates the **spec/requests/listing_zombies_spec.rb** file.

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

Back in our controller, we setup the proper response:

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    @zombies = Zombie.all
    render json: @zombies
  end
end
```

## Query Strings

When it's ok to use them:

* Search, `/zombies?keyword=john`
* Filter, `/zombies?weapon=axe`
* Pagination, `/zombies?page=2&per_page=25`

TODO: elaborate.

```ruby
# spec/request/listing_zombies_spec.rb
require 'spec_helper'

describe "Listing Zombies" do

  describe "GET /zombies" do

    context 'filtering by weapon' do
      before do
        @john = Zombie.create!(name: 'John', weapon: 'axe')
        @joanna = Zombie.create!(name: 'Joanna', weapon: 'shotgun')
      end

      it 'returns zombies with specified weapon' do
        get api_zombies_url(weapon: 'axe')
        expect(response.status).to be(200)

        zombies = JSON.parse(response.body, symbolize_names: true)
        names = zombies.collect { |z| z[:name] }
        expect(names).to include('John')
        expect(names).to_not include('Joanna')
      end
    end
  end
end
```

Back in our controller

```ruby
class API::ZombiesController < ApplicationController
  def index
    @zombies = Zombie.all # remember, starting in Rails 4 this returns a chainable scope
    if weapon = params[:weapon]
      @zombies = @zombies.where(weapon: weapon)
    end
    render json: @zombies
  end
end
```
