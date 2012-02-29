app.createChallenge '7-6', ->

  # Index Action
  #
  # Instructions:
  # 
  # Beautiful!  But one problem: hitting the back button does
  # update the URL in the browser correctly, but the DOM
  # doesn't go back to being a list :(.
  #
  # First, add the root route and point it to the `index` action.
  #
  # As you can see we are passing in a `appointmentList` list collection
  # in the router's `initialize` function.  Finish out the `index` action
  # by replace the content of `#app` with the `appointmentsView`.  Make sure
  # you fetch new data for the `appointmentList` from the server.
  #
  #
  # Initial Code
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show" },

    initialize: function(options){
      this.appointmentList = options.appointmentList;
    },
    
    index: function(){
      var appointmentsView = new AppointmentListView({collection: this.appointmentList});

    },

    show: function(id){
      var appointment = new Appointment({id: id});
      var appointmentView = new AppointmentView({model: appointment});
      appointmentView.render(); 
      $('#app').html(appointmentView.el);
      appointment.fetch();
    }
  });
  `

  # Answer:
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show", "": "index" },

    initialize: function(options){
      this.appointmentList = options.appointmentList;
    },

    index: function(){
      var appointmentsView = new AppointmentListView({collection: this.appointmentList});
      appointmentsView.render();
      $('#app').html(appointmentsView.el);
      this.appointmentList.fetch();
    },

    show: function(id){
      var appointment = new Appointment({id: id});
      var appointmentView = new AppointmentView({model: appointment});
      appointmentView.render(); 
      $('#app').html(appointmentView.el);
      appointment.fetch();
    }
  });
  `

  # need this or coffeescript will produce a js syntax error
  this

