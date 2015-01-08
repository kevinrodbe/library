app.createChallenge('2-5', function(){
   // Building View Next I
  
   // Instructions:
  
   // Dr. Goodparts has requested that we add a link to the
   // application that will show the next 10 appointments. Luckily
   // we already have the ability to paginate through appointments
   // by passing the `per_page` and `page` params to the server
   // when we fetch the collection. 
   //
   // Let's start to implement this feature by adding a template to the
   // `AppointmentListView` below. The template should have a link that looks
   // like this: `<a href="#/appointments/p<%= page %>/pp<%= per_page %>">View Next</a>`

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
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render();
      this.$el.append(appointmentView.el);
    }
  });
});