app.createChallenge '7-7', ->

  # App Organization
  #
  # Instructions:
  # 
  # We are so close to wrapping up! But before we go, let's
  # use our Router to clean up our app organization a bit.
  #
  # First, instead of assigning a Router class to `AppRouter`, go ahead
  # and just immediately create the Router instance.
  #
  # Next, instead of passing in the `appointmentList` collection in initialize,
  # just go ahead and create an instance of `AppointmentList` and assign it to
  # `this.appointmentList`
  #
  # Fill in the `start` function to start our Backbone history with pushState on.
  #
  # Finally, call the router's `start` function from inside a jQuery ready function to
  # ensure we don't start updating the DOM before it's ready.
  #
  # Initial Code
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

  # Answer:
  `
  var AppRouter = new (Backbone.Router.extend({
    routes: { "appointments/:id": "show", "": "index" },

    initialize: function(options){
      this.appointmentList = new AppointmentList();
    },

    start: function(){
      Backbone.history.start({pushState: true});
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
  }));

  $(function(){ AppRouter.start() });
  `

  # need this or coffeescript will produce a js syntax error
  this

