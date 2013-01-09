createSlide('3-catchall-routes', function(){
  window.TodoRouter = new (Backbone.Router.extend({

    routes: {
      '*path': 'notFound'
    },

    notFound: function(path) {
      alert('Sorry!  There is no content here.');
    }

  }));

  $(function(){ Backbone.history.start() });
});

// TodoRouter.navigate('asdfasdfasdfasdf', {trigger: true})