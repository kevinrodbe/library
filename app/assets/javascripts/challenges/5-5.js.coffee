app.createChallenge '5-5', ->

  # Fetch silently
  #
  # Instructions:
  #
  # Wouldn't ya know, our users don't like getting alerts every
  # time we fetch new data for our collection.
  #
  # Update the fetch call below to not fire the reset event.
  #
  # Initial Code:
  `
  appointments.fetch();
  `

  # Answer:
  `
  appointments.fetch({silent: true});
  `

  # need this or coffeescript will produce a js syntax error
  this







