createSlide('broken', function(){
  window.TodoItem = Backbone.Model.extend({
    toggleStatus: function(){
      if(this.get('status') == 'incomplete'){
        this.set({'status': 'complete'});
      }else{
        this.set({'status': 'incomplete'});
      }

      this.save();
    }
  });

  window.TodoView = Backbone.View.extend({
    template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %> <a href="#">☞</a></h3>'),

    events: {
      'change input': 'toggleStatus',
      'click a': 'focus'
    },

    initialize: function(){
      this.model.on('change', this.render, this);
      this.model.on('destroy hide', this.remove, this);
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
    },

    focus: function(e){
      e.preventDefault();
      this.model.trigger('focus', {id: this.model.id});
    }
  });

  window.TodoItems = Backbone.Collection.extend({
    model: TodoItem,
    url: '/todos',

    initialize: function(){
      this.on('remove', this.hideModel, this);
      this.on('focus', this.focusModel, this);
    },

    hideModel: function(model){
      model.trigger('hide');
    },

    focusModel: function(options) {
      this.focusOnTodoItem(options.id);
    },

    focusOnTodoItem: function(id) {
      var modelsToRemove = this.filter(function(todoItem){
        return todoItem.id != id;
      });

      this.remove(modelsToRemove);
    }
  })

  window.TodosView = Backbone.View.extend({
    initialize: function(){
      this.addOne = _.bind(this.addOne, this);

      this.collection.on('add', this.addOne);
      this.collection.on('reset', this.addAll, this);
    },

    render: function(){
      this.addAll()
      return this;
    },

    addAll: function(){
      this.$el.empty();
      this.collection.forEach(this.addOne);
    },

    addOne: function(todoItem){
      var todoView = new TodoView({model: todoItem});
      this.$el.append(todoView.render().el); 
    }
  });

  // window.TodoApp = new (Backbone.Router.extend({
  //   routes: {
  //     "": "index",
  //     "todos/:id": "show"
  //   },

  //   initialize: function(){
  //     this.todoItems = new TodoItems();
  //     this.todosView = new TodosView({collection: this.todoItems});
  //     this.todosView.render();
  //     $('#app').append(this.todosView.el);
  //   },

  //   index: function(){
  //     this.todoItems.fetch();
  //   },

  //   start: function(){
  //     Backbone.history.start();
  //   },

  //   show: function(id){
  //     this.todoItems.focusOnTodoItem(id);
  //   }

  // }));

  // $(function(){ TodoApp.start() });
  this.todoItems = new TodoItems();
  this.todosView = new TodosView({collection: this.todoItems});
  this.todosView.render();
  $('#app').append(this.todosView.el);
  this.todoItems.fetch();
});

