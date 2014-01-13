## API Versioning and Custom Media Type

* Three ways: 
    * /api/v1/users (uses namespace)
    * /api/users?version=1 (uses param)
    * /api/users (uses Accept header and custom Mime Type)

* See [http://developer.github.com/v3/media/](http://developer.github.com/v3/media/) for example of API version in header
* See Service-Oriented Design with Ruby on Rails page 65.
* See [The Lie of the API](http://ruben.verborgh.org/blog/2013/11/29/the-lie-of-the-api/)
* See [http://railscasts.com/episodes/350-rest-api-versioning?view=asciicast]()

## Adding a custom Mime Type

TODO: Elaborate; See [Github API](http://developer.github.com/changes/2014-01-07-upcoming-change-to-default-media-type/) and [Heroku](https://blog.heroku.com/archives/2014/1/8/json_schema_for_heroku_platform_api)

Our custom media type will be `application/vnd.apocalypse.v1+json`.

The media type name **application** tells us that the payload is to be treated as part of an application-specific interaction. The **vnd.apocalypse** part of the media type name declares that the media type is vendor-specific (vnd), and that the owner is the **apocalypse** application. The **+json** part declares JSON is used for the document formatting.

Let's go to `config/initializers/mime_types.rb` and register our custom `apocalypse` media type:

```ruby
Mime::Type.register 'application/vnd.apocalypse.v1+json', :apocalypse_v1
```

Back in our controller, we need to add an entry to `respond_to` with our custom format.

```ruby
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.apocalypse_v1 {}
  end
end
```

Inside of the `format.apocalypse_v1` block, we'll call our custom serializer that returns the proper media type. For now, we'll just use the JSON serializer for simplicity:

```ruby
def index
  @zombies = Zombie.all

  respond_to do |format|
    format.apocalypse_v1 { render json: @zombies }
  end
end
```

We can now ask for our custom format:

```
$ curl -H "Accept: application/apocalypse_v1" \
  http://api.ZombieBroadcast.com/zombies.apocalypse_v1
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
Content-Type: application/vnd.apocalypse.v1+json; charset=utf-8 # W00t
```

On the previous level, we've looked at using the `respond_to` method for detecting the correct media type request by the client. Another method we can use is `respond_with`. To use `respond_with` from our controller action, we first need to call `respond_to` from our controller class which tells the controller which media types to accept:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1
end
```

If we needed to support multiple media types, then we could pass multiple arguments to the `respond_to` method:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1, :json, :xml
end
```

From our controller action, we call `respond_with` passing in our model or collection of models as an argument, and Rails automatically figures out what format the client expects back.

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1

  def index
    @zombies = Zombie.all
    respond_with(@zombies)
  end
end
```

One last thing we need to do is add a template for the `apocalypse_v1` format. The template name needs to include the mime type as part of its extension, so for the index action we'll name it *app/views/zombies/index.apocalypse_v1.jbuilder* and we'll use jbuilder to produce a JSON response:

```ruby
# app/views/zombies/index.apocalypse_v1.jbuilder
json.array!(@zombies) do |zombie|
  json.extract! zombie, :name, :age
  json.url zombie_url(zombie, format: :json)
end
```

If we wanted to avoid using templates, we could pass a block to `respond_with`, similar to how we were doing it previously in **respond_to**:

```ruby
class ZombiesController < ApplicationController
  respond_to :apocalypse_v1

  def index
    @zombies = Zombie.all
    respond_with(@zombies) do |format|
      format.apocalypse { render json: @zombies }
    end
  end
end
```


If you need to POST a custom Mime Type, then you need to tell Rails how to parse its content: (TODO: elaborate more on this.)

> From Nate: It's actually somewhat uncommon that you'd have someone POSTing a custom format into your app.

```ruby
# config/initializers/mime_type.rb
Mime::Type.register 'application/vnd.apocalypse+json', :apocalypse_v1
ActionDispatch::ParamsParser::DEFAULT_PARSERS[Mime::APOCALYPSE]= :json
```

**ACCEPT** -> "here is the mime type that I can understand."
**CONTENT_TYPE** -> "here is the content type of the body I'm sending you."
