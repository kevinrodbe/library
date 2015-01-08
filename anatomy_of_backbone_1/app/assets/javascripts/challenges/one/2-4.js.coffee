app.createChallenge '2-4', ->

  # Listening for Changes
  #
  # Instructions:
  #
  # Dr. Goodparts is upset that he wasn't notified
  # when we changed his last appointment to cancelled.
  #
  # Add a listener to the `appointment` model instance
  # to alert the user of any changes to it's attributes.
  #
  # Initial Code:
  `var appointment = new Appointment({id: 1})`

  # Answer:
  `
  var appointment = new Appointment({id: 1})
  appointment.on('change', function(){
    alert("Hey Dr. Goodparts, your appointment has changed!");
  });
  `

  # need this or coffeescript will produce a js syntax error
  this



