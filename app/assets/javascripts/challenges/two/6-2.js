app.createChallenge('6-2', function(){
  // App View

  // Instructions:
  /*
    Turn the `AppointmentApp` object into a Backbone view instance. That means
    that you'll have to immediately instantiate the Backbone.View class returned
    by `Backbone.View.extend()`.
  */

  // Setup:

  // Initial Code:
  var AppointmentApp = {
    Collections: {},
    Models: {},
    Views: {}
  }

  // Answer:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {}
  }))();
  
});