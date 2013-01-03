app.createChallenge '5-1', ->

  # Collection Class
  #
  # Instructions:
  #
  # Dr. Goodparts is losing a ton of business because our app
  # isn't too good at handling multiple Appointments at a time.
  #
  # Let's start working on improving the situation.  Define
  # a new collection class called AppointmentList, and make
  # sure it handles the `Appointment` model.
  #
  # Initial Code:
  `var AppointmentList;`

  # Answer:
  `var AppointmentList = Backbone.Collection.extend({
    model: Appointment
  });`

  # need this or coffeescript will produce a js syntax error
  this



