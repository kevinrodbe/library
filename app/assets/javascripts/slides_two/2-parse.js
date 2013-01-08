createSlide('2-parse', 'app', function(){
  // For this to work, change index action in todos_controller.rb to use the render :json call
  TodoItems.prototype.parse = function(response){
    this.perPage = response.perPage;
    this.page = response.page;
    this.total = response.total;
    return response.todos;
  }
})