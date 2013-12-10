## Rails APIs and REST

This is a course about building Web APIs in Rails - more specifically REST web APIs in Rails. 

Rails is not **TOTALLY** REST, as purists would argue, but it does give you a great head start for building REST APIs and all the tools you need to customize it to your business needs.

> REST stands for Representational State Transfer, and it's an architectural style for distributed hypermedia systems. 

But what exactly does that mean ?

It means that the web is a distributed system, which clients interact with by means of exchanging representation of **resources**.

By following a limited set of operations, REST allows building a service infrastructure
that can support different types of applications.

## WAT

Before we get too far along into concepts, let's take a look at some practical examples.

If you remember from RFZ2, we looked at how Rails supports RESTful resources out of the box. It uses REST because it's a much better way to develop APIs when compared to other alternatives, like SOAP or XML-RPC.

Let's look at the following example of a resource declaration in our routes file, which should look familiar:

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

Remember when we talked about those limited set of operations ? Well, here they are:

```
GET
POST
GET
PATCH
PUT
DELETE
```

They are HTTP verbs.

The last piece of the puzzle is how to find these resources on the web. This is done through a **Uniform Resource Identifier**, or URI. Here are the different URIs for our zombies resources:

```
/zombies(.:format)
/zombies/new(.:format)
/zombies/:id/edit(.:format)
/zombies/:id(.:format)
```

Now putting it all together, a Web API is a combination of actions, or HTTP verbs, and URIs that point to representations of resources.

*Note: So far, none of this is challenge material. From here, we can either go to content negotiation OR start with integration tests.*


## INBOX

Sections below will likely be left out.


## Non-Hypermedia

Non-hypermedia APIs result in client applications that are brittle. Any change to the state transitions will cause the program to break.

> JSON can't drive a Hypermedia API. - Steve Klabnik.

For example, there's not standard way to add a link to JSON. But you **can** build a new hypermedia type on top of JSON.

## Hypermedia API

Serving information that includes links to more related information. Basically you are serving not only representation of a resource, but also presenting options of actions you can do with with those resources. It's not given to you and it's not part of the standard. It's something that needs to be included as part of the message body, and it's totally up to the developer to do it. It's not a protocol level concern. It's an application level concern.

## On Media Types

The two most important things to look for on a media type:

* Data Elements
* Hypermedia Controls (they do the linking between documents)

The JSON media type: [application/json](http://en.wikipedia.org/wiki/JSON#MIME_type)

## The Resource

> The key abstraction of information in REST is a resource. Any information that can be named can be a resource: a document or image, a temporal service (e.g. "today's weather in Los Angeles"), a collection of other resources, a non-virtual object (e.g. a person), and so on. 

Basically, anything that can be given a name can be a resource.

For example:

  * Today's weather in Orlando -> /weather/orlando
  * The Zombie Leader -> /zombies/leader
  * Patient Zero -> /infected_humans/1
  * Survivors -> /survivors
  * Remaining Medical Kits. -> /medical_kits/remaining

Our web API is the actually mapping between resources and their various representations.

> A resource is a conceptual mapping to a set of entities, not the entity that corresponds to the mapping at any particular point in time.

## Bad Examples

```
GET /zombies/1/delete
GET /zombies/create?name=John
```

It's technically valid, but it's not following the proper semantics.

## Corrected Examples

```
DELETE /zombies/1
POST /zombies
```


### INBOX

Constraints:

  * Client-Server
  * Stateless
  * Caching
  * Uniform Interface (Resources, verbs, HATEOAS)
  * Layered System
  * Code-on-demand

> Our task as an API designer is to figure out a good way to represent the state of our application and then give people tools to modify the state in some way - Steve Klabnik. 'Designing Hypermedia APIs.'


> an action in your application is a combination of two things: an action in the protocol, and a name in a namespace that you control. That’s it. With APIs on the web, that means “HTTP verb + URL.” - Steve Klabnik. 'Designing Hypermedia APIs.'
