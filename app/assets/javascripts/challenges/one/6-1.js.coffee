app.createChallenge '6-1', ->

  # Collection View
  #
  # Instructions:
  #
  # It's finally time to start building out our
  # Appointment app.  We're going to be using a collection
  # and a collection view to display a list of appointments
  # to the ornary but brilliant Dr. Goodparts.
  #
  # Let's start by creating a View Class named AppointmentListView
  # and then create an instance of that class, passing in our collection
  # instance `appointments`
  #
  # Initial Code:
  `var appointments = new AppointmentList();`

  # Answer:
  `
  var appointments = new AppointmentList();
  var AppointmentListView = Backbone.View.extend({});
  var appointmentsView = new AppointmentListView({collection: appointments})
  `

  # need this or coffeescript will produce a js syntax error
  this



