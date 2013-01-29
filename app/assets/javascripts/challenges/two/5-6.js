app.createChallenge('5-6', function(){
  // Appointment Form Errors

  // Instructions:
  /*
    It's possible that saving the appointment on the server will fail and the server
    will respond with error messages. Add an error callback to the `save` call to handle
    this case and `alert` the user with the `errors` from the response.
  */

  // Setup:

  // Initial Code:
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
      this.model.save({title: newTitle, name: newName}, {
        success: function(){
          Backbone.history.navigate('', {trigger: true});
        }
      });
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
      this.model.save({title: newTitle, name: newName}, {
        success: function(){
          Backbone.history.navigate('', {trigger: true});
        },
        failure: function(model, xhr, options){
          var errors = JSON.parse(xhr.responseText).errors;
          alert(errors);
        }
      });
    }
  });
});