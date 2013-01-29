app.createChallenge('6-4', function(){
  // Capture Links

  // Instructions:
  /*
    In our new App view, add an event to capture all clicks on `a` tags
    that have the `data-backbone` attribute on them. In the event handler, prevent
    the default event and use `Backbone.history.navigate` to pass the link
    through our app's router. Don't forget to pass in `trigger: true`.
  */

  // Setup:

  // Initial Code:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {}
  }))({el: document.body});

  // Answer:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {},
    events: {
      'click a[data-backbone]': function(e){
        e.preventDefault();
        Backbone.history.navigate(e.target.pathname, { trigger: true });
      }
    }
  }))({el: document.body});
  
});