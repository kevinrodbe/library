app.createChallenge('5-1', function(){
  // Appointment Form I

  // Instructions:
  /*
    Dr. Goodparts is sick with envy after coming back from rival Dr. Jay Query's office
    and seeing his slick Ajax form for creating new Appointments.

    Our first step is to add a template to the `AppointmentForm` below. Have the template
    produce a form with two inputs, one for the title of the appointment and one for the name
    of the person on the appointment.
  */

  // Setup:

  // Initial Code:
  var AppointmentForm = Backbone.View.extend({
    
  });

  // Answer:
  var AppointmentForm = Backbone.View.extend({
    template: _.template('<form><input name="title" type="text" /><input name="name" type="text" /></form>')
  });
});