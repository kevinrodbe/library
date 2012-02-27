createSlide('2-3', '2-2', function(){
  todoItem.set({
    description: 'Pick up milk and cookies.'
  });

  todoItem.save();

  window.todoItem2 = new TodoItem({id: 1});
  todoItem2.fetch();

  window.newTodoItem = new TodoItem({
    description: 'Fill prescription.',
    status: 'incomplete'
  });

  newTodoItem.save()
});
