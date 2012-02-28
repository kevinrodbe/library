app.createChallenge '3-3', ->

  # Top-Level jQuery
  #
  # Instructions:
  # 
  # Refactor the code below to use the view instance's
  # cached jQuery top-level element.
  #
  # Initial Code:
  `
  var appointmentView = new AppointmentView();
  $(appointmentView.el).html();
  `

  # Answer:
  `
  var appointmentView = new AppointmentView();
  appointmentView.$el.html();
  `

  # need this or coffeescript will produce a js syntax error
  this





