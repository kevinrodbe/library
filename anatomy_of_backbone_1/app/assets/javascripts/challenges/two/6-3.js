app.createChallenge('6-3', function(){
  // App View with Body

  // Instructions:
  /*
    In the view constructor function call, pass in `document.body` as the `el`
    option. This will setup what we need for handling click events and rendering
    our initial HTML.
  */

  // Setup:

  // Initial Code:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {}
  }))();

  // Answer:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {}
  }))({el: document.body});
  
});