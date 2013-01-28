app.createChallenge('2-9', function(){
   // Sorting Appointments Reverse
  
   // Instructions:
  
   // Dr. Goodparts just sent us this email "Love the new sorting, but please flip it and reverse it",
   // Update the comparator below to sort by date in reverse order

  // Initial code
  var Appointments = Backbone.Collection.extend({
    comparator: 'date'
  });

  // Possible Answers:
  var Appointments = Backbone.Collection.extend({
    comparator: function(){
      return -this.get('date');
    }
  });

});