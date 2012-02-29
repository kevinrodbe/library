app.createChallenge '6-6', ->

  # Removing a Model
  #
  # Instructions:
  # 
  # Turns out one of the appointments in our collection
  # was rescheduled for next week, but when Dr. Goodparts
  # removed the appointment model from the collection, it wasn't
  # removed from the DOM.  You can imagine Dr. Goodparts reaction.
  #
  # Fix this bug by using a custom event `hide` on `Appointment` models.
  #
  # Update your `AppointmentList` collection to trigger the `hide`
  # event on a model when it is removed.
  #
  # Update your `AppointmentView` to call the `remove` function whenever
  # it's model fires the `hide` event.
  #
  # Initial Code
  # appointmentList.js
  `
  var AppointmentList = Backbone.Collection.extend({
    initialize: function(){
      
    }
  });
  `
  # appointmentView.js
  `
  var AppointmentView = Backbone.View.extend({
    initialize: function(){

    },
    remove: function(){
      this.$el.remove();
    }
  });
  `


  # Answer:
  # appointmentList.js
  `
  var AppointmentList = Backbone.Collection.extend({
    initialize: function(){
      this.on('remove', this.hideModel);
    },
    hideModel: function(model){
      model.trigger('hide');
    }
  });
  `
  # appointmentView.js
  `
  var AppointmentView = Backbone.View.extend({
    initialize: function(){
      this.model.on('hide', this.remove, this);
    },
    remove: function(){
      this.$el.remove();
    }
  });
  `

  # need this or coffeescript will produce a js syntax error
  this


