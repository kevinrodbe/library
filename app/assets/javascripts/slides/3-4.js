createSlide('3-4', function(){
  window.TodoView = Backbone.View.extend({});

  window.todoView = new TodoView({el: $('#todo')});
  console.log(todoView.el);
});
