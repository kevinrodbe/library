# HTTP Status Codes

See [Rack::Utils](https://github.com/rack/rack/blob/master/lib/rack/utils.rb#L542-L601)

## Scaffold status codes.

For testing, see [http://matthewlehner.net/rails-api-testing-guidelines/]().

Use:

  * RSpec
  * jbuilder (for now, because it's out of the box)
  * scaffold (to show what Rails gives us for free)


## Creating a Resource

Full list of status and helper methods: [https://github.com/rack/rack/blob/master/lib/rack/response.rb#L115-L131]()


### Valid Response

> If the POST request succeeds, the server creates an order resource. It then generates an HTTP response with a status code of 201 Created, a Location header containing the newly created order’s URI, and confirmation of the new order’s state in the response body - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.)

> The Location header that identifies the URI of the newly created order resource is important. Once the client has the URI of its order resource, it can then interact with it via HTTP using GET, PUT, and DELETE. - Excerpt From: Ian Robinson. “REST in Practice.” iBooks.


### Invalid Response

* Client's fault
* Server's error


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
