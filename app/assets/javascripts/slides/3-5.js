createSlide('3-5', '1-2', function(){
  window.TodoView = Backbone.View.extend({
    template: _.template('<h3><%= description %></h3>')
  });
});
