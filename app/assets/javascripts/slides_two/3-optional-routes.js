createSlide('3-optional-routes', function(){
  window.TodoRouter = new (Backbone.Router.extend({

    routes: {
      'search/:query(/:page)': 'search'
    },

    search: function(query, page) {
      page = page || 0;
      console.log(query);
      console.log(page);
    }

  }));

  $(function(){ Backbone.history.start() });
});

// TodoRouter.navigate('search/asdfaf/2', {trigger: true})