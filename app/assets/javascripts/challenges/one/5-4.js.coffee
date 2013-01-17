app.createChallenge '5-4', ->

  # Reset event
  #
  # Instructions:
  #
  # This Dr. Goodparts does not trust us when we tell him
  # we are successfully loading data from the server into our collection.
  #
  # To prove him wrong, display an alert with the number of items in the collection
  # by listening for the `reset` event.
  #
  #
  # Initial Code:
  `
  var appointments = new AppointmentList();
  appointments.fetch();
  `

  # Answer:
  `
  var appointments = new AppointmentList();
  appointments.on('reset', function(){
    alert("fetched " + this.length + " appointments from the server");
  });
  appointments.fetch();
  `


  # need this or coffeescript will produce a js syntax error
  this






