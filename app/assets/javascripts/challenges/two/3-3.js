app.createChallenge('3-3', function(){
  // Decoding params

  // Instructions:
  // 
  // The Server Team is at it again and has added the ability to select
  // a page and the per page using natural language. So instead of page `25`,
  // they can now accept `"twenty five"`.  Our `page` route function should work
  // as is but it needs to be able to handle encoded params.  To fix this,
  // decode the `page` and `per_page` params in the `page` function.
  
  // Initial Code:
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page(/pp:per_page)(/)": "page"
    },
    page: function(page, per_page){
      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));

  // Answer
  var AppRouter = new (Backbone.Router.extend({
    routes: {
      "appointments/p:page(/pp:per_page)(/)": "page"
    },
    page: function(page, per_page){
      page = decodeURIComponent(page);
      per_page = decodeURIComponent(per_page);
      this.appointments.fetch({data: {page: page, per_page: per_page}});
    }
  }));
});