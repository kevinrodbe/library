window.challenges['1-1'] = function() {
  
  $(function(){
    
    $.getJSON('/todo', function(data) {
      $('#app').append('<h3><input type=checkbox class=completed /> ' + data.description + '</h3>')

      if(data.done){
        $('#app h3').addClass('done');
        $('#app .completed').attr('checked', true)
      }

      $('#app .completed').on('change', function(e){
        if($(this).is(':checked')){
          $('#app h3').addClass('done');
        }else{
          $('#app h3').removeClass('done');
        }
      })
    });

  });
}
