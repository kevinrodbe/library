app.createChallenge '4-2', ->

  # Refactor to the Model
  #
  # Instructions:
  # 
  # Whenever you see too much code dealing with the Model
  # in one of your views, it's probably time for a refactor.
  #
  # Create a `cancel` function in the `Appointment` model that
  # set's the model's `cancelled` attribute to true, and call that function
  # from the `view`.
  #
  # Initial Code:
  #
  # views/appointment.js
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span> <a href="#">x</a>'),
    events:  { "click a": "cancel" },
    cancel: function(){
      this.model.set({cancelled: true});
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # models/appointment.js
  `var Appointment = Backbone.Model.extend({
    
  });`

  # Answer:
  # views/appointment.js
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span> <a href="#">x</a>'),
    events:  { "click a": "cancel" },
    cancel: function(){
      this.model.cancel();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # models/appointment.js
  `var Appointment = Backbone.Model.extend({
    cancel: function(){
      this.set({cancelled: true});
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this
