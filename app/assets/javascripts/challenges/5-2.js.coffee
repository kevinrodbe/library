app.createChallenge '5-2', ->

  # Reset
  #
  # Instructions:
  #
  # The office assistant has been busy taking appointments
  # and has provided a nice JSON object ready to be loaded in.
  #
  # Get it all in the `appointments` collection instance using `reset`
  #
  # Initial Code:
  `
  var appointments = new AppointmentList();
  var json = [
    {title: 'Back pain'}
    {title: 'Dry mouth'}
    {title: 'Erection lasting more than 4 hours'}
  ]
  `

  # Answer:
  `
  var appointments = new AppointmentList();
  var json = [
    {title: 'Back pain'}
    {title: 'Dry mouth'}
    {title: 'Erection lasting more than 4 hours'}
  ]

  appointments.reset(json);
  `

  # need this or coffeescript will produce a js syntax error
  this




