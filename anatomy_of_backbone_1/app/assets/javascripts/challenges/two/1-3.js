app.createChallenge('1-3', function(){
   // ID Attribute
  
   // instructions:
  
   // Sweet! But Quick! Before Dr. Goodparts gets back from lunch,
   // update the Appointment model to use the `"identifier"` string
   // as the `idAttribute` instead of the default `"id"`, that way you can
   // call `appointment.id` later on.
  
   // Initial Code:
  var Appointment = Backbone.Model.extend({
    parse: function(response){
      var appointment = response.appointment;
      appointment.cancelled = appointment.cankelled;
      delete appointment.cankelled;
      return appointment;
    }
  });

  // Answer:
  var Appointment = Backbone.Model.extend({
    idAttribute: "identifier",

    parse: function(response){
      var appointment = response.appointment;
      appointment.cancelled = appointment.cankelled;
      delete appointment.cankelled;
      return appointment;
    }
  });
});