createSlide('4-view-conventions-two', 'app', function(){
  
  TodoView.prototype.render = function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
    
});