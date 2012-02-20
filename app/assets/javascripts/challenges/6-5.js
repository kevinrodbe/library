createChallenge('6-5', '6-2', function(){
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

  window.TodosView = Backbone.View.extend({
    initialize: function(){
      this.addOne = _.bind(this.addOne, this);
      this.collection.on('add', this.addOne);
    },

    render: function(){
      this.collection.forEach(this.addOne);
      return this;
    },

    addOne: function(todoItem){
      var todoView = new TodoView({model: todoItem});
      this.$el.append(todoView.render().el); 
    }
  });

  window.todosView = new TodosView({collection: todoItems});
  todosView.render();
  $('#app').append(todosView.el);

  window.newTodoItem = new TodoItem({description: 'Learn Rails', status: 'incomplete'})
  // todoItems.add(newTodoItem);
})
