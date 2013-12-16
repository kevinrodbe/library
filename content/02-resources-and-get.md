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

> A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.

Our web API is the mapping between resources and their various representations.

The syntax for declaring resources in Rails should already be familiar to you. We've seen it a couple of times in the previous chapter, and it's super simple:

```ruby
resources :zombies
```

Resources can also be singular,

```ruby
resource :session
```

which would generate a different set of actions:

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

These are the two GET routes we'll implement for our zombies resources:
 
```
    zombies GET    /zombies(.:format)          zombies#index
     zombie GET    /zombies/:id(.:format)      zombies#show
```

The route to `/zombies/:id/edit` returns an edit form for an existing resource. Since we won't be serving HTML forms from our web API, we'll exclude `new` and `edit`.

```ruby
resources :zombies, except: [:new, :edit]
```

Two important characteristics about the GET method:

* Safe
* Idempotent

First, it is considered to be a **safe** method because it SHOULD NOT take any action other than retrieval. A **GET** request should not create, update or destroy anything in the database.

The **GET** method also has the property of "idempotence". This means that the side-effects of sequential GET requests to the same URI are the same as for a single request - the application should maintain the same state.

It's worth mentioning there might be some exceptions to this rule. One example would be a visitor counter.

An API for an ecommerce application might need to track unique views for each product. In this case, it's ok to increment a counter on each GET request to a product URI. I've done this a couple of times myself. The important distinction here is that the user did not request the side-effects, so therefore cannot be held accountable for them.

## RSpec Rails

To better understand how Rails implements REST, let's write some basic API integration tests.

So, integration tests... you mean Capybara ? 

Well, Capybara is **not** the best option when it comes to API testing because its DSL mimics the language an actual user would use when interacting with the **browser**. When it comes to web APIs, actions like *click_link*, *fill_in*, *select_from* and others are not part of our domain.

> Do not test APIs with Capybara. It wasn’t designed for it. 
- Jonas Nicklas, the creator of Capybara.

So we'll stick with RSpec and rspec-rails:

```
group :test, :development do
  gem 'rspec-rails', '2.14.0'
end
```

We run `bundle` to resolve our dependencies and `rails g rspec:install` to create our `spec/spec_helper.rb` for us. 

To create our integration test, we run `rails g integration_test listing_zombies` which creates the **spec/requests/listing_zombies_spec.rb** file.

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

The status code for a successful response from a GET request is typically **200**. We'll look more into the different types of status codes later, but the **200's** class of status code indicates the client's request was successfully received, understood, and accepted.

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
    @zombies = Zombie.all
    render json: @zombies
  end
end
```

Unless an error occurs, the default status code is 200. I prefer to always be more explicit when it comes to status code, and we can do that by passing the status as a hash option.

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    @zombies = Zombie.all
    render json: @zombies, status: 200
  end
end
```

or in a more expressive way

```ruby
# app/controllers/api/zombies_controller.rb
class API::ZombiesController < ApplicationController
  def index
    @zombies = Zombie.all
    render json: @zombies, status: :ok
  end
end
```

which translates to a 200 status code.

Lastly, successful GET requests are expected to include the resource in the response body. We are already doing that by rendering the `@zombies` in JSON format. Let's add a simple expectation to verify that.

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

The default routes provided by Rails resources don't adopt the use of query strings for identifying resources. 

```
# BAD BAD BAD
/zombies?id=1
```

All information needed to find a specific resource is included as part of the URI.

```
/zombies
/zombies/:id
/zombies/:id/victims
/zombies/:id/victims/:id
```

In REST, most URIs will not use any query strings but there are some situations when it's ok to use them. Some examples are:

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
