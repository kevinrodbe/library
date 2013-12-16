# Authentication

All of the following strategies are supported by Rails out of the box. See [ActionController::HttpAuthentication](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/metal/http_authentication.rb).

* Token
    * Include an application provided API token for each request.
* HTTP Basic Auth (see **Rest in Practice** page 517)
    * Native HTTP Basic Authentication
    * caveat, *Although the username and password are never sent in plain text, the base64-encoded text is easily intercepted and decoded*. Solution is to use HTTPS.
    * Rails support out of the box
* HTTP Digest Auth (see **Rest in Practice** page 519)
    * From the [http://www.ietf.org/rfc/rfc2617.txt](RFC) *unlike Basic,this verification can be done without sending the password in the clear*
    * Rails support out of the box


I've decided not to include SSO for now due to its complexity and because most public API services provide some sort of token-based solutions.
