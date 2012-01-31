$(function(){
  
  $.getJSON('/todo', function(data) {
    $('#app').append('<h3>' + data.description + '</h3>')
  });

});

