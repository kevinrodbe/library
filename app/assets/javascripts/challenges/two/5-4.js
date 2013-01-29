app.createChallenge('5-4', function(){
  // Appointment Form Event Handling

  // Instructions:
  /*
    Update the `AppointmentForm` view to handle the submit event on the form.
    Also go ahead and implement the function to handle that event. It should
    save both the `title` and `name` attributes on the model with values from
    their respective inputs.  Make sure the event function stops the default event
    from happening (which would cause the browser to submit the form, instead
    of us handling it with our Backbone model.)
  */

  // Setup:

  // Initial Code:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" value="<%= title %>" /><input name="name" type="text" value="<%= name %>" /></form>'),
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
    },
    events: {
      submit: "save"
    },
    save: function(e){
      e.preventDefault();
      var newTitle = this.$('input[name=title]').val();
      var newName = this.$('input[name=name]').val();
      this.model.save({title: newTitle, name: newName});
    }
  });
});