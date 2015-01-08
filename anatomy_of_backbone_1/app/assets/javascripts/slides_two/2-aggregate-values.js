createSlide('2-aggregate-values', 'app', function(){
  TodoItems.prototype.completedCount = function(){
    return this.where({status: 'complete'}).length;
  }
});