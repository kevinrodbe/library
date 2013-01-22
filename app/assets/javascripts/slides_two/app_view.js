createSlide('app-view', function(){
  
  // $('a[data-handle]').click(function(e){
  //   e.preventDefault();
  //   Backbone.history.navigate(e.target.pathname, {trigger: true});    
  // });

  window.App = new (Backbone.View.extend({
    Models: {},
    Collections: {},
    Views: {},
    events: {
      'click a[data-handle]': function(e){
        e.preventDefault();
        Backbone.history.navigate(e.target.pathname, {trigger: true});
      }
    },

    start: function(bootstrap){
      Backbone.history.start({pushState: true});
    }
  }))({el: document.body});

  App.Router = new (Backbone.Router.extend({
    routes: {
      '': 'index',
      'completed': 'completed',
      '*path': 'notFound'
    },

    index: function(){
    },

    completed: function(){
      console.log("Show only completed")
    },

    notFound: function(){
      alert("Route not found");
    }
  }))();

  if (location.pathname !== "/support"){
    App.start();
  }
});