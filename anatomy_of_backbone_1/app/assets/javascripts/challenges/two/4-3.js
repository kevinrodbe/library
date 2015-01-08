app.createChallenge('4-3', function(){
   // Escaping Content
  
   // Instructions:
   //
   /* 
   Dr. Goodparts recently hired an intern to input appointments
   and they've been injecting appointments with malicious titles
   to hack Dr. Goodparts' computer. 
   
   The intern was fired but you should probably update the `AppointmentView`
   to escape the title content.
   */
  
   // Initial Code:
   var AppointmentView = Backbone.View.extend({
     template: _.template("<span><%= title %></span>"),
     render: function(){
       this.$el.html(this.template(this.model.attributes));
     }
   });
  

  // Answer:
  var AppointmentView = Backbone.View.extend({
    template: _.template("<span><%= model.escape('title') %></span>"),
    render: function(){
      this.$el.html(this.template({model: this.model));
    }
  });
  
});