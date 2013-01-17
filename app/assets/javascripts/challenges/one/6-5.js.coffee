app.createChallenge '6-5', ->

  # Reset All the Things
  #
  # Instructions:
  # 
  # It's monday morning and time to reset all the appointments
  # for the week.  You hear a screach from down the hall and seconds
  # later Dr. Goodparts barges red-faced into your office because
  # the DOM didn't update when he reset the collection.
  #
  # Update the AppointmentListView to listen for the collection's `reset`
  # event to call the `render` function.
  #
  # Make sure you include the context argument to ensure `render` is
  # called with the correct context.
  # 
  #
  # Initial Code
  `var AppointmentListView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('add', this.addOne, this);
    },
    render: function(){
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render();
      this.$el.append(appointmentView.el);
    }
  });`


  # Answer:
  `var AppointmentListView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.render, this);
    },
    render: function(){
      this.collection.forEach(this.addOne, this);
    },
    addOne: function(model){
      var appointmentView = new AppointmentView({model: model});
      appointmentView.render();
      this.$el.append(appointmentView.el);
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this

