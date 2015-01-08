createSlide('3-optional-routes', function(){

  // window.TodoRouter = new (Backbone.Router.extend({
  //   routes: {
  //     'search/:query': 'search',
  //     'search/:query/p:page': 'search'
  //   },
  //   search: function(query, page) {
  //     page = page || 0;
  //     console.log(query);
  //     console.log(page);
  //   }
  // }));

  // window.TodoRouter = new (Backbone.Router.extend({
  //   initialize: function(){
  //     this.route(/^search\/(\w+)(?:\/p(\d+))?\/?$/, 'search');
  //   },
  //   search: function(query, page) {
  //     page = page || 0;
  //     console.log(query);
  //     console.log(page);
  //   }
  // }));

  window.TodoRouter = new (Backbone.Router.extend({

    routes: {
      'search/:query(/p:page)(/)': 'search'
    },

    search: function(query, page) {
      page = page || 0;
      query = decodeURIComponent(query);
      console.log(query);
      console.log(page);
    }

  }));

  $(function(){ Backbone.history.start() });
});

// TodoRouter.navigate('search/asdfaf/2', {trigger: true})
// TodoRouter.navigate('search/asdfaf/2/', {trigger: true})