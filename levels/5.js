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

