createSlide('4-view-change', function(){
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
    template: _.template('<h3 class="<%= status %>"><input class="completer" type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <input type="text" value="<%= description %>" class="desc" /> <a href="/#todos/<%= id %>">☞</a></h3>'),

    events: {
      'change .completer': 'toggleStatus',
      'keyup .desc': function(e){
        this.model.set({description: e.target.value}, { silent: false });
        // this.model.set({description: e.target.value}, { highlight: false });
      }
    },

    initialize: function(){
      this.model.on('change:description', this.change, this);
      this.model.on('destroy hide', this.remove, this);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },

    change: function(model, value, options){
      this.$('.desc').val(value);
      if (options.highlight !== false) this.highlight();
    },

    highlight: function(){
      this.$el.effect("highlight", {}, 1000);
    },

    remove: function(){
      this.$el.remove();
    },

    toggleStatus: function(){
      this.model.toggleStatus()
    },

    showEditor: function(){
      this.$el.html(this.editTemplate(this.model.toJSON()));
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
      "todos/:id": "show"
    },

    initialize: function(){
      this.todoItems = new TodoItems();
      this.todosView = new TodosView({collection: this.todoItems});
      this.todosView.render();
      window.todoItems = this.todoItems;
      $('#app').append(this.todosView.el);
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