app.createChallenge('2-6', function(){
   // Building View Next II
  
   // Instructions:
  
   // Great! Now that we have the template, let's add
   // some code in the `render` function to append the
   // generated HTML from the template into the `AppointmentListView`
   // `$el`.  Make sure you pass in the `page` and `per_page` properties
   // to the template function, getting those values from `this.collection.page + 1`
   // and `this.collection.per_page` respectively.

   // Setup code:
   var AppointmentView = Backbone.View.extend({
     template: _.template('<span class="<%= if(cancelled) print("cancelled") %>">' +
                           '<%= title %></span>' +
                           '<a href="#">x</a>'),
     
     initialize: function(){
       this.model.on('change', this.render, this);
       this.model.on('destroy', this.remove, this);
     },

     events:  { "click a": "cancel" },
     cancel: function(){
       this.model.cancel();
     },
     render: function(){
       this.$el.html(this.template(this.model.toJSON()));
     },
     remove: function(){
       this.$el.remove();
     }
   });

  // Initial code
  var AppointmentListView = Backbone.View.extend({
    template: _.template('<a href="#/appointments/p<%= page %>/pp<%= per_page %>">View Next</a>'),
    initialize: function(){
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.$el.empty();
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render();
      this.$el.append(appointmentView.el);
    }
  });

  // Answers:
  var AppointmentListView = Backbone.View.extend({
    template: _.template('<a href="#/appointments/p<%= page %>/pp<%= per_page %>">View Next</a>'),
    initialize: function(){
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.$el.empty();
      this.collection.forEach(this.addOne, this);
      this.$el.append(this.template({page: this.collection.page + 1, per_page: this.collection.per_page}));
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render();
      this.$el.append(appointmentView.el);
    }
  });
});