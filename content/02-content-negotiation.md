# Content Negotiation

Content Negotiation is the process in which an API client and the API server determine the best representation for a given response when there are multiple representations available. (From [Content Negotiation](http://en.wikipedia.org/wiki/Content_negotiation))

We don't typically talk about this when serving web pages because the only representation that browsers understand is HTML.

But web APIs are different. They need to be flexible and cater to different types of clients.

In this level we are going to look at how to negotiate different characteristics of the response:

1. Media-Type
2. Language
4. User Agent (??)
3. Encoding (??)


## Media Types The Rails Way

A media type specifies the scheme, or the format, of the response.

For default resources,

```ruby
resources :zombies
```

Rails gives us a way to switch between different formats by adding an extension to the URI itself. This is what the `(.:format)` portion of the output from `rake routes` means.

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

The default media type is `text/html`. If we want `application/json` instead, the media type for JSON, we can simply add `.json` to the URI:

```ruby
api.ZombieBroadcast.com/zombies.json
```

Assuming we have a proper JSON serializer in place, then our server responds with a JSON string:

```
[{"id":1,"name":"Jon","age":123,"created_at":"2013-12-12T20:01:24.586Z",
"updated_at":"2013-12-12T20:01:24.586Z"},{"id":2,"name":"Isabella","age":93,
"created_at":"2013-12-12T20:01:25.196Z","updated_at":"2013-12-12T20:01:25.196Z"}]
```

If we want `application/xml`, the media type for XML, then simply adding a `.xml` will do it: 

```ruby
api.ZombieBroadcast.com/zombies.xml
```

which results in a response in XML:

```
<?xml version="1.0" encoding="UTF-8"?>
<zombies type="array">
  <zombie>
    <id type="integer">1</id>
    <name>Jon</name>
    <age type="integer">123</age>
    <created-at type="dateTime">2013-12-12T20:01:24Z</created-at>
    <updated-at type="dateTime">2013-12-12T20:01:24Z</updated-at>
  </zombie>
  <zombie>
    <id type="integer">2</id>
    <name>Isabella</name>
    <age type="integer">93</age>
    <created-at type="dateTime">2013-12-12T20:01:25Z</created-at>
    <updated-at type="dateTime">2013-12-12T20:01:25Z</updated-at>
  </zombie>
</zombies>
```

So can we just add an extension for **any** media type that's out there, and Rails will just know what to do ? 

Not quite. Rails ships with 21 different media types out of the box. If we ask for a format that's unknown to Rails, then we'll get back a `406 - Not Acceptable` response.

**Foot note**: For the complete list of formats supported by Rails, type `Mime::SET` from your Rails console - or `Mime::SET.collect(&:to_s)` for a more readable response.


## Adding a custom Mime Type

TODO: Add reasons we'd want to use a custom Mime Type.

Our custom media type will be `application/vnd.apocalypse+json`.

The media type name tells us that the payload of the HTTP request or response is to be treated as part of an application-specific interaction. The vnd.apocalypse part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The +json part declares JSON is used for the document formatting.

Let's go to `config/initializers/mime_types.rb` and add our custom `apocalypse` media type there:

```ruby
# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
# Mime::Type.register_alias "text/html", :iphone
Mime::Type.register_alias 'application/vnd.apocalypse+json', :apocalypse
```

In our controller, we need to respond with the proper format. We can do this in a couple of different ways. 

One way is using the `respond_to` method that takes a block.

```
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.html # looks for index.html.erb template
    format.apocalypse {}
  end
end
```

Inside of the `format.apocalypse` block, we'll call our custom serializer that returns the proper media type. For now, we'll use the json serializer for simplicity:

```
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.html
    format.apocalypse { render json: @zombies }
  end
end
```

We can now ask for our custom format:

```ruby
api.ZombieBroadcast.com/zombies.apocalypse
```

And we'll get our response back using our custom serializer - which is simply JSON for now:

```
[{"id":1,"name":"Jon","age":21,"created_at":"2013-12-13T17:00:21.925Z",
"updated_at":"2013-12-13T17:00:21.925Z"},{"id":2,"name":"Angela",
"age":251,"created_at":"2013-12-13T17:00:21.949Z",
"updated_at":"2013-12-13T17:00:21.949Z"}]
```

If we look at the response Headers, we'll notice the server sent back the correct media type under the **Content-Type** Header.

```
HTTP/1.1 200 OK
Content-Type: application/vnd.apocalypse+json; charset=utf-8 # W00t
```

Another method we can use is the `respond_to/respond_with`. We first call `respond_to :apocalypse`, usually at the top of our controller. Then, we simply call `respond_with(@zombies)`, and it will automatically figure out what format the client is expecting.

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse

  def index
    @zombies = Zombie.all
    respond_with(@zombies)
  end
end
```

One last thing we need to do, is to add a template for the `apocalypse` format. Again, for simplicity, we'll simply return JSON format using a jbuilder template.

```ruby
# app/views/zombies/index.apocalypse.jbuilder
json.array!(@zombies) do |zombie|
  json.extract! zombie, :name, :age
  json.url zombie_url(zombie, format: :json)
end
```

If we wanted to stay away from templates, we could pass a block to `respond_with`, similar to how we were doing it previously:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse

  def index
    @zombies = Zombie.all
    respond_with(@zombies) do |format|
      format.apocalypse { render json: @zombies }
    end
  end
end
```

As we'll see later (or not?), a custom Media Type also allows us add Hypermedia capabilities to our response.

## A better way

While tweaking the URI allows for quickly switching between media types, and even helps with exploring the API from our browser, this strategy should be avoided.

> URIs should be opaque to consumers. Only the issuer of the URI knows how to interpret and map it to a resource. Using extensions such as .xml, .html, or .json is a historical convention that stems from the time when web servers simply mapped URIs directly to files. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

So far, when we talked about the HTTP protocol we talked about two things: URIs and actions, or HTTP verbs. Turns out we can also exchange information through **Headers**.

> Using content negotiation, consumers can negotiate for specific representation formats from a service. They do so by populating the HTTP Accept request header with a list of media types they’re prepared to process. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

The [HTTP protocol](http://tools.ietf.org/html/rfc2616#section-12) offers a couple of different request Headers clients can use to help the server determine which format is expected:

* Accept* (section 14.1),
* Accept-Charset (section 14.2),
* Accept-Encoding (section 14.3),
* Accept-Language (section 14.4)
* User-Agent (section 14.43)

How does that affect us, when developing a Rails API ?

First, we should never rely on URI extensions for determining format. Luckly, if we just use Rails' default tools, we don't have to worry about it:

* respond_to + block
* respond_to :type + respond_with()


## Custom Mime Types



TODO: add language example.

* Rails Guides on [locale using Accept-Language](http://guides.rubyonrails.org/i18n.html#using-accept-language)
* https://github.com/iain/http_accept_language

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
