app.createChallenge '7-5', ->

  # Implementing Show 
  #
  # Instructions:
  # 
  # Time to implement the show action. As you can see you've already
  # create an instance of the appointment and passed in the `id` from the URL.
  #
  # Render the view and replace the contents of `#app` with it's top-level element.
  #
  # Don't forget to fetch data from the server for the `appointment`.
  #
  # Initial Code
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show" },
    show: function(id){
      var appointment = new Appointment({id: id});
      var appointmentView = new AppointmentView({model: appointment});
    }
  });
  `

  # Answer:
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show" },
    show: function(id){
      var appointment = new Appointment({id: id});
      var appointmentView = new AppointmentView({model: appointment});
      appointmentView.render(); 
      $('#app').html(appointmentView.el);
      appointment.fetch();
    }
  });
  `
  # Alternate Answer:
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show" },
    show: function(id){
      var appointment = new Appointment({id: id});
      appointment.fetch();
      var appointmentView = new AppointmentView({model: appointment});
      appointmentView.render(); 
      $('#app').html(appointmentView.el);
    }
  });
  `

  # need this or coffeescript will produce a js syntax error
  this



