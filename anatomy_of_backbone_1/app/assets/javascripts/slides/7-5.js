createSlide('7-5', '7-base', function(){
  window.TodoRouter = Backbone.Router.extend({
    routes: {
      "todos/:id": "show"
    },

    initialize: function(options){
      this.todoItems = options.todoItems;
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
