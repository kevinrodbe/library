app.createChallenge '4-1', ->

  # Cancelling an Appointment
  #
  # Instructions:
  # 
  # Dr. Goodparts is pretty flaky and has been cancelling a lot
  # of appointments lately.  He's asked for an easy, one-click way to
  # cancel an appointment in the app you are building.
  #
  # Add a link to the `AppointmentView` template that, when clicked,
  # will set its model's `cancelled` attribute to `true`.  
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span>'),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span> <a href="#">x</a>'),
    events:  { "click a": "cancelEvent" },
    cancelEvent: function(){
      this.model.set({cancelled: true});
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this









