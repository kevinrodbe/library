app.createChallenge '4-3', ->

  # Sync changes
  #
  # Instructions:
  # 
  # Now we've got the perfect place to syncronize our cancellation
  # to the server.  Update `Appointment's` `cancel` function to save
  # the model after setting it's `cancelled` attribute.
  #
  # Initial Code:
  `var Appointment = Backbone.Model.extend({
    cancel: function(){
      this.set({cancelled: true});
    }
  });`

  # Answer:
  `var Appointment = Backbone.Model.extend({
    cancel: function(){
      this.set({cancelled: true});

      this.save();
    }
  });`

  # Alternate Answer:
  `var Appointment = Backbone.Model.extend({
    cancel: function(){
      this.save({cancelled: true});
    }
  });`

  # need this or coffeescript will produce a js syntax error
  this

