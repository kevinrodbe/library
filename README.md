# Rails API Course

This is the repo for the Rails API Course, including [content](content) and [code examples](/code).

## Todo / Resources

* Section on versioning
    * Three types: /api/v1/users, /api/users?version=1, /api/users (Headers: Accept )
    * See Service-Oriented Design with Ruby on Rails page 65.
    * See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)

* [GUID](http://en.wikipedia.org/wiki/Globally_unique_identifier)
    * Using the uuid datatype with the PostgreSQL adapter
    * https://coderwall.com/p/n_0awq
    * Gotcha: http://rny.io/rails/postgresql/2013/07/27/use-uuids-in-rails-4-with-postgresql.html

* Multiple gets
    * /api/v1/groups?ids=1,2
    * /api/v1/groups?page=10

* Optimization
    * Remove unecessary middlewares + Benchmark.

* [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
