// ### Level 7 - Router and History
//
// So far our Todo application has been conspicously 
// free of links.  But this is a *web* application, so
// we can't completely skirt around the issue, can we?
//
// For example, let's say we want a link next to each
// todo item that takes us to a page that contains
// only that single todo item.
//
// Before, we'd build this functionality by creating a
// link with an `href` of something like `/todos/1`
// where `1` is the `id` of the `TodoItem`.  When clicked,
// our browser would make a request to our server, and
// our server would respond with a whole big block of HTML.
//
// If we wanted to save some request/response time, we
// might convert that link into an Ajax request, and the server
// would only have to respond with a little bit of data
// about that one todo.  We'd also only update just a subset
// of the DOM, instead of refreshing the entire thing. This made
// our web apps a lot more snappy, and things were good.
//
// Until they hit the back button, then everything was bad.  Instead of
// user returning to the list of todos, they'd go all the way back to
// the previous site. *Let's see this in action*
//
// **show the screencast of the broken back button**
//
// The Router and History are the tools Backbone provides
// to solve this problem.
//
// The Router is where you define your application's URLs and
// map them to actions (much like the Rails router).
//
// `Backbone.History` will make sure your browser history is
// updated when you navigate to application URLs.
//
// We'll see how these two pieces work together by building the functionality
// we described in the first paragraph for our budding Todo App.

// ### Creating a Router class.
//
// Backbone applications can have more than 1 router, but for our example app
// we are only going to need one.

// Create a new Router class by extending `Backbone.Router`
var TodoRouter = Backbone.Router.extend({});

// At this point, our router doesn't really do anything.  Let's change
// that by defining our first `route`.
var TodoRouter = Backbone.Router.extend({
  routes: {
    "todos/:id": "show"
  }
});

// Let's take a closer look at what that `"todos/:id": "show"` means.
//
// The left side of the route (`"todos/:id"`) defines
// the URL to match.  Note that URLs omit the leading `/`.  The `:id`
// section of the URL will match anything after the slash (unless it's another slash).
//
// So, for example, these URLs will match our route:
//
// * `todos/1`
// * `todos/2`
// * `todos/hello`
// * `todos/1-hello`
//
// But these won't:
//
// * `todos/`
// * `todos/1/items`

// The right side of the route (`"show"`) is the name of the function
// that will be called when the route is matched.  Let's define `show`.
var TodoRouter = Backbone.Router.extend({
  routes: {
    "todos/:id": "show"
  },

  // `show` is passed an argument that will 
  // be the value of the `:id` section matched in the url
  show: function(id){
    console.log("in show with id " + id + " ...");
  }
});

// Our Router won't actually match any routes yet, we need to Instantiate it first
var TodoApp = new TodoRouter();

// We can test out our route by calling `TodoApp.navigate` which will
// update the browsers URL and trigger the route.
TodoApp.navigate("todos/1", {
  // pass `trigger` as true to trigger the route
  trigger: true
});

// **Show screencast of the browser URL not updating**

// Oops, something went wrong, our browser's URL didn't change
// and our route wasn't triggered. 
//
// ### Backbone History
//
// Turns out there is one more step to perform, and that is
// activating `Backbone.history`.  
//
// Before we dive into the *how* of `history`, let's first
// take a look at the *why*.  
//
// Before a little over a year ago, to handle this history-preserving,
// back-button-fixing problem in the browser, developers made use of the
// hashmark `#` in URLs.  They could change the URL from `gmail.com/m`
// to `gmail.com/m#search` in javascript and change the page with Ajax,
// and then when the user hit the back button, the browser would return to
// `gmail.com/m`.
//
// It was a hack, and developers had to discover and implement that hack
// in many different ways, and not all of them compatible across browsers.
//
// HTML5 set out to solve this problem with new 
// [history](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history#Adding_and_modifying_history_entries)
// APIs, specifically the `pushState` method, which allows
// developers to update the browser URL and the browser history, without
// the user of hashmarks.  So instead of a URL like `gmail.com/m#search`
// it could instead be `gmail.com/m/search`.
//
// Unfortunately, [browser support](http://caniuse.com/history) 
// for the HTML5 history API is still not great (looking at you IE).
//
// `Backbone.history` takes care of all of these messy issues for us and
// will work across browsers.  After we've instantiated all of our Routers 
// (which we did above) all we have to do is start `Backbone.history`

// Only call this once
Backbone.history.start();

// If you only need to support modern browsers and want `history` to
// use the new HTML5 `pushState` api, start the `history` like this
Backbone.history.start({pushState: true});


// Now, when we `navigate` to `todos/1`, the URL changes and our route
// is triggered.
TodoApp.navigate("todos/1", {trigger: true});

// **Show screencast with working router and history**
//
// #### Implementing Show
//
// Now that we have our router working, let's implement the show action, which
// should show the one `TodoItem` specified by the URL.
//
// To help with this action we've gone ahead and implemented
// a method on the `TodoItems` collection called `focusOnTodoItem`
// which looks like this:

// The `TodoItems` collection class:
var TodoItems = Backbone.Collection.extend({
  focusOnTodoItem: function(id) {
    // Find all models in the collection without the `id`
    // passed in.
    var modelsToRemove = this.filter(function(todoItem){
      return todoItem.id != id;
    });

    // remove all models except for the one matching `id`
    this.remove(modelsToRemove);
  }
});

// Remember that whenever we remove a model from our
// collection, the `TodosView` automatically updates.  

// The next step is to call `focusOnTodoItem` from inside our
// `show` action.

// Let's pass in our `todoItems` collection when we create our router:
var TodoApp = new TodoRouter({todoItems: todoItems});

// Then we can define an `initialize` function on our Router class and
// set the `todoItems` property on the Router instance:
var TodoRouter = Backbone.Router.extend({
  routes: {
    "todos/:id": "show"
  },

  // anything passed in when doing `new TodoRouter`
  // will be passed in here as `options`
  initialize: function(options){
    this.todoItems = options.todoItems;
  },

  // Now we can access our `todoItems` collection
  // using `this.todoItems`
  show: function(id){
    this.todoItems.focusOnTodoItem(id);
  }
});

// Now, when we navigate to `todos/1`, all other
// todoItems will be removed from the DOM:
TodoApp.navigate("todos/1", {trigger: true});

// **Go back to screencast to show this working**
