createChallenge('7-base', function(){
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
    template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %> <a href="/#todos/<%= id %>">☞</a></h3>'),

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
});
