createChallenge('5-6', '5-1', function(){
  window.TodoItems = Backbone.Collection.extend({
    url: '/todos'
  });

  window.todoItems = new TodoItems();
  todoItems.fetch();
});
