## POST

[Demo app](https://github.com/codeschool/BananaPodcast/tree/post_method)

The POST HTTP verb is used to request that the server accept the entity enclosed in the request as a new representation of the resource at the specified URI. In short, we use POST to send stuff to the server.

Successful POST requests create new resources on the server, and are neither safe nor idempotent. Submitting forms, adding an item to our shopping cart and rating a recently purchased product are all operations that generate side-effects. 

Sequential POST requests to the same URI are likely to change the state of the application each time, that's why sometimes we'll see warnings when refreshing or re-visiting a browser URL right after submiting a form:

![](http://i.stack.imgur.com/52vBU.png)

According to the RFC, when a POST request results in a new resource being successfully created on the server, then:

* The **status code** for the response should be 201 (Created).
* The response **body** should contain a representation of the new resource.
* The **Location** header should be set with the location of the new resource.

Let's translate that to code:

```ruby
class EpisodesController < ApplicationController

  def create
    episode = Episode.new(episode_params)
    if episode.save
      render json: episode, status: :created, location: episode
    end
  end
end
```

The test for that looks like so:

```ruby
# test/integration/test_helper.rb
require 'test_helper'

class CreatingEpisodesTest < ActionDispatch::IntegrationTest
  test 'creates episodes' do
    post '/episodes',
      { episode: { title: 'Bananas', description: 'Learn about bananas.' }}.to_json,
      { 'Accept' => Mime::JSON, 'Content-Type' => Mime::JSON.to_s }

    assert_equal 201, response.status
    assert_equal Mime::JSON, response.content_type

    episode = json(response.body)

    assert_equal episode_url(episode[:id]), response.location
  end
end
```

> The action performed by the POST method might not result in a resource that can be identified by a URI. In this case, either 200 (OK) or 204 (No Content) is the appropriate response status, depending on whether or not the response includes an entity that describes the result.

So for successful responses that don't include an entity, we can return a `204 - No Content` instead:

```ruby
class EpisodesController < ApplicationController

  def create
    episode = Episode.new(episode_params)
    if episode.save
      render nothing: true, status: 204, location: episode# :no_content
    end
  end
end
```

For unsuccessful POST requests, the response is a little different.

Let's add a presence validation to our Episode's title:

```ruby
class Episode < ActiveRecord::Base
  validates :title, presence: true
end
```

And then write a test. This time, we check for a `422 - Unprocessable Entity` status code. 

```ruby
require 'test_helper'

class CreatingEpisodesTest < ActionDispatch::IntegrationTest
  test 'does not create invalid episodes' do
    post '/episodes',
      { episode: { title: nil, description: 'Learn about bananas.' }}.to_json,
      { 'Accept' => Mime::JSON, 'Content-Type' => Mime::JSON.to_s }

    assert_equal 422, response.status
    assert_equal Mime::JSON, response.content_type
  end
end
```

The 400 class of status code is intended for cases in which the client seems to have made a mistake. The `422` status code, in particular, means the server understands the content type of the request, and the syntax of the request is correct, but it was unable to process it due to semantic errors.

Here's the controller code that makes the tests pass:

```ruby
def create
  episode = Episode.new(episode_params)
  if episode.save
    render json: episode, status: :created, location: episode
  else
    render json: episode.errors, status: :unprocessable_entity
  end
end
```

In order to help API clients, the response body should also include the errors that prevented the POST request from being successful.

## PUT / PATCH

The PUT and PATCH methods in Rails are used for updating existing resources. Both are routed to the `update` action on the resources' corresponding controller.

According to the HTTP spec, the PUT method should be used when replacing a existing resource with another one provided in the request. However, when we update records in our Rails apps we are only partially changing an existing resource, like changing a user's name, email or password. This is exactly what the PATCH method is for.

Although the spec describes PUT and PATCH as being different, Rails basically treats them the same.

Let's write some integration tests for a successful update - we'll use the `patch` method:

```ruby
# test/integration/updating_episodes_test.rb
require 'test_helper'

class UpdatingEpisodesTest < ActionDispatch::IntegrationTest
  setup do
    @episode = Episode.create!(title: 'First Title')
  end

  test 'successful update' do
    patch "/episodes/#{@episode.id}",
      { episode: { title: 'First Title Edit' } }.to_json,
      { 'Accept' => Mime::JSON, 'Content-Type' => Mime::JSON.to_s }

    assert_equal 200, response.status
    assert_equal 'First Title Edit', @episode.reload.title # ensures title has changed
  end
end
```

Controller code:

```ruby
def update
  episode = Episode.find(params[:id])
  if episode.update(episode_params)
    render json: episode, status: 200
  end
end
```

We need to start being more strict on episode titles - they now need to be at least 10 characters long. Let's add a test for that:

```ruby
# test/integration/updating_episodes_test.rb
require 'test_helper'

class UpdatingEpisodesTest < ActionDispatch::IntegrationTest
  test 'unsuccessful update on short title' do
    patch "/episodes/#{@episode.id}",
      { episode: { title: 'short' } }.to_json,
      { 'Accept' => Mime::JSON, 'Content-Type' => Mime::JSON.to_s }

    assert_equal 422, response.status
  end
end
```

Now let's add the missing validation to our our Episode model to make the tests pass:

```ruby
class Episode < ActiveRecord::Base
  validates :title, presence: true, length: { minimum: 10 }
end
```

## DELETE

The DELETE method is used to delete the resource identified by the URI. 

According to the rfc, *the client cannot be guaranteed that the operation has been carried out, even if the status code returned from the origin server indicates that the action has been completed successfully*, which is sounds weird - however, the server SHOULD NOT indicate success unless, at the time the response is given, it intends to delete the resource or move it to an inaccessible location.

A successful response SHOULD be 200 (OK) if the response includes an entity describing the status, 202 (Accepted) if the action has not yet been enacted, or 204 (No Content) if the action has been enacted but the response does not include an entity.

Let's write a simple test that deletes an existing episode and checks for a `204 - No Content` status code. For the time being, we will not care about a response body.

```ruby
require 'test_helper'

class DeletingEpisodesTest < ActionDispatch::IntegrationTest
  setup do
    @episode = Episode.create(title: 'I am going to be deleted')
  end

  test 'deletes existing episode' do
    delete "/episodes/#{@episode.id}"
    assert_equal 204, response.status
  end
end
```

Back in our `EpisodesController`, the simplest code to make the tests pass involves fetching the given episode from the database, deleting it and then rendering nothing at all:

```ruby
class EpisodesController < ApplicationController
  def destroy
    episode = Episode.find(params[:id])
    episode.destroy!
    render nothing: true, status: 204
  end
end
```

An alternative to using `render nothing: true` is calling the `head` method, which creates a response consisting solely of HTTP headers. This provides additional flexibility and makes it explicit that we are only generating HTTP headers.

```ruby
class EpisodesController < ApplicationController
  def destroy
    episode = Episode.find(params[:id])
    episode.destroy!
    head 204
  end
end
```

Just like the `status` method, the `head` method can also take a symbol as an argument:

```ruby
class EpisodesController < ApplicationController
  def destroy
    episode = Episode.find(params[:id])
    episode.destroy!
    head :no_content
  end
end
```

## INBOX

Content below serves as reference.

[Rack::Utils](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L542-L601)

For testing, see <http://matthewlehner.net/rails-api-testing-guidelines/>
Full list of status and helper methods: <https://github.com/rack/rack/blob/master/lib/rack/response.rb#L115-L131>

* [GUID](http://en.wikipedia.org/wiki/Globally_unique_identifier)
    * Using the uuid datatype with the PostgreSQL adapter
    * https://coderwall.com/p/n_0awq
    * Gotcha: http://rny.io/rails/postgresql/2013/07/27/use-uuids-in-rails-4-with-postgresql.html

* Test Driving a JSON API in Rails: <http://www.commandercoriander.net/blog/2014/01/04/test-driving-a-json-api-in-rails>