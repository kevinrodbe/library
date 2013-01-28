app.createChallenge('2-10', function(){
   // Counting up cancelled
  
   // Instructions:
  
   // There have been a rash of cancellations lately (some blame Dr. Goodparts excessive playing of Missy Elliot over the PA system)
   // We aren't here to point fingers, but the good Dr. wants us to implement a function on the collection
   // to count up the number of cancelled appointments. Implement this function in the collection class below
   // and call in `cancelledCount`.

  // Initial code
  var Appointments = Backbone.Collection.extend({
    
  });

  // Possible Answers:
  var Appointments = Backbone.Collection.extend({
    cancelledCount: function(){
      return this.where({cancelled: true}).length;
    }
  });

});