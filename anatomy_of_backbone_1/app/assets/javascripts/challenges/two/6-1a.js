app.createChallenge('6-1a', function(){
  // Using the App Object

  // Instructions:
  /*
    Now that we have our new top-level object,
    change our class definitions below to use it. Make sure
    you clean up the names of the views by removing `View` since it's not needed
    anymore. Assign the `AppRouter` right on the `AppointmentApp` object.
  */

  // Setup:
  var AppointmentApp = {
    Collections: {},
    Models: {},
    Views: {}
  }

  // Initial Code:
  var Appointment = Backbone.Model.extend({});
  var Appointments = Backbone.Collection.extend({});
  var AppointmentView = Backbone.View.extend({});
  var AppointmentsView = Backbone.View.extend({});
  var AppRouter = new (Backbone.Router.extend({}))();

  // Answer:
  AppointmentApp.Models.Appointment = Backbone.Model.extend({});
  AppointmentApp.Collections.Appointments = Backbone.Collection.extend({});
  AppointmentApp.Views.Appointment = Backbone.View.extend({});
  AppointmentApp.Views.Appointments = Backbone.View.extend({});
  AppointmentApp.AppRouter = new (Backbone.Router.extend({}))();
});