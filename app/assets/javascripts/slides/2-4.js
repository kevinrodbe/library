createSlide('2-4', '2-2', function(){

  todoItem.on('change', function(){
    alert('todoItem has changed');
  });

  todoItem.set({
    description: 'Changing my todo..'
  });

  todoItem.set({
    description: 'Changing my todo again..'
  }, {silent: true});

  todoItem.off('change');

  todoItem.on('change:status', function(){
    alert('todoItem status has changed');
  });

  todoItem.set({
    status: 'complete'
  });

  todoItem.set({
    description: 'Start a backbone blog.'
  });

})
