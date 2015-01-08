createSlide('4-view-conventions', 'app', function(){
  
  var todoItem = new TodoItem({description: 'item1', status: 'incomplete'});
  var todoItem2 = new TodoItem({description: 'item2', status: 'incomplete'});
  var todoItems = [todoItem, todoItem2]

  var todoView = new TodoView({
    model: todoItem
  });

  var todoList = new TodoItems({
    collection: todoItems
  });

});