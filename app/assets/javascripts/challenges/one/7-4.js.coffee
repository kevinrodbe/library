app.createChallenge '7-4', ->

  # Navigating
  #
  # Instructions:
  # 
  # Let's test it out and make sure everything is working.
  #
  # We've gone ahead and created an instance of our AppRouter below.
  # Use the `navigate` function to go to `appointments/1` and
  # make sure you trigger the route when you do.
  #
  # Initial Code
  `var router = new AppRouter();`

  # Answer:
  `var router = new AppRouter();
   router.navigate("appointments/1", {trigger: true});`

  # need this or coffeescript will produce a js syntax error
  this


