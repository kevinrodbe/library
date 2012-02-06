createChallenge('3-7', function(){
  window.TodoView = Backbone.View.extend({
    events: {
      "click h3": "alertStatus"
    },

    alertStatus: function(e){
      alert('Hey you clicked the h3!');
    },

    render: function(){
      this.$el.html('<h3>Pick up milk.</h3>');
      return this;
    }
  });

  window.todoView = new TodoView();
  $('#app').append(todoView.render().el);
});
