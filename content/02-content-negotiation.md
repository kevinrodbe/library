# What is ?

TODO: Explain what content negotiation is.

From [Content Negotiation](http://en.wikipedia.org/wiki/Content_negotiation):

> (...)  the process of selecting the best representation for a given response when there are multiple representations available.

## The Rails Way

For default resources,

```ruby
resources :zombies
```

Rails gives us a way to switch response content format by using an extension,

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

The default response format is HTML. If we want JSON, we can simply add `.json` to the URI:

```ruby
api.ZombieBroadcast.com/zombies.json
```

TODO: show example of response in JSON

or if we wanted XML,

```ruby
api.ZombieBroadcast.com/zombies.xml
```

While this allows for exploring the API from your browser, for example, this strategy should be avoided.

> URIs should be opaque to consumers. Only the issuer of the URI knows how to interpret and map it to a resource. Using extensions such as .xml, .html, or .json is a historical convention that stems from the time when web servers simply mapped URIs directly to files. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)


TODO: add language example.

* Rails Guides on [locale using Accept-Language](http://guides.rubyonrails.org/i18n.html#using-accept-language)
* https://github.com/iain/http_accept_language


> Using content negotiation, consumers can negotiate for specific representation formats from a service. They do so by populating the HTTP Accept request header with a list of media types they’re prepared to process. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)



According to the [RFC](http://tools.ietf.org/html/rfc2616#section-12), the HTTP protocol offers the following header fields to be used in order to help the server determine which content type the client expects:

* Accept* (section 14.1), 
* Accept-Charset (section 14.2),
* Accept-Encoding (section 14.3),
* Accept-Language (section 14.4)
* User-Agent (section 14.43)


## INBOX

Content below is likely to be moved around or removed.

## Rails format extensions

Rails allows you to select different content types by appending extensions to URL, like `/users.json` or `/posts/1.xml`. While this allows for exploring the API from your browser, for example, this strategy should be avoided.

> URIs should be opaque to consumers. Only the issuer of the URI knows how to interpret and map it to a resource. Using extensions such as .xml, .html, or .json is a historical convention that stems from the time when web servers simply mapped URIs directly to files. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

> Using content negotiation, consumers can negotiate for specific representation formats from a service. They do so by populating the HTTP Accept request header with a list of media types they’re prepared to process. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)

## Available Mime::Types

For a complete list of the default Mime Types that ship with Rails, run the following command from a Rails console:

```ruby
Mime::SET.collect(&:to_s)
```

To register new Mime Types, or if you happen to want to use a custom Mime Types, see the *config/initializers/mime_types.rb* file.


## Challenge Suggestion

* Add RSS Mime Type ?
* Add iCal Mime Type ?
