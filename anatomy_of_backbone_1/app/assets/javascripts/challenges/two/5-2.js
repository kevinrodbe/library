app.createChallenge('5-2', function(){
  // Appointment Form Render

  // Instructions:
  /*
    Now write the render function to render the template and pass in the model attributes.
    Return `this` from the render function.
  */

  // Setup:

  // Initial Code:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" /><input name="name" type="text" /></form>')
  });

  // Answer:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" /><input name="name" type="text" /></form>'),
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
});