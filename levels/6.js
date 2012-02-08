// ### Level 6 - Collections and Views
//
// Just like we have model views that are backed by
// a model instance, we can have a collection view that is
// backed by a collection instance.
//
// But unlike model views, collection views won't necessarily generate
// any HTML themselves.  Since collections are just a set of model instances,
// and we already have the views to handle generating the HTML in
// model views, many times a collection view will just delegate the responsibilty
// of rendering HTML to the model views.
//
// That's the type of collection view we will be building in this level.  I like
// to call these collection views "headless" because they don't render any
// of the UI themselves.

// Let's create our first collection view for the collection of `todoItems` we 
// worked with last level
var TodosView = Backbone.View.extend({});

// As you can see, a collection view is just a view.  We named it `TodosView`
// to make it clear that this view would be managing a set of todos, not just one.

// Now when we create an instance of the `TodosView`, instead of passing in a model instance
// like we did in Level 4, we instead pass in the collection instance 
// (in this case `todoitems`)
var todosView = new TodosView({collection: todoItems});

// Let's take our first crack at writing the `render` function of the `TodosView`
// to get a feel for what we have to do.
var TodosView = Backbone.View.extend({
  render: function(){
    // `this.collection` refers to the `todoItems` passed in to the constructor
    this.collection.forEach(function(todoItem){
      // we want to render an individual [TodoView](file://localhost/Users/eric/CodePath/BackboneSlides/docs/4.html#section-26) for
      // each of our model instances in `this.collection`
      var todoView = new TodoView({model: todoItem});

      // render the model view, generating the HTML
      todoView.render();

      // append each `todoView` to the top-level element
      // of this view
      this.$el.append(todoView.el)
    });
  }
});

// There is one problem with the code above.  Did you spot it?
// Remember when we covered [function binding](file://localhost/Users/eric/CodePath/BackboneSlides/docs/4.html#section-25)
// in level 4 we talked about how the value of `this` can change.
//
// In our `render` function above, when we call `this.$el`, the `this` isn't set 
// to the view instance, instead it's the global `window` object. 

// Here is a rewritten `render` that first binds the callback function to the view instance
var TodosView = Backbone.View.extend({
  render: function(){
    // Let's first assign the callback function to a variable:
    var addOne = function(todoItem) {
      var todoView = new TodoView({model: todoItem});
      todoView.render();
      // using _.bind `this` will be the view instance
      this.$el.append(todoView.el)
    }

    // the underscore `_` library provides a 
    // [`bind`](http://documentcloud.github.com/underscore/#bind) function.
    _.bind(addOne, this);

    // now we pass a reference to the `addOne` function to the `forEach` method.
    this.collection.forEach(addOne);
  }
});

// This is a pretty common pattern in Backbone, especially in collection views.

// But now `render` is a little cluttered, so let's clean it up.
var TodosView = Backbone.View.extend({

  // Define an initialize method, which gets called
  // every time a new instance of `TodosView` is created
  initialize: function(){
    // bind the view `this` to the view's `this.addOne` function
    this.addOne = _.bind(this.addOne, this);
  },

  // define `this.addOne` on the view
  addOne: function(todoItem){
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el); 
  },

  render: function(){
    // call the view's `this.addOne` function
    // for each model in the collection
    this.collection.forEach(this.addOne);
  }

});

// So now we are ready to render the collection view and 
// insert it into the DOM
todosView = new TodosView({collection: todoItems});
todosView.render();
$('#app').append(todosView.el);


// #### Collection events
// 
// In the previous example, our collection view
// would only work when we first initialized our app,
// but would not be able to respond to changes in the collection
// such as `reset`, `add`, and `remove`.
//
// Just like we did with our model views, our collection views
// need to update the DOM to reflect an accurate state of 
// the collection, so we will want to listen to each of
// these events and update the DOM accordingly.
//
// Let's make sure that whenever we add a new model instance
// to the collection, it gets added to the DOM.

// Just like we did in [level 4](file://localhost/Users/eric/CodePath/BackboneSlides/docs/4.html#section-23)
// we need to tell our collection to call a function whenever
// something is added to it's collection.  


// Let's get back into that collection view's `initialize` function:
var TodosView = Backbone.View.extend({

  initialize: function(){
    this.addOne = _.bind(this.addOne, this);

    // Since we already have defined a function
    // for adding a single todoItem to the DOM
    // we can just reuse it.
    this.collection.on('add', this.addOne);
  },

  addOne: function(todoItem){
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el); 
  },

  render: function(){
    this.collection.forEach(this.addOne);
  }

});

// Now, even after we render the todosView
todosView = new TodosView({collection: todoItems});
todosView.render();
$('#app').append(todosView.el);


// We can add a model instance to the collection and the
// `todosView` will handle adding it to the DOM
var newTodoItem = new TodoItem({description: 'Take out trash.', status: 'incomplete'});
// **show this happen in a screencast**
todoItems.add(newTodoItem); // automatically gets rendered and added to the DOM


// More likely though then model instances getting added one-at-a-time is to
// use collection bulk populating methods to add many at the same time, like `fetch`
// and `reset`

// Let's also listen to the `reset` change event in our collection view, and 
// whenever it is fired we should add all of the collection's models to the DOM
var TodosView = Backbone.View.extend({
  initialize: function(){
    this.addOne = _.bind(this.addOne, this);
    // We need to add a new method that is called
    // whenever the `reset` event is fired.
    this.addAll = _.bind(this.addAll, this);

    this.collection.on('add', this.addOne);
    // This will call `this.addAll` whenever the collection
    // is fetched or reset
    this.collection.on('reset', this.addAll);
  },

  render: function(){
    // Use `this.addAll` in `render` instead of 
    // repeating the `forEach` call.
    this.addAll()
    return this;
  },

  // All we did was move the code that used to
  // be in `render` to here so it could be called
  // on the `reset` event
  addAll: function(){
    this.collection.forEach(this.addOne);
  },

  addOne: function(todoItem){
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el); 
  }
});

// Now, because of how we've used event binding in
// this view, it's possible to `render` this view
// *before* the collection contains any models. 

// Instantiate an empty collection instance
var todoItems = new TodoItems();

// Instantiate our collection view
var todosView = new TodosView({collection: todoItems});
// Since our collection is empty, this won't actually build any HTML
todosView.render();
// Insert the collection view's top-level element into the DOM
$('#app').append(todosView.el);
// Call `fetch` on the collection.  When finished, the `reset` event
// will fire and the collection view's `addAll` will be called,
// inserting each model into the DOM
todoItems.fetch();

// **show a screencast for this**

// One quick refactor that we should do before concluding this Level
// is in the collection view's `initialize` method.  See how we
// are binding two functions, `this.addAll` and `this.addOne`?  We can
// remove those `bind` calls and add `this` as the third argument to the
// event listener calls.  
//
// Remember in [Level 4](file://localhost/Users/eric/CodePath/BackboneSlides/docs/4.html#section-23)
// we did the same thing when listening to a model's `change` event.

// Let's do it here on the collection's event listeners:
initialize: function(){
  this.collection.on('add', this.addOne, this);
  this.collection.on('reset', this.addAll, this);
}

// Now, our final collection view looks like this:
var TodosView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.addOne, this);
    this.collection.on('reset', this.addAll, this);
  },

  render: function(){
    this.addAll()
    return this;
  },

  addAll: function(){
    this.collection.forEach(this.addOne);
  },

  addOne: function(todoItem){
    var todoView = new TodoView({model: todoItem});
    this.$el.append(todoView.render().el); 
  }
});



