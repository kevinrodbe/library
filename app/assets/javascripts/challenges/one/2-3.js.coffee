app.createChallenge '2-3', ->

  # Syncing Changes
  #
  # Instructions:
  #
  # Setting the urlRoot of the `Appointment` model let's
  # us do more than just `fetch` from the server, it also
  # let's us sync changes made to model instances.
  #
  # Dr. Goodparts isn't feeling good today so we're going
  # to have to cancel his appointments.  Set the `appointment's`
  # `cancelled` attribute to true and save the appointment to the server.
  # 
  #
  # Initial Code:
  `var appointment = new Appointment({id: 1})`

  # Answer:
  `
  var appointment = new Appointment({id: 1})
  appointment.set({cancelled: true});
  appointment.save();
  `

  # need this or coffeescript will produce a js syntax error
  this


