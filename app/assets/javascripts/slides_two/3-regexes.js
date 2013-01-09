createSlide('3-regexes', function(){
  window.TodoRouter = new (Backbone.Router.extend({

    initialize: function() {
      this.route(/todo\/(\d+)/, 'todo');
    },

    todo: function(id) {
      console.log(id);
    }

  }));

  $(function(){ Backbone.history.start() });
});