app.createChallenge '4-4', ->

  # Re-render on Change
  #
  # Instructions:
  # 
  # Dr. Goodparts pulled a late nighter and decided to make some
  # changes to the app while you slept.  He added the `cancelled` class
  # to the `<span>` tag when the appointment is cancelled, and then, knowing just
  # enough to be dangerous, called `this.render()` in `cancel` to re-render the view.
  #
  # Without gloating too much, update this code to use Model events to
  # always re-render the view whenever the model changes.
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span class="<%= if(cancelled) print("cancelled") %>">' +
                          '<%= title %></span>' +
                          '<a href="#">x</a>'),

    events:  { "click a": "cancel" },
    cancel: function(){
      this.model.cancel();
      this.render();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span class="<%= if(cancelled) print("cancelled") %>">' +
                          '<%= title %></span>' +
                          '<a href="#">x</a>'),
    
    initialize: function(){
      this.model.on('change', this.render, this);
    }

    events:  { "click a": "cancel" },
    cancel: function(){
      this.model.cancel();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this


