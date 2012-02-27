app.createChallenge '1-7', ->

  # Render the view
  #
  # Instructions:
  #
  # Time to show Dr. Goodparts his first appointment.  Render
  # your `AppointmentView` instance and then insert it's top-level
  # element into `#app`.
  #
  # Initial Code:
  `
  $('#app').html()
  `

  # Answer:
  `
  appointmentView.render();
  $('#app').html(appointmentView.el);
  `





