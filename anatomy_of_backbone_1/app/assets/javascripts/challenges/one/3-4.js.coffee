app.createChallenge '3-4', ->

  # Using a Template
  #
  # Instructions:
  # 
  # Dr. Goodparts is getting ready to request some big changes
  # to our `AppointmentView`. You know that eventually
  # the HTML it generates is going to get pretty complicated,
  # so now is probably a good time to refactor to use a template.
  #
  # Make sure you generate the same HTML after switching to templates.
  #
  # Tip: don't forget to use `this.model.toJSON()` in `render`
  #
  # Initial Code:
  `var AppointmentView = Backbone.View.extend({
    render: function(){
      this.$el.html('<span>' + this.model.get('title') + '</span>');
    }
  });`

  # Answer:
  `var AppointmentView = Backbone.View.extend({
    template: _.template('<span><%= title %></span>'),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this






