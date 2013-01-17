app.createChallenge '5-3', ->

  # Fetching data
  #
  # Instructions:
  #
  # We totally forgot about the server!  Instead of using reset,
  # let's just fetch the data from the server.  Set the url of `AppointmentList`
  # collection to `appointments` and then use `fetch` on the collection instance.
  #
  #
  # Initial Code:
  `var AppointmentList = Backbone.Collection.extend({
    model: Appointment
  });
  var appointments = new AppointmentList();
  `

  # Answer:
  `var AppointmentList = Backbone.Collection.extend({
    model: Appointment,
    url: '/appointments'
  });
  var appointments = new AppointmentList();
  appointments.fetch();
  `

  # need this or coffeescript will produce a js syntax error
  this





