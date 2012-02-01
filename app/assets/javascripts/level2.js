createChallenge('level2', function(){

  var Todo = Backbone.Model.extend({});
  var TodoView = Backbone.View.extend({

    template: _.template('<h3><input type=checkbox class=<%= status %> /><%= description %></h3>'),

    initialize: function(){
      this.model.bind('change', this.render, this);
    },
    
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var todo = new Todo({description: 'Pick up milk', status: 'done'});
  var todoView = new TodoView({model: todo});

  $('#app').append(todoView.render().el);
});
