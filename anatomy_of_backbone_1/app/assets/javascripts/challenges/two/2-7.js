app.createChallenge('2-7', function(){
   // Building View Next III
  
   // Instructions:
  
   // Now that we are rendering the link, we need to implement
   // the route to handle `appointments/p:page/pp:per_page` and
   // have the route function fetch the new appointments based on the 
   // parameters.

   // Setup code:
   

  // Initial code
  var AppRouter = new (Backbone.Router.extend({
    routes: { 
      "": "index" 
    },
    initialize: function(options){
      this.appointmentList = new AppointmentList();
    },
    index: function(){
      var appointmentsView = new AppointmentListView({collection: this.appointmentList});
      appointmentsView.render();
      $('#app').html(appointmentsView.el);
      this.appointmentList.fetch();
    },
  }));

  // Answers:
  var AppRouter = new (Backbone.Router.extend({
    routes: { 
      "appointments/p:page/pp:per_page": "page",
      "": "index" 
    },
    page: function(page, per_page){
      this.appointmentList.fetch({data: {page: page, per_page: per_page}});
    },
    initialize: function(options){
      this.appointmentList = new AppointmentList();
    },
    index: function(){
      var appointmentsView = new AppointmentListView({collection: this.appointmentList});
      appointmentsView.render();
      $('#app').html(appointmentsView.el);
      this.appointmentList.fetch();
    },
  }));
});