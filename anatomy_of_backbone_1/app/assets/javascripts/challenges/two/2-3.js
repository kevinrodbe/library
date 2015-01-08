app.createChallenge('2-3', function(){
   // Fetching with Params
  
   // Instructions:
  
   // The server team has implemented a feature for limiting the appointments
   // pulled down based on the appointment date. In the code below, 
   // update the fetch call to pass an extra param so that the URL
   // is like: `/appointments?since=2013-01-01`

  // Initial code
  var appointments = new Appointments();
  appointments.fetch();

  // Possible Answers:
  var appointments = new Appointments();
  appointments.fetch({data: {since: "2013-01-01"}});
});