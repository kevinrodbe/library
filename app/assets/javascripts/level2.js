createSlide('level2', function(){

  var Todo = Backbone.Model.extend({});
  var TodoView = Backbone.View.extend({

    template: _.template('<h3 class=<%= status %>><input type=checkbox /><%= description %></h3>'),

    events: {
      'change input': 'toggleStatus'
    },

    initialize: function(){
      this.model.bind('change:status', this.updateStatus, this);
    },
    
    render: function(){
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    toggleStatus: function(e) {
      if(this.$el.find('input').is(':checked')){
        this.model.set({status: 'done'});
      }else{
        this.model.set({status: 'incomplete'});
      }
    },

    updateStatus: function(){
      this.$el.find('h3').addClass(this.model.get('status'))
      this.$el.find('h3').removeClass(this.model.previous('status'))
    }
  });

  var todo = new Todo({description: 'Pick up milk', status: 'incomplete'});
  var todoView = new TodoView({model: todo});

  $('#app').append(todoView.render().el);
});
