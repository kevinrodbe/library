createSlide('2-generating-data', 'app', function(){
  TodoItems.prototype.toJSON = function(){
    return {todos: this.models};
  }
})