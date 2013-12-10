## Rails APIs and REST

This is a course about building Web APIs in Rails - more specifically REST web API in Rails.
Rails is not TOTALLY Rest, but it gives you a great head start for building REST APIs and all the tools you need to customize it to your business needs.

> REST stands for Representational State Transfer, and it's an architectural style for distributed hypermedia systems. REST provides a set of architectural constraints that, when applied as a whole, emphasizes scalability of component interactions, generality of interfaces, independent deployment of components, and intermediary components to reduce interaction latency, enforce security, and encapsulate legacy systems.

For this course, we will follow some of REST's principles and take full advantage of the HTTP procotol. Rails uses REST because it's a much better way to develop APIs when compared to other alternatives, like XML-RPC and SOAP.

Constraints:

  * Client-Server
  * Stateless
  * Caching
  * Uniform Interface (Resources, verbs, HATEOAS)
  * Layered System
  * Code-on-demand

> Our task as an API designer is to figure out a good way to represent the state of our application and then give people tools to modify the state in some way - Steve Klabnik. 'Designing Hypermedia APIs.'

Web API = HTTP verb + URL (or URI).

> an action in your application is a combination of two things: an action in the protocol, and a name in a namespace that you control. That’s it. With APIs on the web, that means “HTTP verb + URL.” - Steve Klabnik. 'Designing Hypermedia APIs.'

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
