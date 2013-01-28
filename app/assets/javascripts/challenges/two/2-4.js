app.createChallenge('2-4', function(){
   // Fetching with Params II
  
   // Instructions:
  
   // We can limit the number of appointments returned 
   // by passing in a limit parameter also. Go ahead and 
   // construct the fetch call below to create a URL
   // that looks like `/appointments?since=2013-01-01&limit=10`

  // Initial code
  var appointments = new Appointments();
  appointments.fetch({data: {since: "2013-01-01"}});

  // Possible Answers:
  var appointments = new Appointments();
  appointments.fetch({data: {since: "2013-01-01", limit: 10}});
});