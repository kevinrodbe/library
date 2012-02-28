app.createChallenge '4-5', ->

  # Removing the View
  #
  # Instructions:
  # 
  # Sometimes Dr. Goodparts just all cowboy and starts
  # destroying appointments right there in the console.  
  #
  # Make sure that when an appointment is destroyed, it's 
  # corresponding view is removed from the DOM.
  #
  # Initial Code:
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

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span class="<%= if(cancelled) print("cancelled") %>">' +
                          '<%= title %></span>' +
                          '<a href="#">x</a>'),
    
    initialize: function(){
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    }

    events:  { "click a": "cancel" },
    cancel: function(){
      this.model.cancel();
    },
    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    },
    remove: function(){
      this.$el.remove();
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this



