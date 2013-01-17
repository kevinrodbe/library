app.createChallenge '3-6', ->

  # A better view event
  #
  # Instructions:
  # 
  # Phew, over the weekend you convinced Dr. Goodparts to
  # come to his senses and allow you to change the click
  # event to only alert when the user double clicks on the
  # view.
  #
  # Make those changes quick and deploy!
  #
  # Initial Code:
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

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span>'),

    events: { "dbclick span": "alertTitle" },
    alertTitle: function(){
      alert(this.model.get('title'));
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`


  # need this or coffeescript will produce a js syntax error
  this








