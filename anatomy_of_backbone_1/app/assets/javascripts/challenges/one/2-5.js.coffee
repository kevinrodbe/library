app.createChallenge '2-5', ->

  # Less Listening
  #
  # Instructions:
  #
  # Dr. Goodparts browser crashed because of too many alerts.
  #
  # Instead of listening for all attribute changes, just listen
  # and alert when changes are made to the `cancelled` attribute.
  #
  # Initial Code:
  `appointment.on('change', function(){
    alert("Hey Dr. Goodparts, your appointment has changed!");
  });`

  # Answer:
  `appointment.on('change:cancelled', function(){
    alert("Hey Dr. Goodparts, your appointment has changed!");
  });
  `

  # need this or coffeescript will produce a js syntax error
  this



