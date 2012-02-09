createChallenge('7-7', '7-base', function(){
  window.TodoApp = new (Backbone.Router.extend({
    routes: {
      "7-7": "index", // again this is supposed to be ""
      "todos/:id": "show"
    },

    initialize: function(){
      this.todoItems = new TodoItems();
      this.todosView = new TodosView({collection: this.todoItems});
      this.todosView.render();
      $('#app').append(this.todosView.el);
    },

    index: function(){
      this.todoItems.fetch();
    },

    start: function(){
      Backbone.history.start();
    },

    show: function(id){
      this.todoItems.focusOnTodoItem(id);
    }

  }));

  $(function(){ TodoApp.start() });
});
