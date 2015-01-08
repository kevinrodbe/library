app.createChallenge('1-2', function(){
   // Parse II
  
   // instructions:
  
   // Great!. Now let's take care of that pesky spelling error. 

   // Change 'cankelled' to 'cancelled' and make sure to remove the 'cankelled' property
   //
   // Here is that bum JSON again:
   // `{ "appointment": { "title": "Ms. Kitty Hairball Treatment", "cankelled": false, "identifer": 1 }`
  
   // Initial Code:
  var Appointment = Backbone.Model.extend({
    parse: function(response){
      return response.appointment;
    }
  });

  // Answer:
  var Appointment = Backbone.Model.extend({
    parse: function(response){
      var appointment = response.appointment;
      appointment.cancelled = appointment.cankelled;
      delete appointment.cankelled;
      return appointment;
    }
  });
});