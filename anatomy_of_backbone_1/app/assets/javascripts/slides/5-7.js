createSlide('5-7', '1-1', function(){
  window.TodoItems = Backbone.Collection.extend({
    model: TodoItem,
    url: '/todos'
  });

  window.todoItems = new TodoItems();

  todoItems.on('reset', function(){
    alert('Reset all the models on todoItems');
  });

  todoItems.on('add', function(){
    alert('Added a model instance');
  });

  todoItems.on('remove', function(todoItem){
    alert('Removed a model instance');
    todoItem.destroy();
  });

  todoItems.fetch();
  window.todoItem = new TodoItem();
  todoItems.add(todoItem);
  todoItems.remove(todoItem);
});

