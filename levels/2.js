// ### Level 2 - Models
//
// As we saw in the last section, Model's are were
// data is stored for your Backbone app.  Let's review
// what we've learned so far.

// Creating a Model class
var TodoItem = Backbone.Model.extend({});

// Creating a model instance
var todoItem = new TodoItem({description: 'Pick up milk.'});

// Getting an attribute value:
todoItem.get('description') // 'Pick up milk.'

// Setting an attribute value:
todoItem.set({description: 'Pick up milk and cookies.'})
todoItem.get('description') // 'Pick up milk and cookies.'

// #### Interacting with the server

// But if you remember back to our original jQuery code, we didn't
// know what the data for the model was going to be ahead of time, but
// instead it was loaded from a JSON Ajax call to a server.
//
// Well, all Backbone models are backed by a server, and models know
// how to do the Ajax requests necessary to get their data.  For this, Backbone
// provides model's with the `fetch` method.

// Create a new `TodoItem` instance without setting any attributes
var todoItem = new TodoItem();
// Oops, this code will throw an error:
//
// `Error: A "url" property or function must be specified`
todoItem.fetch();


// We need to tell backbone the url for the Ajax request.  We can do so by 
// setting the url on our `todoItem` instance
todoItem.url = '/todo';
// Now this will hit the `/todo` endpoint and populate the `todoItem` with the JSON data
todoItem.fetch();
todoItem.get('description') // 'Pick up milk.'

// But something is wrong here, isn't it?  In a RESTful Rails application, 
// wouldn't we get the `todoItem's` JSON using it's id? So instead of making
// a request to `/todo` for a `todoItem` with `id=1`, we'd make a request to 
// `/todos/1`. 

// To do this is Backbone, first you have to tell the model what the `urlRoot`
// is (the part of the url before the `id`):
var TodoItem = Backbone.Model.extend({urlRoot: '/todos'});

// Now, when we create the `todoItem` object, we tell it what `id` to use
var todoItem = new TodoItem({id: 1})

// When calling `fetch()` now, Backbone will make a request to `/todos/1`
todoItem.fetch() // getJSON('/todos/1')

// Backbone also makes it easy to change a model object and save those changes to the server
// using the `save()` function.  Let's say our Todo app lets the user update 
// the description of the todo, and we want to save that update so when they use the app
// later, their change will still be around.

// First, we change the description on the `todoItem` using `set`
todoItem.set({description: 'Pick up milk and cookies.'});

// And when we want to save those change, we just call `save()`
todoItem.save()

// Since `todoItem` already has an `id`, Backbone will make a `PUT` request (`/todos/1`) to the server,
// which in a RESTful Rails application means it will call the `update` 
// action in your controller, passing all the `todoItem's` attributes in the params


// If we create a brand new `TodoItem` and want it to be created on the server,
// we still just call `save()`, but instead of Backbone making a `PUT` request `/todos/`,
// it will do a `POST` to `/todos`.  This maps nicely to the way a RESTful Rails application
// already works (sensing a theme yet?).

// Create a brand new `TodoItem`
var newTodoItem = new TodoItem();

// Set some attributes
newTodoItem.set({description: 'Fill prescription.'});

// Save it to the server
newTodoItem.save() // POST /todos

// What if we want to create a new TodoItem and have it prepopulated with some
// default values?  

// When defining the model, pass in a `defaults` object
var TodoItem = Backbone.Model.extend({
  defaults: {
    description: 'Empty todo...',
    status: 'incomplete'
  }
});

// Now when creating a new TodoItem object, it's description and status will already be set:
var todoItem = new TodoItem();
todoItem.get('description') // 'Empty todo...'
todoItem.get('status') // 'incomplete'

// ### Events
// 
// In Backbone, events play a big role in how applications are tied together.
// For example, Views listen to changes in the Model and update the DOM based on those
// changes.  We'll get into that more next level, but for now I want to show you
// how you can listen to events on the model and trigger a function whenever 
// those events are fired.

// To listen to an event, you use the `on` function 
// (much like [jQuery's on](http://api.jquery.com/on/))
todoItem.on('event-name', function(){});

// So now, whenever the `event-name` event is fired, the passed in `function`
// will be called.

// Model object's fire many different event types, `change` being one of the most common
todoItem.on('change', function(){
  alert('todoItem has changed');
});

// So now, whenever you change an attribute on `todoItem`, this event will fire
todoItem.set({description: 'Changing my todo...'}); // alerts 'todoItem has changed'

// If you want to change an attribute on `todoItem` without a `change` event firing, you
// can pass the `silent: true` option to `set`:
todoItem.set({
  description: 'Changing my todo again...'
}, {silent: true}); // no alerts

// Model objects also fire change events for individual attributes,
// so instead of listening to all changes, you can focus on one attribute:
todoitem.on('change:status', function(){
  alert('todoItem status has changed');
});

// We will see the full power of events when we use both models and views together
// in a later chapter.

// ### toJSON()
//
// Sometimes in Backbone you'll want easier access to all a Model instance's
// attributes without having to call `model.get()` each time.

// Calling `.toJSON` on a model instance will return an object with it's attributes
var attributes = todoItem.toJSON();
console.log(attributes.description); // 'Pick up milk.'
console.log(attributes.status); // 'incomplete'

// We'll be using `toJSON()` later on in the course in Views template rendering.

