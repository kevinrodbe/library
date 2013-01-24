app.createChallenge('1-6', function(){
   // Render changes
  
   // instructions:
  
   // Now that we've modified toJSON to return mangled JSON,
   // we need to change our AppointmentView to use `attributes`
   // instead of `toJSON`.

  // Initial code
  var AppointmentView = Backbone.View.extend({
    template: _.template('<span>' +
                          '<%= title %></span>' +
                          '<a href="#">x</a>'),

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
    }
  });

  // Answer:
  var AppointmentView = Backbone.View.extend({
    template: _.template('<span>' +
                          '<%= title %></span>' +
                          '<a href="#">x</a>'),

    render: function(){
      this.$el.html(this.template(this.model.attributes);
    }
  });

});