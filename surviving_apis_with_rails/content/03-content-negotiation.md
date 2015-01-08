# Content Negotiation

[Demo app](https://github.com/codeschool/BananaPodcast/tree/content_negotiation)

Web APIs need to be flexible and cater to different types of clients. Content Negotiation is the process in which an API client and the API server determine the best representation for a given response when there are multiple representations available. (From [Content Negotiation](http://en.wikipedia.org/wiki/Content_negotiation))

When navigating web pages we don't typically worry about content negotiation because, as users, we delegate most of this task to the browser. It tells the server, on our behalf, what representation it accepts. 

Visiting at a web site like google.com, the browser asks for HTML and we see the google.com front-page. If we want to change the language, we could change our browser settings and have it ask the google.com server for its content to be in German (de-DE) instead of English (en-US). Or when we click on a download link for a PDF, the browser asks the server for a PDF format.


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
localhost:3000/zombies.json
```

But before our API is actually able to generate proper JSON responses, we need to add JSON support to our **ZombiesController**. One way we can do that is by using the `respond_to` method from our controller action.

```ruby
def index
  zombies = Zombie.all

  respond_to do |format|
    format.json { render json: zombies, status: 200 }
  end
end
```

We've learned that `render json: zombies` calls the `to_json` method on `zombies`, so here's what the JSON response body looks like:

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
localhost:3000/zombies.xml
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

### Listing Mime Types

Rails ships with 21 different media types out of the box. If we ask for a media type that's unknown to Rails, then we'll get back a `406 - Not Acceptable` response.

```
HTTP/1.1 406 Not Acceptable 
Content-Type: text/html; charset=utf-8
```

For the complete list of media types supported by our Rails app, we can run `Mime::SET` from the Rails console - or `Mime::SET.collect(&:to_s)` for a more readable response.

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

## A better way

While tweaking the URI allows for quickly switching between media types, and even helps with exploring the API from our browser, this strategy should be avoided.

> URIs should be opaque to consumers. Only the issuer of the URI knows how to interpret and map it to a resource. Using extensions such as .xml, .html, or .json is a historical convention that stems from the time when web servers simply mapped URIs directly to files. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

Instead of using the URI for content negotiation, we should use request Headers.

> Using content negotiation, consumers can negotiate for specific representation formats from a service. They do so by populating the HTTP Accept request header with a list of media types they’re prepared to process. (Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

The [HTTP protocol](http://tools.ietf.org/html/rfc2616#section-12) offers the **ACCEPT** header to help the server determine which media type a client accepts for the response.

How does that affect us as API developers ?

Luckly, if we stick with Rails' `respond_to` then there's nothing to worry about.

API **clients**, on the other hand, should remember to never rely on URI extensions for determining format.

Let's see how we can write an integration test that simulates an API client requesting a specific media type and then verify that the server responded properly.

```ruby
# test/integration/listing_zombies_test.rb
require 'test_helper'

class ListingZombiesTest < ActionDispatch::IntegrationTest
  test 'returns zombies in JSON' do
    get '/zombies', {}, { 'Accept' => Mime::JSON }

    assert_equal 200, response.status
    assert_equal Mime::JSON, response.content_type
  end

  test 'returns zombies in XML' do
    get '/zombies', {}, { 'Accept' => Mime::XML }

    assert_equal 200, response.status
    assert_equal Mime::XML, response.content_type
  end
end
```

We can also use **curl** to verify the proper response format. 

We've learned that the `-I` option tells curl to display response headers. We can combine that with `-H` to send along specific headers in the request - in this case, the **Accept** header.

With our Rails application running under <http://localhost:3000>, we can run the following for JSON:

```
$ curl -IH "Accept: application/json" localhost:3000/zombies
HTTP/1.1 200 OK 
Content-Type: application/json; charset=utf-8
```

and then for XML:

```
$ curl -IH "Accept: application/xml" localhost:3000/zombies
HTTP/1.1 200 OK 
Content-Type: application/xml; charset=utf-8
```

## Language

For switching between different languages, the HTTP protocol offers the **Accept-Language** request header. This header field is similar to Accept, but restricts the set of natural languages that are preferred as a response to the request.

Let's see how we can add support to a second language to our Rails API. We'll start with an integration test.

```ruby
# test/integration/changing_locales_spec.rb
require 'test_helper'

class ChangingLocalesTest < ActionDispatch::IntegrationTest
  setup do
    Zombie.create!(name: 'Joanna', age: 251)
  end

  teardown do
    Zombie.destroy_all
  end

  test 'returns list of zombies in english' do
    get '/zombies', {}, {'Accept-Language' => 'en', 'Accept' => Mime::JSON }
    assert 200, response.status
    zombies = json(response.body)
    assert_equal "Watch out for #{zombies[0][:name]}!", zombies[0][:message]
  end

  test 'return list of zombies in portuguese' do
    get '/zombies', {}, {'Accept-Language' => 'pt-BR', 'Accept' => Mime::JSON }
    assert 200, response.status
    zombies = json(response.body)
    assert_equal "Cuidado com #{zombies[0][:name]}!", zombies[0][:message]
  end
end
```

A simple way to switch between locales based on a request header is by adding a **before_action** to our `ApplicationController` and inspecting the corresponding header from there:

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_locale

  protected
    def set_locale
      I18n.locale = request.env['Accept-Language']
    end
end
```

Next, we'll remove the inline rendering from our `ZombiesController` so we can move the JSON serialization logic to a view template.

```ruby
# app/controllers/zombies_controller.rb
class ZombiesController < ApplicationController
  def index
    @zombies = Zombie.all
    respond_to do |format|
      format.json
    end
  end
end
```

In our template, we'll add an entry for **message**. The value for this entry will be internationalized. We'll use the `I18n.t` method to lookup the corresponding value for the **warning_message** key and pass a value for the *name* placeholder.

```ruby
# app/views/zombies/index.json.jbuilder
json.array!(@zombies) do |zombie|
  json.extract! zombie, :id, :name, :age
  json.message I18n.t('warning_message', name: zombie.name)
end
```

Rails adds all **.yml** files under *config/locales* to the translations load path. The one for english is automatically created for us, so we'll use that one and add our entry for the warning message.

```
# config/locales/en.yml
en:
  warning_message: 'Watch out for %{name}!'
```

Now let's create another one for the warning message in portuguese:

```
# config/locales/pt-BR.yml
pt-BR:
  warning_message: 'Cuidado com %{name}!'
```

This is enough code to make our spec pass.

Response in english:

```
[{"id":2,"name":"Joanna","age":251,"warning_message":"Watch out for Joanna!"}]
```

Response in portuguese:

```
[{"id":2,"name":"Joanna","age":251,"warning_message":"Cuidado com Joanna!"}]
```

However, in order for our web API to suppport different languages in a way that's more closely compatible with the HTTP spec (which very few web APIs are), we will need more logic than just straight up assigning `request.env['Accept-Language']` to `I18n.locale`. Certain things also need to be taken in consideration, like users sending a list of preferred languages instead of just one, or using different formatting options for the Header value.

To help us with figuring all of that out, we'll use the [http_accept_language](https://github.com/iain/http_accept_language) gem. This will basically take care of everything for us.

We'll add the gem to our Gemfile:

```ruby
# Gemfile
gem 'http_accept_language'
```

Then we'll replace our previous code with the following:

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :set_locale

  protected
    def set_locale
      I18n.locale = http_accept_language.compatible_language_from(I18n.available_locales)
    end
end
```

Our tests should still pass.


## Inbox

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
