// ### Level 5 - Forms

// Ajax forms are probably one of the most commonly implemented features of
// a javascript application, and Backbone makes them very convenient.
//
// By listening for DOM events and reacting appropriately to the model, we can
// create a reusable form view for many situations.
var TodoForm = Backbone.View.extend({
  events: {
    'click button.save': 'save'
  },
  save: function(e) {
    e.preventDefault();
    this.model.save({
      description: this.$('input[name=description]').val()
    });
  }
});

// The implementation above works correctly, but it would be nice if the form
// was submitted when pressing enter.  We can handle native events like this
// by listening for the "submit" event instead of a click event.
var TodoForm = Backbone.View.extend({
  events: {
    submit: 'save'
  },
  save: function(e) {
    e.preventDefault();
    this.model.save({
      description: this.$('input[name=description]').val()
    });
  }
});

// When editing a new model, it's tempting to reuse an existing view and
// replace the model.  In practice, this is not a good idea.  Latent state can
// sneak through and cause errors later on.
