createChallenge('7-6', '7-base', function(){
  window.TodoRouter = Backbone.Router.extend({
    routes: {
      "todos/:id": "show",
      "7-6": "index" // using 7-6 but really should just be ""
    },

    initialize: function(options){
      this.todoItems = options.todoItems;
    },

    index: function(){
      console.log("fetching all todos...");
      this.todoItems.fetch();
    },

    show: function(id){
      this.todoItems.focusOnTodoItem(id);
    }
  });
  window.todoItems = new TodoItems();
  window.todosView = new TodosView({collection: todoItems});
  todosView.render();
  $('#app').append(todosView.el);
  todoItems.fetch();

  window.TodoApp = new TodoRouter({todoItems: todoItems});
  Backbone.history.start();
});
