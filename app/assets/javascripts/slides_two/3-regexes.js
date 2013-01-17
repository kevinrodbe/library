createSlide('3-regexes', function(){
  window.TodoRouter = new (Backbone.Router.extend({
    routes: {
      'todos/:id': 'show'
    },
    initialize: function() {
      // this.route(/todo\/(\d+)/, 'todo');
    },

    show: function(id) {
      console.log(id);
    }

  }));

  $(function(){ Backbone.history.start() });
});

// TodoRouter.navigate('todo/17', {trigger: true})