app.createChallenge('1-6', function(){
   // Custom toJSON
  
   // instructions:
  
   // Dr. Goodparts is not happy.  He just tried to create a new Appointment
   // and it crashed the server because the JSON sent up to represent the Appointment
   // was in the wrong format. Update toJSON below to return the JSON the server expects.
   // (Make sure you don't modify the attributes)

   // `{ "appointment": { "title": "Ms. Kitty Hairball Treatment", "cankelled": false, "identifer": 1 }`

  // Initial code
  var Appointment = Backbone.Model.extend({
    toJSON: function(){
      return _.clone(this.attributes);
    }
  });

  // Answer:
  var Appointment = Backbone.Model.extend({
    toJSON: function(){
      var attributes = _.clone(this.attributes);
      attributes.cankelled = attributes.cancelled;
      delete attributes.cancelled;
      return { appointment: attributes };
    }
  });

  // Wrong Answer (because they modify attributes)
  var Appointment = Backbone.Model.extend({
    toJSON: function(){
      var attributes = this.attributes;
      attributes.cankelled = attributes.cancelled;
      delete attributes.cancelled;
      return { appointment: attributes };
    }
  });
});