app.createChallenge('4-5', function(){
   // listenTo
  
   // Instructions:
   //
   /* 
    Use the new `listenTo` View function to make the view listen to 
    the model's `'change:title'` event, instead of having the model notify
    the view of the event.  This way we can safely call `remove()` on the view
    and feel confident all of our events are cleaned up.      
   */
  
   // Initial Code:
   var AppointmentView = Backbone.View.extend({
    template: _.template("<span><%= title %></span>"),
    initialize: function(){
      this.model.on('change:title', 'changedTitle', this);
    }
    render: function(){
      this.$el.html(this.template(this.model.attributes));
    },
    changedTitle: function(model, value, options){
      this.$('span').html(value);

      if (options.highlight !== false){
        this.$el.effect('highlight', {}, 1000); 
      }
    }
  });
  

  // Answer:
  var AppointmentView = Backbone.View.extend({
     template: _.template("<span><%= title %></span>"),
     initialize: function(){
       this.listenTo(this.model, 'change:title', 'changedTitle');
     }
     render: function(){
       this.$el.html(this.template(this.model.attributes));
     },
     changedTitle: function(model, value, options){
       this.$('span').html(value);

       if (options.highlight !== false){
         this.$el.effect('highlight', {}, 1000); 
       }
     }
   });
  
});