createSlide('4-4', function(){
  
  window.TodoItem = Backbone.Model.extend({
    toggleStatus: function(){
      if(this.get('status') == 'incomplete'){
        // set the status to complete
        this.set({'status': 'complete'});
      }else{
        // set the status to incomplete
        this.set({'status': 'incomplete'});
      }
    }
  });

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
      this.model.toggleStatus()
    }
  });

  window.todoItem = new TodoItem({description: 'Pick up milk.', status: 'incomplete'});

  window.todoView = new TodoView({model: todoItem});

  $('#app').append(todoView.render().el);
});
