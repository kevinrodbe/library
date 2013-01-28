app.createChallenge('2-8', function(){
   // Sorting Appointments
  
   // Instructions:
  
   // Our appointments are being rendered in a pretty haphazard way.
   // Dr. Goodparts is very chronological, so we need to always
   // have our appointments sorted by the date.  Add the code below
   // to accomplish this.

  // Initial code
  var Appointments = Backbone.Collection.extend({});

  // Possible Answers:
  var Appointments = Backbone.Collection.extend({
    comparator: 'date'
  });

});