// ### Level 3 - Routers

// #### Optional Routes
//
// In real applications, it's common to have several very similar routes that
// are all handled similarly.  In these cases, it's convenient to provide an
// optional route parameter.
//
// For instance, you may want to provide a search query and an optional page
// number (defaulting to 0).
var TodoRouter = Backbone.Router.extend({

  routes: {
    'search/:query(/p:page)': 'search'
  },

  search: function(query, page) {
    page = page || 0;
    // ...
  }

});

// #### Regexes
//
// If you need a greater degree of control, you can also specify routes via
// regular expression.  However, you'll need to use `Router#route` instead of
// the `routes` object.  Each capture group corresponds to one route parameter,
// so be careful to use non-capturing groups when necessary.  For instance, you
// may need to restrict a parameter to
// numeric input.
var TodoRouter = Backbone.Router.extend({

  initialize: function() {
    this.route(/todo\/(\d+)/, 'todo');
  },

  todo: function(id) {
  }

});

// #### Catch-all Routes
//
// It's often the case that you would like to provide a catch-all route to
// provide a user friendly message when a user accidentally lands on a fragment
// that has no content.  To implement this, just use a splat parameter in an
// otherwise empty route.
var TodoRouter = Backbone.Router.extend({

  routes: {
    '*path': 'notFound'
  },

  notFound: function(path) {
    alert('Sorry!  There is no content here.');
  }

});
