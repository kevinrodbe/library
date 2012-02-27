createSlide('5-3', '5-2', function(){
  
  var todoItem = new TodoItem({
    id: 1
  });
  console.log(todoItems.length);
  todoItems.add(todoItem);
  console.log(todoItems.length);
});
