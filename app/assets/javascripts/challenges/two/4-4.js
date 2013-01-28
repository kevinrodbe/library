app.createChallenge('4-4', function(){
   // Event Options
  
   // Instructions:
   //
   /* 
      As you can see in the view code below, whenever the model's `title`
      attribute changes, we update the title in the view and highlight it
      to let the user know that it's been updated.  Sometimes we want to be
      able to change the title without highlighting the view, but with still updating 
      it in the view.   

      To accomplish this, we are passing in `{highlight: false}`.  Update the `changedTitle`
      function below to use this extra option to selectively highlight the view.
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
     changedTitle: function(model, value){
       this.$('span').html(value);
       this.$el.effect('highlight', {}, 1000);
     }
   });
  

  // Answer:
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
  
});