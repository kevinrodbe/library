createChallenge('6-6', '6-2', function(){
  window.TodoView = Backbone.View.extend({
    template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

    events: {
      'change input': 'toggleStatus'
    },

    initialize: function(){
      this.model.bind('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    remove: function(){
      this.$el.remove();
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

  window.newTodoItem = new TodoItem({description: 'Learn js', status: 'complete'})
  todoItems.add(newTodoItem);
})
