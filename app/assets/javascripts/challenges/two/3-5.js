app.createChallenge('3-5', function(){
  // Catch-all Route

  // Instructions:
  // 
  // Just in case people fiddle around with the URL
  // let's add a catch-all route to our router that
  // will log out to the console.  Make sure the catch-all
  // route comes last.
  
  
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
    routes: {
      "appointments/:id":  "show",
      "*path": "notFound"
    },
    notFound: function(){
      console.log("No route matches this.");
    },
    show: function(id){
      var appointment = new Appointment({id: id});
      console.log(appointment);
    }
  }));
});