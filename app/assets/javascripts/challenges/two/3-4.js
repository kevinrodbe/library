app.createChallenge('3-4', function(){
  // Regular Expression Routes

  // Instructions:
  // 
  // Rewrite the show route to only accept numeric input
  // for the `id` parameter.  You'll have to add the `initialize`
  // function to the `AppRouter` and use a regular expression.
  
  
  // Initial Code:
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/:id":  "show"
    },
    show: function(id){
      var appointment = new Appointment({id: id});
      console.log(appointment);
    }
  }));

  // Answer
  var AppRouter = new (Backbone.Router.extend({
    initialize: function(){
      this.route(/^appointments\/(\d+)/, "show");
    },
    show: function(id){
      var appointment = new Appointment({id: id});
      console.log(appointment);
    }
  }));
});