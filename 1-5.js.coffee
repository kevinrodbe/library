app.createChallenge '1-5', ->

  # Define Render
  #
  # Instructions:
  #
  # Our `AppointmentView` instance is almost ready, all we have to do is
  # go back and define the AppointmentView render function we we can actually
  # create some HTML.
  #
  # Have the render function add an `<li>` tag to the top-level element of
  # the view.  Use `this.model.get('title')` as the content of the `<li>`.
  #
  # initial code:
  `var AppointmentView = Backbone.View.extend({
  
  });`
  
  # Answer:
  `var AppointmentView = Backbone.View.extend({
    render: function(){
      $(this.el).html('<li>' + this.model.get('title') + '</li>');
    }
  });`

  # Alternate Answer:
  `var AppointmentView = Backbone.View.extend({
    render: function(){
      this.$el.html('<li>' + this.model.get('title') + '</li>');
    }
  });`



