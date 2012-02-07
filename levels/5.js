// ### Collections
//
// So far we've only ever had to deal with 1 model instance
// at a time, but in any sufficiently complex application,
// you are going to start having a `Collection` of models that you'll
// need to manage.
//
// In our Todo app example so far, we've put off handling more than
// 1 todo at a time to try and keep it simple.  But our users are getting
// restless and have taken to twitter and started the #morethanonetodo
// hashtag so, unless we want to start losing users, we have to support
// multiple todos.
//
// Backbone provides the Collection class, which is on the same level of 
// View and Model, to handle this exact problem.  Collections are just an
// ordered set of model instances that all belong to the same model class.
//
//
// So in our Todos app, we have already defined a model for a `TodoItem`
var TodoItem = Backbone.Model.extend({});

// To define a Collection class that manages a set of `TodoItem's`, all
// we have to do is extend from `Backbone.Collection` and declare
// the collection's corresponding model class, like this:
var TodoItems = Backbone.Collection.extend({
  model: TodoItem
});

// **Note:**
//
//      Notice we named the collection class TodoItems.  It's
//      only a convention to name the collection class the plural
//      of the model it represents.  You could just as easily
//      name it something like Todos or TodoCollection. 

// Now we can create a collection instance like so
var todoItems = new TodoItems();

// You can access the array of model instances in the collection by
// calling `todoItems.models` but most of the time you won't need access
// directly to the `models` array.  Instead, you interact with the `models`
// using the functions the collection exposes.

// For example, you can add a model instance to the collection using `add`
console.log(todoItems.length) // 0
var todoItem = new TodoItem();
todoItems.add(todoItem);
console.log(todoItems.length) // 1

// You can also remove a model instance using the `remove` function
todoItems.remove(todoItem);
console.log(todoItems.length) // 0

// You can retrieve a single model instance from the collection
// a couple of ways.

// Pass the index of the model you want to retrieve with `at`
todoItems.at(0) // is todoItem

// Pass in the id of the model instance to `get`
console.log(todoItem.id) // 1
todoItems.get(1) // is todoItem

// #### Bulk Populating
//
// There are two easy ways `Backbone.Collections` give you to
// populate a collection instance with many model instances.
//
// The first one is `reset`.  `reset` expects an array of JSON objects, 
// with each JSON object use to create a single model instance.

// Using `reset` to populate `todoItems` with 3 `TodoItem` instances
var todos = [
  {description: 'Pick up milk.', status: 'incomplete'},
  {description: 'Get a car wash', status: 'incomplete'},
  {description: 'Learn Backbone', status: 'incomplete'}
]

todoItems.reset(todos);
console.log(todoItems.length) // 3


// #### Interacting with the server
//
// You can also seed data into a collection through an Ajax
// request, exactly like we did with just a single model.

// Returning to our opening example from Level 1 when we made a
// `getJSON` request to the `/todos` url.
$.getJSON('/todos', function(data) {

// When calling `fetch` on a collection instance, Backbone will make
// an Ajax request in the background.
todoItems.fetch(); // Error: A "url" property or function must be specified

// And just like models, we need to tell the collection class
// what URL to use when fetching from the server:
var TodoItems = Backbone.Collection.extend({
  url: '/todos'
});

// Now when calling `fetch` Backbone will do a `getJSON` request
// to `/todos`, expecting it to respond with a JSON array of todo
// objects, just like the `reset` method.

 
todoItems.fetch() // response: [{description: 'Pick up milk.', status: 'incomplete'},{description: 'Get a car wash', status: 'incomplete'},{description: 'Learn Backbone', status: 'incomplete'}]
console.log(todoItems.length); // 3

// #### Collection Events

// Just like you can bind to events on a model instance, you can 
// bind to events on a collection.
//
// For example, if you listen to the `reset` event on a collection instance,
// you will be notified anytime the collection is reset using either `reset()`
// or `fetch()`

// Listen to the `reset` event and alert the user
todoItems.on('reset', function(){
  alert('Reset all the models on todoItems');
});

todoItems.fetch() // alerts 'Reset all the models on todoItems'
todoItems.reset() // alerts 'Reset all the models on todoItems'

// You can also listen for whenever a model instance is added or removed to 
// the collection using the `add` and `remove` events:

// Listen for the `add` event
todoItems.on('add', function(){
  alert('Added a model instance');
});

// Listen for the `remove` event
todoItems.on('remove', function(){
  alert('Removed a model instance');
});

var todoItem = new TodoItem();

todoItems.add(todoItem); // alerts 'Added a model instance'
todoItems.remove(todoItem); // alerts 'Removed a model instance'

// The function attached to these listeners will be called
// with the model instance as an argument.  So when you remove
// a model instance from a collection, you can do something with it,
// like destroy it:
todoItems.on('remove', function(todoItem){
  todoItem.destroy();
});


// #### Iteration
//
// Collection instances give you plenty of different iteration functions,
// like `forEach` and `map` to name just two.  There are a total
// of 28 iteration functions, the list of which can be [found here](http://documentcloud.github.com/backbone/#Collection-Underscore-Methods)
//
// We are just going to cover a couple here so you can start
// to get a feel for how they work.

// Let's first setup up our collection instance we are going to be working with
var todoItems = new TodoItems();
var todos = [
  {description: 'Pick up milk.', status: 'incomplete'},
  {description: 'Get a car wash', status: 'complete'},
  {description: 'Learn Backbone', status: 'incomplete'}
]
todoItems.reset(todos);

// `map` will take a single `"iterator"` function as it's argument
// which will be called exactly once per model instance.

// So in this example, the function passed to `map` will be called `3` times
var result = todoItems.map(function(todoItem){
  // the `"iterator"` function will me called once with each `todoItem`
  // in the collection.

  // the return value from this function will be used to construct a new array
  return todoItem.get('description');
});

console.log(result); // ['Pick up milk.', 'Get a car wash', 'Learn Backbone']

// Another common iterator you'll end up using is the `filter` function.  This
// function works similar to `map`.  

// Lets say we want to get an array of the models in the collection that
// have a `status` of `"incomplete"`.
var incompletes = todoItems.filter(function(todoItem){
  // if this function returns `true`, the `todoItem`
  // becomes a part of the returned array
  return todoItem.get('status') == "incomplete";
});

// incompletes is an array containing 2 model instances
console.log(incompletes.length); // 2
console.log(incompletes[0].get('description'); // 'Pick up milk.'
console.log(incompletes[1].get('description'); // 'Learn Backbone'

// Make sure and check out all the other iterator functions at the
// [Backbone docs](http://documentcloud.github.com/backbone/#Collection-Underscore-Methods)

