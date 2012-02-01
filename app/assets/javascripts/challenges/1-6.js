createChallenge('1-6', '1-5', '1-2', '1-1', function(){
  // Call the render function and insert the html
  $('#app').html(todoView.render().el);
});
