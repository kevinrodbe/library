createChallenge('5-5', '5-2', function(){
  var todos = [
    {description: 'Pick up milk.', status: 'incomplete'},
    {description: 'Get a car wash', status: 'complete'},
    {description: 'Learn Backbone', status: 'incomplete'}
  ]

  todoItems.reset(todos);
  // console.log(todoItems.length);
});
