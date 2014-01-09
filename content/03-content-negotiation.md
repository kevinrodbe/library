# Content Negotiation

Content Negotiation is the process in which an API client and the API server determine the best representation for a given response when there are multiple representations available. (From [Content Negotiation](http://en.wikipedia.org/wiki/Content_negotiation))

We don't typically talk about this when serving web pages because the only representation that browsers understand is HTML. But web APIs are different. They need to be flexible and cater to different types of clients.

In this level we are going to look at how to negotiate two different characteristics of the response:

1. Media-Type
2. Language

## Media Types The Rails Way

A media type specifies the scheme of the response and helps clients identify the format of the payload, like HTML, XML or JSON for example.

For Rails resources defined with the **resources** method

```ruby
resources :zombies
```

there's a simple way to switch between different formats, by adding an extension to the URI when making a request to the server. This is what the `(.:format)` portion of the output from `rake routes` means.

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

The default media type is `text/html`, which serves responses in HTML format. 

If a client wants to request `application/json` instead, a media type that serves JSON format, then they simply add `.json` to the URI:

```ruby
api.ZombieBroadcast.com/zombies.json
```

But before our API is actually able to generate proper JSON responses, we need to add JSON support to our **ZombiesController**. One way we can do that is by calling the `respond_to` method from our controller action.

```ruby
def index
  zombies = Zombie.all

  respond_to do |format|
    format.json { render json: zombies, status: 200 }
  end
end
```

Under the hood, `render json: zombies` calls the `to_json` method on `zombies` and the server responds with a JSON string:

```
[{"id":1,"name":"Jon","age":123,"created_at":"2013-12-12T20:01:24.586Z",
"updated_at":"2013-12-12T20:01:24.586Z"},{"id":2,"name":"Isabella","age":93,
"created_at":"2013-12-12T20:01:25.196Z","updated_at":"2013-12-12T20:01:25.196Z"}]
```

We can also check the **Content-Type** header in the response (very useful for debugging, btw), which should be set to the proper media type:

```
HTTP/1.1 200 OK 
Content-Type: application/json; charset=utf-8
```

Now if an API client wants `application/xml`, a media type that serves XML, they add an `.xml` extension to our URI:

```ruby
api.ZombieBroadcast.com/zombies.xml
```

In our controller, we add an entry for the XML format:

```ruby
def index
  zombies = Zombie.all

  respond_to do |format|
    format.json { render json: zombies, status: 200 }
    format.xml { render xml: zombies, status: 200 }
  end
end
```

Much like with JSON, `render xml: zombies` calls the `to_xml` method on `zombies`, which results in the following XML response:

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

And the **Content-Type** header is also set to `application/xml`:

```
HTTP/1.1 200 OK 
Content-Type: application/xml; charset=utf-8
```

Rails ships with 21 different media types out of the box. If we ask for a media type that's unknown to Rails, then we'll get back a `406 - Not Acceptable` response.

```
HTTP/1.1 406 Not Acceptable 
Content-Type: text/html; charset=utf-8
```

For the complete list of media types supported by a given Rails app, run `Mime::SET` from the Rails console - or `Mime::SET.collect(&:to_s)` for a more readable response.

```
Loading development environment (Rails 4.1.0.beta1)
2.0.0p195 :001 > Mime::SET
=> [#<Mime::Type:0x007fe2e1dc0f48 @synonyms=["application/xhtml+xml"], @symbol=:html, @string="text/html">,
#<Mime::Type:0x007fe2e1dc07c8 @synonyms=[], @symbol=:text, @string="text/plain">, #<Mime::Type:0x007fe2e1dc0048
@synonyms=["application/javascript", "application/x-javascript"], @symbol=:js, @string="text/javascript">,
#<Mime::Type:0x007fe2e218b9e8 @synonyms=[], @symbol=:css, @string="text/css">,...
 
2.0.0p195 :002 > Mime::SET.collect(&:to_s)
=> ["text/html", "text/plain", "text/javascript", "text/css", "text/calendar", "text/csv", "text/vcard",
"image/png", "image/jpeg", "image/gif", "image/bmp", "image/tiff", "video/mpeg", "application/xml", 
"application/rss+xml", "application/atom+xml", "application/x-yaml", "multipart/form-data",
"application/x-www-form-urlencoded", "application/json", "application/pdf", "application/zip"]
```

## Adding a custom Mime Type

TODO: Add reasons we'd want to use a custom Mime Type: Versioning - see [Github API](http://developer.github.com/changes/2014-01-07-upcoming-change-to-default-media-type/) and [Heroku](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api)

Our custom media type will be `application/vnd.apocalypse+json`.

The media type name **application** tells us that the payload is to be treated as part of an application-specific interaction. The **vnd.apocalypse** part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The **+json** part declares JSON is used for the document formatting.

Let's go to `config/initializers/mime_types.rb` and register our custom `apocalypse` media type:

```ruby
Mime::Type.register 'application/vnd.apocalypse+json', :apocalypse
```

Back in our controller, we need to add an entry to `respond_to` with our custom format.

```ruby
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.apocalypse {}
  end
end
```

Inside of the `format.apocalypse` block, we'll call our custom serializer that returns the proper media type. For now, we'll just use the JSON serializer for simplicity:

```ruby
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.apocalypse { render json: @zombies }
  end
end
```

We can now ask for our custom format:

```ruby
api.ZombieBroadcast.com/zombies.apocalypse
```

And we'll get our response back using our custom mime type:

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

Another method we can use is `respond_to/respond_with`. For this, we call `respond_to` from our controller class, instead of from our action, to tell it which media type to accept:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse
end
```

If we needed to support multiple media types, then we could pass multiple arguments to the `respond_to` method:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse #, :xml, :html
end
```

Then, we call `respond_with` from our controller action, passing in our model or collection of models, and Rails will automatically figure out what format the client expects back.

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse

  def index
    @zombies = Zombie.all
    respond_with(@zombies)
  end
end
```

One last thing we need to do is add a template for the `apocalypse` format. The template name needs to include the mime type on its extension, so for the index action we'll name it *app/views/zombies/index.apocalypse.jbuilder* and we'll use jbuilder to produce a JSON response:

```ruby
# app/views/zombies/index.apocalypse.jbuilder
json.array!(@zombies) do |zombie|
  json.extract! zombie, :name, :age
  json.url zombie_url(zombie, format: :json)
end
```

If we wanted to avoid templates, we could pass a block to `respond_with`, similar to how we were doing it previously in **respond_to**:

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

## A better way

While tweaking the URI allows for quickly switching between media types, and even helps with exploring the API from our browser, this strategy should be avoided.

> URIs should be opaque to consumers. Only the issuer of the URI knows how to interpret and map it to a resource. Using extensions such as .xml, .html, or .json is a historical convention that stems from the time when web servers simply mapped URIs directly to files. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

Instead of using the URI for content negotiation, we should use request Headers.

> Using content negotiation, consumers can negotiate for specific representation formats from a service. They do so by populating the HTTP Accept request header with a list of media types they’re prepared to process. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

The [HTTP protocol](http://tools.ietf.org/html/rfc2616#section-12) offers the **ACCEPT** header to help the server determine which media type a client accepts for the response.

How does that affect us as API developers ?

Luckly, if we stick with Rails' `respond_to` or/and `respond_with` then there's nothing to worry about.

API **clients**, on the other hand, should remember to never rely on URI extensions for determining format.

Let's see how we can write integration tests that simulate an API client requesting a specific media type and then verify that the server responded properly.

```ruby
require 'spec_helper'

describe 'Listing Zombies' do

  it 'returns successful response' do
    get api_zombies_url, {}, { 'ACCEPT' => Mime::APOCALYPSE }

    expect(response.status).to eq(200)
    expect(response.content_type).to eq(Mime::APOCALYPSE)
  end
end
```

**ACCEPT** -> "here is the mime type that I can understand."
**CONTENT_TYPE** -> "here is the content type of the body I'm sending you."

If you need to POST a custom Mime Type, then you need to tell Rails how to parse its content:

> From Nate: It's actually somewhat uncommon that you'd have someone POSTing a custom format into your app.

```ruby
# config/initializers/mime_type.rb
Mime::Type.register 'application/vnd.apocalypse+json', :apocalypse
ActionDispatch::ParamsParser::DEFAULT_PARSERS[Mime::APOCALYPSE]= :json
```

## Language

TODO: add language/locale example.


TODO: Verify the statement below from [here](http://apidock.com/rails/ActionController/MimeResponds/respond_to#1436-Accept-header-ignored):

> Rails ignores the accept header when it contains “,/” or “/,” and returns HTML (or JS if it’s a xhr request).
> This is by design to always return HTML when being accessed from a browser.
> This doesn’t follow the mime type negotiation specification but it was the only way to circumvent old browsers with bugged accept header. They had he accept header with the first mime type as image/png or text/xml.

Jose Valim [once said](https://twitter.com/josevalim/status/7928782685995009) not to trust Accept headers.. WAT ?

> Don't rely on Accepts headers if you can (browsers are crazy!). Always pass :format as option to ensure proper response from #rails

* Rails Guides on [locale using Accept-Language](http://guides.rubyonrails.org/i18n.html#using-accept-language)
* https://github.com/iain/http_accept_language
* Add RSS Mime Type ?
* Add iCal Mime Type ?


Food for thought [http://wiki.whatwg.org/wiki/Why_not_conneg](http://wiki.whatwg.org/wiki/Why_not_conneg)


Resources:

[http://www.w3.org/Protocols/rfc1341/4_Content-Type.html]()
[http://www.commandercoriander.net/blog/2014/01/04/test-driving-a-json-api-in-rails]()
