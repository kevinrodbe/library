app.createChallenge '3-5', ->

  # A View Event
  #
  # Instructions:
  # 
  # Dr. Goodparts is just getting the hang of this web thing and
  # thinks it'd be a good idea to alert the user the title
  # of the appointment whenever they click on it's view.
  #
  # See if you can't appease his bad idea and implement this tragic
  # UI interaction using View events.
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
    template: _.template('<span><%= title %></span>'),

    events: { "click span": "alertTitle" },
    alertTitle: function(){
      alert(this.model.get('title'));
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # Alternate Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span>'),

    events: { "click": "alertTitle" },
    alertTitle: function(){
      alert(this.model.get('title'));
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this







