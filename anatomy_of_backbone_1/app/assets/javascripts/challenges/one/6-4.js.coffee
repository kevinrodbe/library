app.createChallenge '6-4', ->

  # Appending new models
  #
  # Instructions:
  # 
  # Uh oh.  Dr. Goodparts is at it again, adding new models to
  # the collection, and he's upset because when he adds a model, the
  # DOM isn't updated.  
  #
  # In the `AppointmentListView's` `initialize` function, listen
  # for the collections `add` event and call the `addOne` function
  # to append the new model to the view.
  #
  # Make sure you include the context argument to ensure `addOne` is
  # called with the correct context.
  # 
  #
  # Initial Code
  `var AppointmentListView = Backbone.View.extend({
    initialize: function(){

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

  # Alternate Answer:
  `var AppointmentListView = Backbone.View.extend({
    initialize: function(){
      this.collection.on('add', this.addOne, this);
    },
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





