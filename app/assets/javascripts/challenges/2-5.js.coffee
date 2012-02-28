app.createChallenge '2-5', ->

  # Getting back our attributes
  #
  # Instructions:
  #
  # We've already seen how we can use `get` to access
  # attributes on a model instance, but what if we wanted
  # them all at once?
  #
  # Use console.log to log the attributes of the `appointment` instance.
  # If you don't remember what function to call, consult the 
  # [Backbone Model docs](http://documentcloud.github.com/backbone/#Model)
  #
  #
  # Initial Code:
  `var appointment = new Appointment({id: 1})`

  # Answer:
  `
  var appointment = new Appointment({id: 1})
  console.log(appointment.toJSON());
  `

  # need this or coffeescript will produce a js syntax error
  this




