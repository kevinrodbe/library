createSlide('3-catchall-routes', function(){
  // window.TodoRouter = new (Backbone.Router.extend({

  //   routes: {
  //     '*path': 'notFound'
  //   },

  //   notFound: function(path) {
  //     alert('Sorry!  There is no content here.');
  //   }

  // }));

  window.TodoRouter = new (Backbone.Router.extend({

    routes: {
      'file/*path': 'file'
    },

    file: function(path) {
      var parts = path.split("/");
      console.log(parts);
    }

  }));

  $(function(){ Backbone.history.start() });
});

// TodoRouter.navigate('asdfasdfasdfasdf', {trigger: true})