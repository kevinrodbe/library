// ### Level 5 - App

// A full size application will likely contain many views, most of which are
// nested within one another.  There are several valid organizational
// strategies but one of the most successful is to have a single "App" object
// that coordinates between the different portions of the application.
//
// One way to go about this is to use a plain javascript object.  This is both
// simple and effective at creating structure.
var App = {
  router: new Router(),
  user: new User(),
  ...
};

// Another handy way to go about it is to use a Backbone view as an App object.
// This provides several benefits that I'll describe below.

var App = new (Backbone.View.extend({
  ...
}))({el: document.body})
var app = new App({el: document.body});

// #### Page Events
//
// By using a view as your "App" object, you can easily handle page events.
// For instance, you may need to handle click events in order to use pushState
// transitions on certain urls.
var App = Backbone.View.extend({

  events: {
    'click a': function(e) {
      Backbone.history.navigate(e.target.pathname);
    }
  }

});
var app = new App({el: document.body});

// #### Routers and History
//
// An App view is also a great way to encapsulate common functionality.  For
// instance, most pages need to set the root path and start Backbone.history.
// You may also want to hand of any bootstrap data to your App view.
var App = Backbone.View.extend({
  // ...
  root: '/',
  start: function(bootstrap) {
    this.user = bootstrap.user;
    Backbone.history.start({
      pushState: true,
      root: this.root
    });
  }
});

// You may also want to give your router access to the App view.  This means
// the router can more easily orchestrate adding and removing content when
// specific routes are triggered.
var Router = Backbone.Router.extend({
  initialize: function(options) {
    this.app = options.app;
  },
  routes: {
    '': 'index',
    'about': 'about'
  },

  index: function() {
    this.app.$el.empty().append(new IndexView().render().el);
  },

  about: function() {
    this.app.$el.empty().append(new AboutView().render().el);
  }
});
