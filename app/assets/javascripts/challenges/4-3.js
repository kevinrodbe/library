createChallenge('4-3', function(){
  
  window.TodoItem = Backbone.Model.extend({});

  window.TodoView = Backbone.View.extend({
    template: _.template('<h3><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

    events: {
      'change input': 'toggleStatus'
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    toggleStatus: function(){
      if(this.model.get('status') == 'incomplete'){
        // set the status to complete
        this.model.set({'status': 'complete'});
      }else{
        // set the status to incomplete
        this.model.set({'status': 'incomplete'});
      }
    }
  });

  window.todoItem = new TodoItem({description: 'Pick up milk.', status: 'incomplete'});

  window.todoView = new TodoView({model: todoItem});

  $('#app').append(todoView.render().el);
});
