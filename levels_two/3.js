// ### Level 3 - Routers

// #### Optional Routes
//
// In real applications, it's common to have several very similar routes that
// are all handled similarly.  In these cases, it's convenient to provide an
// optional route parameter.
//
// The following includes an optional page number at the end of the url.
var TodoRouter = Backbone.Router.extend({

  routes: {
    'search/:query': 'search',
    'search/:query/p:page': 'search'
  },

  search: function(query, page) {
    page = page || 0;
    // ...
  }

});

// Instead, we can rewrite this with an optional parameter.
var TodoRouter = Backbone.Router.extend({

  routes: {
    'search/:query(/p:page)': 'search'
  }

});


// #### Regexes
//
// If you need a greater degree of control, you can also specify routes via
// regular expression.  However, you'll need to use `Router#route` instead of
// the `routes` object.  Each capture group corresponds to one route parameter,
// so be careful to use non-capturing groups when necessary.  For instance, you
// may need to restrict a parameter to numeric input.
//
// The following router will work, but accepts any type of parameter as an id.
var TodoRouter = Backbone.Router.extend({

  routes: {
    'todo/:id': 'todo'
  },

  todo: function(id) {
    // ...
  }

});

// We can rewrite the router to accept only integer values by using a regular
// expression in a call to `Router#route`.
var TodoRouter = Backbone.Router.extend({

  initialize: function() {
    this.route(/todo\/(\d+)/, 'todo');
  },

  todo: function(id) {
    // ...
  }

});

// If you need more than one parameter, just add multiple capture groups to
// your regular expression.
var TodoRouter = Backbone.Router.extend({

  initialize: function() {
    this.route(/todo\/(\d+)\/(.*)/, 'todo');
  },

  todo: function(id, section) {
    // ...
  }

});


// #### Catch-all Routes
//
// It's often the case that you would like to provide a catch-all route to
// provide a user friendly message when a user accidentally lands on a fragment
// that has no content.  There won't be an error thrown if there is no match,
// but no action will be taken either.
//
// To implement this, just use a splat parameter in an otherwise empty route.
var TodoRouter = Backbone.Router.extend({

  routes: {
    '*path': 'notFound'
  },

  notFound: function(path) {
    alert('Sorry!  There is no content here.');
  }

});
