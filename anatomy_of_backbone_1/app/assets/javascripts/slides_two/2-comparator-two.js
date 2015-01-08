createSlide('2-comparator-two', 'app', function(){
  var TodoItems = Backbone.Collection.extend({
    comparator: function(model) {
      return -model.get('priority');
    }
  });
});