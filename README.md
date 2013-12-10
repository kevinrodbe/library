# Rails API Course

This is the repo for the Rails API Course, including [content](content) and [code examples](/code).

## Demo app

Following the *Zombie Apocalypse Broadcast* theme, here's an example of using the web API from a given API client:

1- Get a list of infected humans. (**GET** to /infected_humans)
2- For each human, find the medical kit they need. (we can follow **hyperlink** for medical kit)
3- Purchase the medical kit. (**POST** to /medical_kits/:id/purchase)
4- Apply medical kit to respective human. (**PATCH** /humans/:id)

## TODOS

* Chapter 1 - Recaps from RFZ2
* Starting in Rails 2 - RESTful resources, using proper HTTP verbs.
* REST = Representational State Transfer. Resources (noun) addressable through URI and accessible via Methods (verbs), GET, POST, PUT, PATCH, DELETE, HEAD
* Section on API versioning
    * Three ways: /api/v1/users, /api/users?version=1, /api/users (Headers: Accept )
    * See Service-Oriented Design with Ruby on Rails page 65.
    * See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
* [GUID](http://en.wikipedia.org/wiki/Globally_unique_identifier)
    * Using the uuid datatype with the PostgreSQL adapter
    * https://coderwall.com/p/n_0awq
    * Gotcha: http://rny.io/rails/postgresql/2013/07/27/use-uuids-in-rails-4-with-postgresql.html

* Multiple gets
    * /api/v1/groups?ids=1,2
    * /api/v1/groups?page=10

* [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
