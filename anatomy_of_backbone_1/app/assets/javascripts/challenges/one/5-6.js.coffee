app.createChallenge '5-6', ->

  # Listen for an add
  #
  # Instructions:
  #
  # Dr. Goodparts has been adding models to the collection willy-nilly
  # and you'd like to know when he does.
  #
  # Use an event listener to log to the console the model's title anytime
  # a model is added to the `appointments` collection
  #
  # Initial Code:
  `var appointments = new AppointmentList();`

  # Answer:
  `var appointments = new AppointmentList();`
  `appointments.on('add', function(model){
    console.log("Dr. Goodparts added the " + model.get('title') + " appointment");
  });`

  # need this or coffeescript will produce a js syntax error
  this

