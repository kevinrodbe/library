app.createChallenge '3-2', ->

  # Adding a class
  #
  # Instructions:
  #
  # Make sure every `AppointmentView` top-level element 
  # is created with a class of `appointment`.
  # 
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({
    tagName: 'li'
  });`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    tagName: 'li',
    className: 'appointment'
  });`

  # need this or coffeescript will produce a js syntax error
  this




