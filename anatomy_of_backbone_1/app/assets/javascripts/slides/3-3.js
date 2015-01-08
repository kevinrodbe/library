createSlide('3-3', function(){
  window.TodoView = Backbone.View.extend({
    tagName: 'article',
    id: 'todo-view',
    className: 'todo'
  });

  window.todoView = new TodoView();
  console.log(todoView.el);
});
