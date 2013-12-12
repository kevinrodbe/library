# Rails API Course

This is the repo for the Rails API Course, including [content](content) and [code examples](/code).

## Demo app

Following the *Zombie Apocalypse Broadcast* theme, here's an idea for a demo web API:

1. Get a list of infected humans. (**GET** to /infected_humans or /humans?status=infected)
2. For each human, find the medical kit they need. (we can follow **hyperlink** for medical kit)
3. Purchase the medical kit. (**POST** to /medical_kits/:id/purchase)
4. Apply medical kit to respective human. (**PATCH** /humans/:id)

## Table of Contents

(WIP)

1. [Route Constraints + Namespace](content/01-recap-intro.md) (complete)
2. [Content Negotiation](content/02-content-negotiation.md) (in progress)
3. Status Codes
4. Creating Resources
5. Versioning
6. Authentication 

## TODOS

* Chapter 1 - Recaps from RFZ2
* Starting in Rails 2 - RESTful resources, using proper HTTP verbs.
* REST = Representational State Transfer. Resources (noun) addressable through URI and accessible via Methods (verbs), GET, POST, PUT, PATCH, DELETE, HEAD
* [GUID](http://en.wikipedia.org/wiki/Globally_unique_identifier)
    * Using the uuid datatype with the PostgreSQL adapter
    * https://coderwall.com/p/n_0awq
    * Gotcha: http://rny.io/rails/postgresql/2013/07/27/use-uuids-in-rails-4-with-postgresql.html
* Multiple gets
    * /api/v1/groups?ids=1,2
    * /api/v1/groups?page=10

* [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)

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