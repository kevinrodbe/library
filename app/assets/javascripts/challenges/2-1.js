createChallenge('2-1', function(){
  window.TodoItem = Backbone.Model.extend({});
  window.todoItem = new TodoItem();
  todoItem.url = '/todo'
  todoItem.fetch();
})
