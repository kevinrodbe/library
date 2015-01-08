createSlide('4-escaping-two', 'app', function(){
  
  TodoView.prototype.template = _.template('<%- model.get("description") %>')
  
  TodoView.prototype.render = function(){
    this.$el.html(this.template({model: this.model}));
    return this;
  }
  
});