createSlide('7-2', function(){
  window.TodoRouter = Backbone.Router.extend({
    routes: {
      "todos/:id": "show"
    }
  });

  window.TodoApp = new TodoRouter();
})
