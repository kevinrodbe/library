createSlide('app', function(){

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
    template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %> <a href="/#todos/<%= id %>/edit">edit</a> <a class=control href="/#todos/<%= id %>">☞</a></h3>'),

    events: {
      'change input': 'toggleStatus'
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
    }
  });

  window.TodoItems = Backbone.Collection.extend({
    model: TodoItem,
    url: '/todos',

    initialize: function(){
      this.on('remove', this.hideModel, this);
    },

    hideModel: function(model){
      model.trigger('hide');
    },

    focusOnTodoItem: function(id) {
      var modelsToRemove = this.filter(function(todoItem){
        return todoItem.id != id;
      });

      this.remove(modelsToRemove);
    }
  })

  window.TodosView = Backbone.View.extend({
    template: _.template('<div class=nextpage><a href="#/todos/p<%= nextPage %>">next page</a></div>'),
    initialize: function(){
      this.addOne = _.bind(this.addOne, this);

      this.collection.on('add', this.addOne);
      this.collection.on('reset', this.render, this);
    },

    render: function(){
      this.addAll();
      this.$el.append(this.template({page: this.collection.page, nextPage: this.collection.page + 1}));
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

  window.TodoApp = new (Backbone.Router.extend({
    routes: {
      "": "index",
      "todos/p:page": "page",
      "todos/:id": "show"
    },

    initialize: function(){
      this.todoItems = new TodoItems();
      this.todosView = new TodosView({collection: this.todoItems});
      this.todosView.render();
      $('#app').append(this.todosView.el);
    },

    page: function(page){
      this.todoItems.fetch({data: {page: page}});
    },

    index: function(){
      this.todoItems.fetch();
    },

    start: function(){
      if (!Backbone.history.start()){
        this.index();
      }
    },

    show: function(id){
      this.todoItems.focusOnTodoItem(id);
    }

  }));

  $(function(){ TodoApp.start() });
});
