createChallenge('6-1', '5-5', function(){
  window.TodosView = Backbone.View.extend({});
  window.todosView = new TodosView({collection: todoItems});
});
