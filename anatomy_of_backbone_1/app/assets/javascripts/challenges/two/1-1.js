app.createChallenge('1-1', function(){
   // Parse
  
   // instructions:
  
   // Welcome to the Anatomy of Backbone.js 2 challenges!  Dr. Goodparts
   // was so pleased with our work in Anatomy of Backbone.js 1 that
   // he has hired us to continue working on his Appointment app. 
  
   // The good Dr. recently had another team implement the server
   // and they slightly messed up the format of the JSON returned for
   // Appointment data. Instead of returning JSON like
   // `{ "title": "Ms. Kitty Hairball Treatment", "cancelled": false, "id": 1 }`
   // the server is returning JSON like
   // `{ "appointment": { "title": "Ms. Kitty Hairball Treatment", "cankelled": false, "identifer": 1 }`
   //
   // Add to the parse function below code to handle return the JSON without the `"appointment"` as root.
  
   // Initial Code:
  var Appointment = Backbone.Model.extend({
    parse: function(response){

    }
  });

  // Answer:
  var Appointment = Backbone.Model.extend({
    parse: function(response){
      return response.appointment;
    }
  });
});