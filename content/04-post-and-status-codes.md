## POST

The POST HTTP verb is used to request that the server accept the entity enclosed in the request as a new representation of the resource at the specified URI. In short, we use POST to send stuff to the server.

POST requests are neither safe or idempotent. Successful POST requests create new resources on the server. Submitting forms, adding an item to our shopping cart and rating a recently purchased product are all operations that generate side-effects. 

Sequential POST requests to the same URI are likely to change the state of the application each time, that's why sometimes you'll see warnings when refreshing or re-visiting a browser URL right after submiting a form:

![](http://i.stack.imgur.com/52vBU.png)

When a POST request results in a new resource being successfully created on the server, then:

* The **status code** for the response should be 201 (Created).
* The response **body** should contain a representation of the new resource.
* The **Location** headerd should be set with the location of the new resource.

TODO: elaborate more.

```ruby
post episodes_url,
  episode: { title: 'Bananas', description: 'Learn about bananas.' }, format: 'json'
  
expect(response.status).to eq(201) # proper code that indicates a new resource was created.
expect(response.header['Location']).to eq(episode_url(Episode.last)) # location of the newly created resouce.
```


## Status Codes

See [Rack::Utils](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L542-L601)

> It is bad form to return 200 and then the response just says 'request failed' - Jon Frikics

Our previous spec:

```ruby
# spec/requests/zombies_spec.rb
describe "Listing Zombies" do
  describe "GET /zombies" do
    it "responds with success" do
      get zombies_path
      expect(response.status).to be(200)
    end
  end
end
```

Can be written in a more expressive way:


```ruby
# spec/requests/zombies_spec.rb
describe "Listing Zombies" do
  describe "GET /zombies" do
    it "responds with success" do
      get zombies_path
      expect(response.status).to be_successful
    end
  end
end
```


## INBOX

Content below serves as reference.

## Successful

* Respond with 201
* Respond with LOCATION set
* When no response body is needed, respond with head :created or head :ok
    * "netflix" feature that synchronizes time elapsed.

## Unsuccessful

* Respond with error status code
* Respond with error message
    * Should contain information so the client can fix



## Scaffold status codes.

For testing, see [http://matthewlehner.net/rails-api-testing-guidelines/]().

Use:

  * RSpec
  * jbuilder (for now, because it's out of the box)
  * scaffold (to show what Rails gives us for free)


## Creating a Resource

Full list of status and helper methods: [https://github.com/rack/rack/blob/master/lib/rack/response.rb#L115-L131]()


* [GUID](http://en.wikipedia.org/wiki/Globally_unique_identifier)
    * Using the uuid datatype with the PostgreSQL adapter
    * https://coderwall.com/p/n_0awq
    * Gotcha: http://rny.io/rails/postgresql/2013/07/27/use-uuids-in-rails-4-with-postgresql.html

### Valid Response

> If the POST request succeeds, the server creates an order resource. It then generates an HTTP response with a status code of 201 Created, a Location header containing the newly created order’s URI, and confirmation of the new order’s state in the response body - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

> The Location header that identifies the URI of the newly created order resource is important. Once the client has the URI of its order resource, it can then interact with it via HTTP using GET, PUT, and DELETE. - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.


### Invalid Response

* Client's fault (400)
* Server's error (500)


## Status with no Message Body

From the [RFC](http://www.ietf.org/rfc/rfc2616.txt): 

> For response messages, whether or not a message-body is included with a message is dependent on both the request method and the response status code (section 6.1.1). All responses to the HEAD request method MUST NOT include a message-body, even though the presence of entity- header fields might lead one to believe they do. All 1xx (informational), 204 (no content), and 304 (not modified) responses MUST NOT include a message-body. All other responses do include a message-body, although it MAY be of zero length.)

However, [Rack::Utils also includes 205 in this group](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L604). This is still compliant with the RFC, which states that *(...) The response MUST NOT include an entity*.

> 205 Reset Content

>   The server has fulfilled the request and the user agent SHOULD reset
>   the document view which caused the request to be sent. This response
>   is primarily intended to allow input for actions to take place via
>   user input, followed by a clearing of the form in which the input is
>   given so that the user can easily initiate another input action. The
>   response MUST NOT include an entity

Although browsers don't implement this, it can still be useful for AJAX requests.
