createChallenge('7-3', function(){
  window.TodoRouter = Backbone.Router.extend({
    routes: {
      "todos/:id": "show"
    },

    show: function(id){
      console.log("in show with id " + id + " ...");
    }
  });

  window.TodoApp = new TodoRouter();
})
