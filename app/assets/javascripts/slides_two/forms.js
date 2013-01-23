createSlide('forms', function(){
  window.TodoItem = Backbone.Model.extend({
    urlRoot: "/todos",
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

  window.TodoApp = new (Backbone.Router.extend({
    routes: {
      "": "index",
      'todos/new': 'newTodo',
      "todos/:id": "show",
      'todos/:id/edit': "edit"
    },

    initialize: function(){
      this.todoItems = new TodoItems();
      this.todosView = new TodosView({collection: this.todoItems});
      this.todosView.render();
      $('#app').append(this.todosView.el);
    },

    index: function(){
      this.todoItems.fetch();
      $('#app').html(this.todosView.render().el);
      $('#app').append('<h2><a href="#/todos/new">New Todo</a></h2>');
    },

    start: function(){
      if (!Backbone.history.start()){
        this.index();
      }
    },

    show: function(id){
      this.todoItems.focusOnTodoItem(id);
    },

    edit: function(id){
      var todoForm = new TodoForm({model: this.todoItems.get(id) });
      $('#app').html(todoForm.render().el);
    },

    newTodo: function(){
      var model = new TodoItem({description: "What do you have to do?"});
      var todoForm = new TodoForm({model: model});
      $('#app').append(todoForm.render().el);
    }

  }));

  $(function(){ TodoApp.start() });

  window.TodoForm = Backbone.View.extend({
    template: _.template('<form><input class=todoBox name=description value="<%= description %>" /><button>Save</button></form>'),
    events: {
      submit: 'save'
    },
    save: function(e) {
      e.preventDefault();
      this.model.save({
        description: this.$('input[name=description]').val()
      }, { 
        success: function(model, response, options){
          Backbone.history.navigate('', { trigger: true });
        },
        error: function(model, xhr, options){
          var errors = JSON.parse(xhr.responseText).errors;
          alert('Oops, something went wrong with saving the TodoItem: ' + errors);
        }
      });
    },
    render: function(){
      this.$el.html(this.template(this.model.attributes));
      return this;
    }
  });
});