app.createChallenge '2-1', ->

  # Defaults
  #
  # instructions:
  #
  # Our Appointment model doesn't seem too useful yet.  Add
  # two default attributes, title as the string "Checkup", and 
  # date which should default to the current time (use moment).
  #
  #
  # Initial Code:
  `var Appointment = Backbone.Model.extend({});`

  # Answer:
  `var Appointment = Backbone.Model.extend({
    defaults: {
      title: 'Checkup',
      date: moment()
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this
