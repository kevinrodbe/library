createSlide('level7-wrong', function(){

  $(function(){
    
    $.getJSON('/todos', function(data) {
      _.forEach(data, function(todoItem){
        $('#app').append('<div id='+todoItem.id+'><h3><input type=checkbox /> ' + todoItem.description + '<a href="#">☞</a></h3></div>');

        var h3 = $('div#'+todoItem.id+' h3');
        var input = $('div#'+todoItem.id+' input');
        var link = $('div#'+todoItem.id+' a');

        link.click(function(e){
          e.preventDefault();

          $('#app div').each(function(index, elem){
            if(parseInt($(elem).attr('id')) != todoItem.id){
              $(elem).hide();
            }
          });
        });

        if(todoItem.status == 'complete'){
          h3.addClass('complete');
          input.attr('checked', true)
        }

        input.on('change', function(e){
          if($(this).is(':checked')){
            h3.addClass('complete');
          }else{
            h3.removeClass('complete');
          }
        })
      });
    });

  });
});
