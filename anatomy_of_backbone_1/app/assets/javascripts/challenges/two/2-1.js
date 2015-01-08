app.createChallenge('2-1', function(){
   // Collection parsing
  
   // Instructions:
  
   // The server team is at it again, but this time they at least
   // have a good reason: they want to start paginating appointments
   // instead of just returning all of them when we fetch the `Appointments`
   // collection. No problem. We've been here before. Take a look at the
   // JSON the server is responding with below, and then modify the `parse`
   // function to set properties on the collection instance for `per_page`, `total`, and `page`.

   // JSON:

   {
    "per_page": 10, "page": 1, "total": 50,
    "appointments": [
      { "title": "Ms. Kitty Hairball Treatment", "cankelled": false, "identifer": 1 }
    ]
   }

  // Initial code
  var Appointments = Backbone.Collection.extend({
    parse: function(response){
      return response;
    }
  });

  // Possible Answers:
  var Appointments = Backbone.Collection.extend({
    parse: function(response){
      this.perPage = response.per_page;
      this.page = response.page;
      this.total = response.total;
      
      return response;
    }
  });

  var Appointments = Backbone.Collection.extend({
    parse: function(response){
      this.per_page = response.per_page;
      this.page = response.page;
      this.total = response.total;
      
      return response.appointments;
    }
  });

  // Wrong:
  var Appointments = Backbone.Collection.extend({
    parse: function(response){
      this.per_page = response.per_page;
      this.page = response.page;
      this.total = response.total;
    }
  });

});