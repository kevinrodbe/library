createSlide('2-parse', 'app', function(){
  // For this to work, change index action in todos_controller.rb to use the render :json call

  TodoItems.prototype.parse = function(response){
    this.per_page = response.per_page;
    this.total = response.total;
    this.page = response.page;

    return response.todos;
  }
})