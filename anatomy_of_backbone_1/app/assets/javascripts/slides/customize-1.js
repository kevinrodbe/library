//= require mustache

createSlide('customize-1', 'app', function(){
  TodoItem.prototype = _.extend(TodoItem.prototype, {
    toJSON: function(){
      var attrs = _.clone(this.attributes);
      attrs.completed = attrs.status == "complete"
      return attrs;
    }
  });

  TodoView.prototype = _.extend(TodoView.prototype, {
    template: Mustache.compile('<h3 class="{{ status }}">' +
      '<input type=checkbox {{#completed}} checked=checked {{/completed}} />' + 
      '{{ description }} <a href="/#todos/{{ id }}%>">☞</a></h3>')
  });
});