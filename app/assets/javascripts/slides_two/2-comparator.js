createSlide('2-comparator', 'app', function(){
  var TodoItems = Backbone.Collection.extend({
    comparator: 'priority'
  });
});