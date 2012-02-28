app.createChallenge '2-2', ->

  # Fetch with URL
  #
  # Instructions:
  #
  # Dr. Goodparts finally ponied up for a server and has seeded it
  # with his first few appointments.  Luckily for us, he bought the REST
  # package with the JSON add-on.  
  #
  # Point the root URL of your `Appointment` model to the `/appointments`
  # endpoint.
  #
  # Then, create a new `Appointment` instead of an `id` of 1, and fetch it's
  # data from the server.
  # 
  #
  # Initial Code:
  `var Appointment = Backbone.Model.extend({});`

  # Answer:
  `
  var Appointment = Backbone.Model.extend({urlRoot: '/appointments'});
  var appointment = new Appointment({id: 1});
  appointment.fetch();
  `

  # need this or coffeescript will produce a js syntax error
  this

