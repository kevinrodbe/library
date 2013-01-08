createSlide('1-tojson', 'app', function(){
  TodoItem.prototype.toJSON = function(){
    return _.clone(this.attributes);
  }
});