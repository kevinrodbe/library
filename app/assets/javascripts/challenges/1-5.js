createChallenge('1-5', '1-2', '1-1', function(){
  // Add a render method to view, adding the correct html to the page
  window.TodoView = Backbone.View.extend({
    render: function(){
      $(this.el).html('<h3>' + this.model.get('description') + '</h3>');
      return this;
    }
  });

  window.todoView = new TodoView({model: todo});
});
