app.createChallenge('4-2', function(){
   // Extra Options
  
   // instructions:
   // Update the `AppointmentsView` class to handle the extra option `doctor`
   // passed into the constructor, like so:
   // `new AppointmentsView({collection: appointments, doctor: drGoodparts})`
   // Assign the extra option to the `doctor` property on the view instance.
   
  
   // Initial Code:
   var AppointmentsView = Backbone.View.extend({});
  

  // Answer:
  var AppointmentsView = Backbone.View.extend({
    initialize: function(options){
      this.doctor = options.doctor;
    }
  });
  
});