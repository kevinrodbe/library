createChallenge('4-5', function(){
  window.TodoItem = Backbone.Model.extend({
    toggleStatus: function(){
      if(this.get('status') == 'incomplete'){
        this.set({'status': 'complete'});
      }else{
        this.set({'status': 'incomplete'});
      }
    }
  });

  window.TodoView = Backbone.View.extend({
    template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

    events: {
      'change input': 'toggleStatus'
    },

    initialize: function(){
      this.model.bind('change', this.render, this);
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
