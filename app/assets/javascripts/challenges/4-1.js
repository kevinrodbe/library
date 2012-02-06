createChallenge('4-1', function(){
  
  window.TodoItem = Backbone.Model.extend({});

  window.TodoView = Backbone.View.extend({
    template: _.template('<h3><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  })

  window.todoItem = new TodoItem({description: 'Pick up milk.', status: 'incomplete'});

  window.todoView = new TodoView({model: todoItem});

  $('#app').append(todoView.render().el);
});
