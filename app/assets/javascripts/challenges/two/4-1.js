app.createChallenge('4-1', function(){
   // Existing EL
  
   // instructions:
   // Below we have our `AppointmentsView` instance rendering and then taking
   // the rendered HTML and inserting into the `$('#app')` element. 
   //
   // Change the code to instead pass in the `$('#app')` element into the view constructor
   // to make it the `appointmentsView.el`.
   
  
   // Initial Code:
   var appointmentsView = new AppointmentsView({collection: appointments});
   $('#app').html(appointmentsView.render().el);
  

  // Answer:
  var appointmentsView = new AppointmentsView({collection: appointments, el: $('#app')});
  appointmentsView.render();
  
});