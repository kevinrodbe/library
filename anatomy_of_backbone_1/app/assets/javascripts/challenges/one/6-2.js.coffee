app.createChallenge '6-2', ->

  # Render the Collection
  #
  # Instructions:
  #
  # Good morning.  Last night you were so close to implementing
  # the render function on `AppointmentListView` but decided
  # to take a nap, and here you are!  
  #
  # Go ahead and implement the addOne function, rendering
  # an `AppointmentView` for each model in the collection, and
  # appending it to the collection view's top-level element.
  #
  # *Note* There is a bug in the `forEach` call. Make sure and fix
  # it before submitting.
  #
  # *Implementor Notes:*
  #
  # - Make sure and show the AppointmentView code in the resources
  # - To get the alternate answer to work, make sure the AppointmentView
  #   render function returns `this`
  #
  # Initial Code:
  `var AppointmentListView = Backbone.View.extend({
    render: function(){
      this.collection.forEach(this.addOne);
    },
    addOne: function(model){
      
    }
  });`

  # Answer:
  `var AppointmentListView = Backbone.View.extend({
    render: function(){
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render()
      this.$el.append(appointmentView.el);
    }
  });`
  #
  # Alternate Answer:
  `var AppointmentListView = Backbone.View.extend({
    render: function(){
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      this.$el.append(appointmentView.render().el);
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this




