// ### Level 3 - Views

// #### View Conventions
//
// When implementing views, there are several conventions that you should be
// aware of and use when possible.  This will make it easier for others to read
// and use your code and vice versa.
//
// Firstly, there are several options you can pass to a view that will be
// attached to the instance during construction.  Among these are the `model`
// and `collection` options.  These should be instances of `Backbone.Model` and
// `Backbone.Collection`.  This makes it exceedingly easy to read read and
// understand its meaning.
var todoView = new TodoView({
  model: todoItem
});

var todoList = new TodoList({
  collection: todoItems
});

// Another Backbone convention is that the `render` method should return the
// view instance.  This allows for nicely chainable code and is generally
// expected.
var TodoView = Backbone.View.extend({
  render: function() {
    this.$el.html(this.template());
    return this;
  }
});

// Backbone templates are another area of convention.  It is generally assumed
// that the `template` property will be a function that takes one argument
// containing the view options.  What options are passed is up to you.  An often
// used pattern is to pass the model attributes to the template.
var TodoView = Backbone.View.extend({
  template: _.template('...'),
  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});

// #### Escaping
//
// When writing content for the web, it's important to be aware of security
// exploits involving html escaping and how to solve them.  One such solution
// is to escape arbitrary user content via `_.escape` and  Backbone provides
// two shortcuts for doing so.
//
// Backbone models include an `escape` function that will return a particular
// attribute in its escaped form.
var TodoView = Backbone.View.extend({
  template: _.template('<%= model.escape("description") %>')
});

// Underscore templates also provide a shortcut for this operation.  By using
// the escape delimeter (`<%- %>`) instead of the default delimeter (`<%= %>`)
// you can ensure that the content is escaped.  Be careful not to use both at
// once as that can cause unwanted results.  Both methods do the same thing so
// you can use whichever one feels more natural.
var TodoView = Backbone.View.extend({
  template: _.template('<%- model.get("description") %>')
});

// #### Custom Options
//
// An often overlooked feature of Backbone is the use of custom options.  Most
// Backbone methods ensure that the values you pass in the options hash will be
// accessible later from event handlers and callbacks.  For instance, you may
// want to display change notifications when data comes from the server, but
// not when it comes from a user action.  This is easily accomplished by
// passing a custom option and checking for it in your event handler.
//
// For example, the following view listens for changes to the description
// attribute and highlights the element when it changes to notify the user.
var TodoView = Backbone.View.extend({

  template: _.template('...'),

  events: {
    'change input': function(e) {
      model.set({description: e.target.value});
    }
  },

  initialize: function() {
    this.model.on('change:description', this.change, this);
  },

  onChangeDescription: function(model, value) {
    this.$('input').val(value);
    this.highlight();
  }

});

// When the change is a result of updating data from the server, this is
// desirable.  However, if the user made the change by typing into the input
// they don't need to be alerted of the action.  By providing a custom option,
// we can prevent the highlighting.
var TodoView = Backbone.View.extend({

  template: _.template('...'),

  events: {
    'change input': function(e) {
      model.set({description: e.target.value}, {highlight: false});
    }
  },

  initialize: function() {
    this.model.on('change:description', this.change, this);
  },

  onChangeDescription: function(model, value, options) {
    this.$('input').val(value);
    if (options.highlight !== false) this.highlight();
  }

});


// #### View Removal
//
// When removing a view from the DOM but holding a reference to its model or
// collection, later changes can cause unwanted latent effects.  This can be
// prevented by cleaning up event handlers on models and collections when
// removing a view.
var TodoView = Backbone.View.extend({

  initialize: function() {
    this.model.on('sync', this.showMessage, this);
  },

  remove: function() {
    Backbone.View.prototype.remove.apply(this, arguments);
    this.model.off(null, null, this);
  }

});

// In Backbone 0.9.9, two new methods were introduced to help with this
// pattern: `listenTo` and `stopListening`.  `listenTo` works like an inverted
// version on `on`, taking an object to listen to and assuming `this` as the
// context.  `stopListening` removes these listeners and is called during view
// removal.  The view above can be rewritten to use `listenTo` as follows.
var TodoView = Backbone.View.extend({

  initialize: function() {
    this.listenTo(this.model, 'sync', this.showMessage);
  }

});
