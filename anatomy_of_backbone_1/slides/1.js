// ## Level 1
//
// ### Slide 1
//
// Introduce the todoapp
// 
// ### Slide 2
//
// Let's say we have an ajax request that
// get's JSON from the server of all the todos
// (show JSON) and builds the DOM.  
//
// Show inserting our data into the DOM
//
// ### Slide 3
//
// What happens when we want to increase the complexity
// of this application. 
// 
// We've lost our data to the DOM, so any time we 
// want to work with it, we'll have to access the DOM
// (which is slow)
//
// ### Slide 4
//
// This is where backbone comes in.  Backbone
// was created by Jeremy Ashkenas (of coffeescript fame)
// to deal with this exact problem.  
//
// "I think that the most important thing about Backbone 
// (or any client-side MVC-ish library), also isn't something 
// that's well understood by beginners: Get your truth out of the DOM. 
// Even if you don't use a library, but simply structure your JavaScript 
// in a way that removes "state" from HTML nodes, and puts it in rich, 
// reusable model objects, you're off to a great start." - Jeremy Ashkenas
//
// ### Slide 5
//
// In Backbone, the data is represented by the model. Model's are
// things like User, Post, TodoItem, etc.
//
// Model objects have attributes that are just key/value pairs like 
// our JSON above.
//
// Here we are creating a Model named TodoItem, and then
// using that Model to create a model instance with the
// data of our application.  You can imagine us having many
// of these todoItems in our application, all with corresponding
// description's and status's
var TodoItem = Backbone.Model.extend({});
var todoItem = new TodoItem({description: 'Pick up milk', status: 'incomplete'});
