app.createChallenge('5-3', function(){
  // Appointment Form Input Values

  // Instructions:
  /*
    Update the template to use the `title` and `name` attributes from the model
    to fill out the `value` attributes of the `input` elements in the template.
  */

  // Setup:

  // Initial Code:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" /><input name="name" type="text" /></form>'),
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });

  // Answer:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" value="<%= title %>" /><input name="name" type="text" value="<%= name %>" /></form>'),
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
});