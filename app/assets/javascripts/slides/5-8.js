createSlide('5-8', '5-5', function(){

  var result = todoItems.map(function(todoItem){
    return todoItem.get('description');
  });

  console.log(result);

  var incompletes = todoItems.filter(function(todoItem){
    return todoItem.get('status') == 'incomplete';
  });

  console.log(incompletes);
});
