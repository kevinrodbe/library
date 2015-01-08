app.createChallenge('5-5', function(){
  // Appointment Form Redirect

  // Instructions:
  /*
    After submitting the form and saving the model, make sure we navigate
    the user back to the index route `''`. Also make sure this also happens
    if the model is saved successfully.     
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
      this.model.save({title: newTitle, name: newName});
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
        }
      });
    }
  });
});