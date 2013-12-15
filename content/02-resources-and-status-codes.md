# Resources, GET and POST.

This level will cover Resources and Status Codes.

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

Now let's see how to properly build our API in order to respond to client actions on those resources.

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

TODO: cover differences between GET, POST, PUT/PATH, DELETE.

## GET (with API tests)

From the [RFC](http://tools.ietf.org/search/rfc2616#section-9.3):

The GET method means: retrieve whatever information is identified by the URI. 

Two important characteristics about the GET method:

* Safe
* Idempotent

First, it is considered to be a **safe** method because it SHOULD NOT take any action other than retrieval. A **GET** request should not create, update or destroy anything in the database, for example.

The **GET** method also has the property of "idempotence". This means that the side-effects of sequential GET requests to the same URI are the same as for a single request - the application should maintain the same state.

It's worth mentioning one exception that sort of breaks these two rules. For example, if you have an API for an ecommerce application, you might need to track unique views for each product. In this case, it's ok to increment a counter for each GET request to a product URI. I've done this a couple of times myself. The important distinction here is that the user did not request the side-effects, so therefore cannot be held accountable for them.

TODO: Integration tests with rspec-rails. No Capybara, explain why.

```ruby
# spec/requests/zombies_spec.rb
describe "Listing Zombies" do
  describe "GET /zombies" do
    it "responds with success" do
      get zombies_path
      expect(response.status).to be(200)
    end
  end
end
```

TODO: successful response.

## POST (with API tests)

The POST method is used to request that the server accept the entity enclosed in the request as a new representation of the resource at the specified URI. 

If a resource has been created on the origin server, the response SHOULD be 201 (Created) and contain an entity which describes the status of the request and refers to the new resource, and a Location.

TODO: elaborate more.

```ruby
post episodes_url,
  episode: { title: 'Bananas', description: 'Learn about bananas.' }, format: 'json'
  
expect(response.status).to eq(201) # proper code that indicates a new resource was created.
expect(response.header['Location']).to eq(episode_url(Episode.last)) # location of the newly created resouce.
```


## Status Codes

See [Rack::Utils](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L542-L601)

Our previous spec:

```ruby
# spec/requests/zombies_spec.rb
describe "Listing Zombies" do
  describe "GET /zombies" do
    it "responds with success" do
      get zombies_path
      expect(response.status).to be(200)
    end
  end
end
```

Can be written in a more expressive way:


```ruby
# spec/requests/zombies_spec.rb
describe "Listing Zombies" do
  describe "GET /zombies" do
    it "responds with success" do
      get zombies_path
      expect(response.status).to be_successful
    end
  end
end
```


## INBOX

Content below serves as reference.

## Successful

* Respond with 201
* Respond with LOCATION set

## Unsuccessful

* Respond with error type
* Respond with error message
    * Should contain information so the client can fix



## Scaffold status codes.

For testing, see [http://matthewlehner.net/rails-api-testing-guidelines/]().

Use:

  * RSpec
  * jbuilder (for now, because it's out of the box)
  * scaffold (to show what Rails gives us for free)


## Creating a Resource

Full list of status and helper methods: [https://github.com/rack/rack/blob/master/lib/rack/response.rb#L115-L131]()


### Valid Response

> If the POST request succeeds, the server creates an order resource. It then generates an HTTP response with a status code of 201 Created, a Location header containing the newly created order’s URI, and confirmation of the new order’s state in the response body - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

> The Location header that identifies the URI of the newly created order resource is important. Once the client has the URI of its order resource, it can then interact with it via HTTP using GET, PUT, and DELETE. - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.


### Invalid Response

* Client's fault (400)
* Server's error (500)


## Status with no Message Body

From the [RFC](http://www.ietf.org/rfc/rfc2616.txt): 

> For response messages, whether or not a message-body is included with a message is dependent on both the request method and the response status code (section 6.1.1). All responses to the HEAD request method MUST NOT include a message-body, even though the presence of entity- header fields might lead one to believe they do. All 1xx (informational), 204 (no content), and 304 (not modified) responses MUST NOT include a message-body. All other responses do include a message-body, although it MAY be of zero length.)

However, [Rack::Utils also includes 205 in this group](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L604). This is still compliant with the RFC, which states that *(...) The response MUST NOT include an entity*.

> 205 Reset Content

>   The server has fulfilled the request and the user agent SHOULD reset
>   the document view which caused the request to be sent. This response
>   is primarily intended to allow input for actions to take place via
>   user input, followed by a clearing of the form in which the input is
>   given so that the user can easily initiate another input action. The
>   response MUST NOT include an entity

Although browsers don't implement this, it can still be useful for AJAX requests.
