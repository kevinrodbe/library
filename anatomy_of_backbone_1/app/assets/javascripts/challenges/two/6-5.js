app.createChallenge('6-5', function(){
  // Bootstrapping

  // Instructions:
  /*
    Dr. Goodparts wants his appointment app to load faster so the server
    team included some bootstrap data on the page that you can use to bootstrap
    your `Appointments` collection instead of using fetch. Modify the `start` function
    in the `AppointmentApp` to recieve this data as a parameter and pass in the `appointments`
    boostrap dat to the `Appointments()` constructor.
  */

  // Setup:
  var data = {
    appointments: [
      { title: "Tonsel Removal", name: "Eric", date: "2013-05-10", cancelled: false },
      { title: "Molar Extraction", name: "Gregg", date: "2013-02-20", cancelled: true },
      { title: "Cleaning", name: "Casey", date: "2013-02-21", cancelled: false }
    ]
  }

  AppointmentApp.start(data);

  // Initial Code:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {},
    events: {
      'click a[data-backbone]': function(e){
        e.preventDefault();
        Backbone.history.navigate(e.target.pathname, { trigger: true });
      }
    },
    start: function(){
      this.appointments = new AppointmentApp.Collections.Appointments();
      var appointmentsView = new AppointmentApp.Views.Appointments({collection: this.appointments});
      $('#app').html(appointmentsView.render().el);
      this.appoinments.fetch();
    }
  }))({el: document.body});
  

  // Answer:
  var AppointmentApp = new (Backbone.View.extend({
    Collections: {},
    Models: {},
    Views: {},
    events: {
      'click a[data-backbone]': function(e){
        e.preventDefault();
        Backbone.history.navigate(e.target.pathname, { trigger: true });
      }
    },
    start: function(data){
      this.appointments = new AppointmentApp.Collections.Appointments(data.appointments);
      var appointmentsView = new AppointmentApp.Views.Appointments({collection: this.appointments});
      $('#app').html(appointmentsView.render().el);
    }
  }))({el: document.body});
  
});