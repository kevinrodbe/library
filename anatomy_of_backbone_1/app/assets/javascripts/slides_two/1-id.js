createSlide('1-id', 'app', function(){
  window.TodoItem = Backbone.Model.extend({
    idAttribute: '_id'
  });
});