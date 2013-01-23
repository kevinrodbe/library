app.createChallenge('1-5', function(){
   // Force Parse
  
   // instructions:
  
   // In the Appointment initialization code below, make sure
   // the attributes get run through our new `parse` function by
   // passing in the appropriate option to the `Appointment` constructor
  
   // Setup Code:
  var Appointment = Backbone.Model.extend({
    parse: function(response){
      var appointment = response.appointment;
      appointment.cancelled = appointment.cankelled;
      delete appointment.cankelled;
      return appointment;
    }
  });

  // Initial code
  var appointment = new Appointment(data);

  // Answer:
  var appointment = new Appointment(data, { parse: true });
});