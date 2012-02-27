createSlide('2-5', function(){
  window.TodoItem = Backbone.Model.extend({
    defaults: {
      description: 'Empty todo...',
      status: 'incomplete'
    }
  });

  window.todoItem = new TodoItem();
})
