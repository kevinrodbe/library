app.createChallenge('3-1', function(){
  // Optional Routes

  // Instructions:
  // 
  // Duplication is Bad.  Let's DRY (Don't Repeat Yourself) our routes
  // to make `/pp:per_page` an optional part of the `page` route.
  
  // Initial Code:
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page": "page",
      "appointments/p:page/pp:per_page": "page"
    },
    page: function(page, per_page){
      per_page = per_page || 10;

      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));

  // Answer
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page(/pp:per_page)": "page"
    },
    page: function(page, per_page){
      per_page = per_page || 10;

      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));
});