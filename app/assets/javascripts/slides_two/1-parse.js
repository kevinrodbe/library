createSlide('1-parse', 'app', function(){
  // For this to work, change include_root_in_json to true
  TodoItem.prototype.parse = function(response){
    return response.todo;
  }
})