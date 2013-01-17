app.createChallenge '7-2', ->

  # Show route
  #
  # Instructions:
  # 
  # Great, but our AppRouter doesn't actually do anything yet, so
  # let's add a route.
  #
  # Create a route that will match `appointments/:id` and call
  # the show action, which we've already started to implement below.
  #
  # Initial Code
  `var AppRouter = Backbone.Router.extend({
  
    show: function(id){
      console.log("heyo we're in show with id %d", id); 
    }
  });`

  # Answer:
  `
  var AppRouter = Backbone.Router.extend({
    routes: { "appointments/:id": "show" },
    show: function(id){
      console.log("heyo we're in show with id %d", id); 
    }
  });
  `

  # need this or coffeescript will produce a js syntax error
  this


