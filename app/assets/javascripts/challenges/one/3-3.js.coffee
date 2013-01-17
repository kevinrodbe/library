app.createChallenge '3-3', ->

  # Top-Level jQuery
  #
  # Instructions:
  # 
  # Refactor the `render` function below to use the view instance's
  # cached jQuery top-level element.
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({
    render: function(){
      $(this.el).html('<li>' + this.model.get('title') + '</li>');
    }
  });`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    render: function(){
      this.$el.html('<li>' + this.model.get('title') + '</li>');
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this





