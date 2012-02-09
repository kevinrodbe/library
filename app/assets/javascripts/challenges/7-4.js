createChallenge('7-4', '7-3', function(){
  Backbone.history.start();

  TodoApp.navigate("todos/1", {trigger: true});
});
