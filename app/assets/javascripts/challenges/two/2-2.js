app.createChallenge('2-2', function(){
   // Collection parsing II
  
   // Instructions:
  
   // Fantastic work! Now to finish the job, just return the `"appointments"`
   // array from the `parse` function, instead of the entire response.

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
      this.perPage = response.per_page;
      this.page = response.page;
      this.total = response.total;

      return response;
    }
  });

  // Possible Answers:
  var Appointments = Backbone.Collection.extend({
    parse: function(response){
      this.perPage = response.per_page;
      this.page = response.page;
      this.total = response.total;
      
      return response.appointments;
    }
  });

});