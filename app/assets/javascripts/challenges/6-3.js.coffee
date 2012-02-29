app.createChallenge '6-3', ->

  # Put it into the DOM 
  #
  # Instructions:
  #
  # Wow, you are a hard worker!  Let's see it pay off
  # by rendering our collection view and inserting it into
  # the DOM.  Using the `append` or `html` jQuery methods,
  # insert the top-level element into the `#app` div.
  #
  #
  # Initial Code:
  `var appointmentsView = new AppointmentListView({collection: appointmentList});`

  # Answer:
  `
  var appointmentsView = new AppointmentListView({collection: appointmentList});
  appointmentView.render();
  $('#app').html(appointmentsView.el);
  `

  # need this or coffeescript will produce a js syntax error
  this
