createSlide('4-escaping', 'app', function(){
  
  TodoView.prototype.template = _.template('<%= model.escape("description") %>')
  
  TodoView.prototype.render = function(){
    this.$el.html(this.template({model: this.model}));
    return this;
  }
  
});