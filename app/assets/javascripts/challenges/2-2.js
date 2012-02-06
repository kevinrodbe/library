createChallenge('2-2', function(){
  window.TodoItem = Backbone.Model.extend({urlRoot: '/todos'});

  window.todoItem = new TodoItem({id: 1});
});
