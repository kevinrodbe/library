app.createChallenge('3-2', function(){
  // Optional Routes II

  // Instructions:
  // 
  // Dr. Goodparts has the bad habit of typing out his URL's with a trailing
  // slash and now he's upset that our routes don't work. Please update the route
  // below to optionally accept an optional trailing slash
  
  // Initial Code:
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page(/pp:per_page)": "page"
    },
    page: function(page, per_page){
      per_page = per_page || 10;

      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));

  // Answer
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page(/pp:per_page)(/)": "page"
    },
    page: function(page, per_page){
      per_page = per_page || 10;

      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));
});