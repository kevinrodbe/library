app.createChallenge '5-7', ->

  # Iteration
  #
  # Instructions:
  #
  # There are a lot of appointments in our collection and Dr. Goodparts
  # wants a list of all appointment titles so he can arrange his equipment
  # for the day.
  #
  # Use the `map` iteration function to return an array of appointment titles.
  #
  # *Implementors Note*
  #
  # Make sure and setup the appointments collection in the setup with a bunch of 
  # models
  #
  # Initial Code:

  # Answer:
  `appointments.map(function(appointment){
    return appointment.get('title');
  });`

  # need this or coffeescript will produce a js syntax error
  this


