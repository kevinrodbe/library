createSlide('4-view-conventions-three', 'app', function(){
  
  TodoView.prototype.render = function(){
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
    
});