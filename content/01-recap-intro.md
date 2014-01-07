# Rails APIs and REST

This is a course about building Web APIs in Rails - more specifically REST web APIs in Rails. 

> REST stands for Representational State Transfer, and it's an architectural style for distributed hypermedia systems. 

But what exactly does this mean ?

The web is a distributed system, which clients interact with by means of exchanging representation of **resources**. By following a strict set of operations, REST allows building a service infrastructure that can support different types of applications.

This means a single web API can serve different clients simultaneously, like a rich JavaScript web application, a mobile client like an iPhone or Android, or a command line application, like the Heroku Toolbelt or the github command line application hub. These are all examples of clients that rely on a backend API to serve information.

*(should we include the following disclaimer, at all ?)* Disclaimer: Rails is not **TOTALLY** REST, since it lacks a proper media type with **hypermedia** controls. However, it does give us a great head start for building REST APIs.

## WAT

Before we get too far along into concepts, let's take a look at some practical examples.

If you remember from RFZ2, we looked at how Rails supports RESTful resources out of the box. It uses REST because it's a much better way to develop APIs when compared to other alternatives, like SOAP or XML-RPC.

Let's look at the following example of a resource declaration in a routes file. This should look familiar:

```ruby
# config/routes.rb
resources :zombies
```

To see the different ways we can interact with zombie resources, we can type `rake routes` on the terminal, and we should see a list like this one:

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

Remember when we talked about following a strict set of operations ? Well, here they are:

```
GET
POST
PATCH
PUT
DELETE
```

They are HTTP verbs, or methods, and they dictate the different things we can do with the zombie resources.

