createChallenge('3-2', function(){

  window.TodoView = Backbone.View.extend({
    tagName: 'article'
  });

  window.todoView = new TodoView();
  console.log(todoView.el);
});
