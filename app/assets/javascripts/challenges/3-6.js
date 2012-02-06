createChallenge('3-6', '1-2', function(){
  window.TodoView = Backbone.View.extend({
    template: _.template('<h3><%= description %></h3>'),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()))
      return this;
    }
  });

  window.todoView = new TodoView({model: todo});
});