The last piece of the puzzle is how to find these resources on the web. This is done through a **Uniform Resource Identifier**, or [URI](http://tools.ietf.org/html/rfc6570). Here are the different URIs for our zombies resources:

```
/zombies(.:format)
/zombies/new(.:format)
/zombies/:id/edit(.:format)
/zombies/:id(.:format)
```


Now putting it all together, a Web API is a combination of actions, or HTTP verbs, and URIs that point to representations of resources.

*Note: So far, none of the content is challenge material. Challenge material starts on the next section.*

## ONLY and EXCEPT

The default resource declaration allows for all CRUD (Create, Retrieve, Update, Delete) operations to be performed:

```ruby
resources :zombies
```

This allows for creating, reading, updating and deleting zombies. 

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

Suppose we want to limit the actions that can be performed on the zombies resources. The `resources` method takes an options hash as its second argument. Two options that we can use to control which actions we want to allow on the resources are `only` and `except`.

```ruby
resources :zombies, only: :index
```

With the previous code, when we run `rake routes` we now see a different output:

```
    Prefix Verb URI Pattern        Controller#Action
   zombies GET /zombies(.:format) zombies#index
```

If instead we wanted to prevent our API from exposing the endpoint that destroys zombie resources, we could use `except`:

```ruby
resources :zombies, except: :destroy
```

Notice the missing entry for DELETE:

```
     Prefix Verb  URI Pattern                 Controller#Action
    zombies GET   /zombies(.:format)          zombies#index
            POST  /zombies(.:format)          zombies#create
 new_zombie GET   /zombies/new(.:format)      zombies#new
edit_zombie GET   /zombies/:id/edit(.:format) zombies#edit
     zombie GET   /zombies/:id(.:format)      zombies#show
            PATCH /zombies/:id(.:format)      zombies#update
            PUT   /zombies/:id(.:format)      zombies#update
```

Both options can also take an array:

```ruby
resources :zombies, only: [:index, :show]
```

or

```ruby
resources :zombies, except: [:update, :destroy]
```

It's a good practice to limit your API end points to only those that will actually be used by our clients.


## CONSTRAINTS and NAMESPACE

**Main website**: ZombieBroadcast.com, serves users with a browser and a mouse.

**API root**: api.ZombieBroadcast.com, serves other applications.

Giving our API its own subdomain is a good approach for a couple reasons.

First, it allows us to decouple our public facing website from our backend API and deploy them to different servers. If for some reason our website server goes down, then our API will not be affected. 

The other benefit is the ability to scale our applications individually. If our API starts getting lots of access, we can load balance traffic at the DNS level, which is a way faster alternative than doing it from our app servers. 

On most projects, I've found that it's easier to start with a single Rails codebase for both the backend API and the web client. Assuming our API root is located at [api.zombiebroadcast.com](), let's see how we can organize our routes and ensure that access to our API comes strictly from the **api** subdomain.

### CONSTRAINTS

```ruby
resources :zombies, constraints: { subdomain: 'api' } # i.e., api.ZombieBroadcast.com/zombies
resources :humans, constraints: { subdomain: 'api' } # i.e., api.ZombieBroadcast.com/humans
```

or

```ruby
constraints(subdomain: 'api') do
  resources :zombies
  resources :humans
end
```

In order to run this locally you will need to do one of the followings:

  * Edit /etc/hosts
  * Use [POW](http://pow.cx)
  * Access your app through a service like http://lvh.me

TODO: describe editing /etc/hosts.

From Jacob:

> Biggest advantage of using the subdomain is scalability. You can tweak your API be at a completely different IP address and you get more flexibility. Start with a single app and then you can split into different apps if you need.

### NAMESPACE

Since our codebase is also serving a web version of our application, we need to be extra careful with organizing our file structure. Specially our controllers. We don't want to mix controllers that serve our API with ones that serve our website, so we are going to create a different namespace for the API controllers.

```ruby
constraints subdomain: 'api' do
  namespace :api do
    resources :zombies
    resources :humans
  end
end
```

All of our API controllers will now be properly placed under the **api** namespace:

```
         Prefix Verb   URI Pattern                     Controller#Action
    api_zombies GET    /api/zombies(.:format)          api/zombies#index {:subdomain=>"api"}
                POST   /api/zombies(.:format)          api/zombies#create {:subdomain=>"api"}
 new_api_zombie GET    /api/zombies/new(.:format)      api/zombies#new {:subdomain=>"api"}
edit_api_zombie GET    /api/zombies/:id/edit(.:format) api/zombies#edit {:subdomain=>"api"}
     api_zombie GET    /api/zombies/:id(.:format)      api/zombies#show {:subdomain=>"api"}
                PATCH  /api/zombies/:id(.:format)      api/zombies#update {:subdomain=>"api"}
                PUT    /api/zombies/:id(.:format)      api/zombies#update {:subdomain=>"api"}
                DELETE /api/zombies/:id(.:format)      api/zombies#destroy {:subdomain=>"api"}
     api_humans GET    /api/humans(.:format)           api/humans#index {:subdomain=>"api"}
                POST   /api/humans(.:format)           api/humans#create {:subdomain=>"api"}
  new_api_human GET    /api/humans/new(.:format)       api/humans#new {:subdomain=>"api"}
 edit_api_human GET    /api/humans/:id/edit(.:format)  api/humans#edit {:subdomain=>"api"}
      api_human GET    /api/humans/:id(.:format)       api/humans#show {:subdomain=>"api"}
                PATCH  /api/humans/:id(.:format)       api/humans#update {:subdomain=>"api"}
                PUT    /api/humans/:id(.:format)       api/humans#update {:subdomain=>"api"}
                DELETE /api/humans/:id(.:format)       api/humans#destroy {:subdomain=>"api"}
```

This means we'll need to place our API controllers under the `app/controllers/api` directory, and our API controller classes are now part of the `Api` module, like so:

```ruby
# app/controllers/api
class Api::ZombiesController < ApplicationController
end
```

Notice we now have **api** both in our URI and as our subdomain, i.e. [api.ZombieBroadcast/api/zombies]() and [api.ZombieBroadcast/api/humans](). 

We can remove this duplication by overriding the **path** option in our namespace and setting it to either `nil` or `'/'`. I personally prefer `'/'`, so let's go with that for now:

```ruby
constraints subdomain: 'api' do
  namespace :api, path: '/' do
    resources :zombies
    resources :humans
  end
end
```

Now our routes look much better:

```
         Prefix Verb   URI Pattern                 Controller#Action
    api_zombies GET    /zombies(.:format)          api/zombies#index {:subdomain=>"api"}
                POST   /zombies(.:format)          api/zombies#create {:subdomain=>"api"}
 new_api_zombie GET    /zombies/new(.:format)      api/zombies#new {:subdomain=>"api"}
edit_api_zombie GET    /zombies/:id/edit(.:format) api/zombies#edit {:subdomain=>"api"}
     api_zombie GET    /zombies/:id(.:format)      api/zombies#show {:subdomain=>"api"}
                PATCH  /zombies/:id(.:format)      api/zombies#update {:subdomain=>"api"}
                PUT    /zombies/:id(.:format)      api/zombies#update {:subdomain=>"api"}
                DELETE /zombies/:id(.:format)      api/zombies#destroy {:subdomain=>"api"}
     api_humans GET    /humans(.:format)           api/humans#index {:subdomain=>"api"}
                POST   /humans(.:format)           api/humans#create {:subdomain=>"api"}
  new_api_human GET    /humans/new(.:format)       api/humans#new {:subdomain=>"api"}
 edit_api_human GET    /humans/:id/edit(.:format)  api/humans#edit {:subdomain=>"api"}
      api_human GET    /humans/:id(.:format)       api/humans#show {:subdomain=>"api"}
                PATCH  /humans/:id(.:format)       api/humans#update {:subdomain=>"api"}
                PUT    /humans/:id(.:format)       api/humans#update {:subdomain=>"api"}
                DELETE /humans/:id(.:format)       api/humans#destroy {:subdomain=>"api"}
```

We can also move the `namespace` definition next to `constraints`, and make it all one line. It's a small change, but I find this way to be a little bit easier to read.

```ruby
namespace :api, path: '/', constraints: { subdomain: 'api' } do
  resources :zombies
  resources :humans
end
```

Looking back to our controller, it feels a little weird to see *Api* for the module name, when we are used to writing it all in caps everywhere else, like *API*. To fix this, we can tweak our *config/initializers/inflections.rb* file and add an entry for the acronym:

```ruby
ActiveSupport::Inflector.inflections(:en) do |inflect|
  inflect.acronym 'API'
end
```

Now back to our controller, we can change it to use **API** all in caps:

```ruby
# app/controllers/api
class API::ZombiesController < ApplicationController
end
```

Much better now.
