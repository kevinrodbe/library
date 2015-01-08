createSlide('6-7', '6-2', function(){
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

  window.TodoItems = Backbone.Collection.extend({
    model: TodoItem,
    url: '/todos'
  })

  window.TodosView = Backbone.View.extend({
    initialize: function(){
      this.addOne = _.bind(this.addOne, this);
      this.addAll = _.bind(this.addAll, this);

      this.collection.on('add', this.addOne);
      this.collection.on('reset', this.addAll);
    },

    render: function(){
      this.addAll()
      return this;
    },

    addAll: function(){
      this.collection.forEach(this.addOne);
    },

    addOne: function(todoItem){
      var todoView = new TodoView({model: todoItem});
      this.$el.append(todoView.render().el); 
    }
  });

  window.todoItems = new TodoItems();
  window.todosView = new TodosView({collection: todoItems});
  // todosView.render();
  // $('#app').append(todosView.el);

  // todoItems.fetch();
})
