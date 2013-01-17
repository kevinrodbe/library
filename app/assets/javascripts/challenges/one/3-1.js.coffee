app.createChallenge '3-1', ->

  # Changing the tag 
  #
  # Instructions:
  #
  # Each `AppointmentView` needs to have a top-level
  # `li` tag (instead of the default `div` tag).
  #
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({});`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    tagName: 'li'
  });`

  # need this or coffeescript will produce a js syntax error
  this




