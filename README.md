### Backbone.js

- Models
- Views
- Collections
- Router
- History API
- Integration with Rails
- Persistence
- Namespacing
- Templating
- Underscore.js
- Testing
- Backbone MVC vs Rails MVC

#### Models

- Events
- save
- destroy
- toJSON
- get / set 

#### Views

- render
- template
- custom initialize w/bind
- this.el / setElement / $el
- tagName
- events (delegateEvents)

#### Collections

- Events
- model
- fetch / reset
- underscore methods
- url
- models
- add/remove

#### Router/History

- pushState
- history.start
- routes
- navigate


#### Rails

- Persistence / JSON
- Asset Pipeline, gems
- Organization

### Major Concepts:

- binding and how it controls the flow of data
- events + bindings

### Resources:

- [Backbone Boilerplate](https://github.com/tbranyen/backbone-boilerplate)
- [Rake Pipeline Web Filters](https://github.com/wycats/rake-pipeline-web-filters)
- [Rake Pipeline](http://rubydoc.info/github/livingsocial/rake-pipeline/master/file/README.yard)
- [Why underscore and backbone don't support AMD](https://github.com/documentcloud/underscore/pull/431)
- [DocumentCloud backbone](https://github.com/documentcloud/documentcloud/tree/master/public/javascripts)
- [TodoMVC Backbone example](https://github.com/addyosmani/todomvc/blob/master/architecture-examples/backbone/js/todos.js)
- [Backbone Fundamentals](https://github.com/addyosmani/backbone-fundamentals)


### Level 1 - Introduction

By now, we are all very familiar with building client-side apps with jQuery.  For example, let's say we want to build a client-side app called the One Thing To-Do app.  It's just like a todo list, but instead of a list, it's just a single item (patent pending).  

For this example, we are going to assume the server is responsible for rendering the html structure of the page, and our jQuery will load the todo item from the server over ajax and display it on the page. **go over the html and query to get this to work**

Now, this seems very straightforward, easy to read, and not very much code.  Where does backbone come in? Well, what happens if you decide to allow multiple todo's, and then you want the user to be able to order them, and mark them as finished, then you want to assign them due-dates and show them on a calendar.  

If you stayed with jQuery, you'd end up with a spaghetti pile of html+js.  The power of backbone is in giving you an organized structure for an **application**, allowing you to write less code that gets more done.

So, let's rewrite our single to-do list app using just two of the tools Backbone gives us, a model and a view.  

Models are your application objects.  For example, in this application, a TodoItem would be a model.  Models will have attributes. Our TodoItem has just one attribute, the *description*, but you can imagine the list of attributes growing to include things like *date*, *completed*, *assigned*, etc.  

Views are objects that use a model object to render some html to the page.  In our app, we will have a TodoView that uses a TodoItem model to render the same html we used before when just using jQuery.  

But we aren't going to drop jQuery like a bad habit.  We like jQuery, we are used to it.  Using backbone.js lets you keep jQuery around, like we are about to see.

**go through the steps to re-write the app in backbone**

#### Level 1 - Intro:

1. Create TodoItem model
2. Create an TodoItem model object with some data
3. Create a TodoView view
4. Create a TodoView object, passing in the model
5. Add a render method to view, adding the correct html to the page
6. Call the render function and insert the html

### Level 2 - Models

1. Set some attributes on the model
2. Get an attribute
3. Set some default attributes
4. Get the json of the model
5. bind a function to the change event
6. bind a function to the change:attribute event

### Level 3 - Views

1. Add an event that calls a function on the view when something is clicked
2. Change the tagName
3. Set the class name / id
4. Set a template using underscore
5. Use the template in render()
6. Insert the .el into the DOM
7. Instantiate a view and pass in the el thats already in the dom

### Level 4 - Models + Views

1. Create a view instance and pass in the model (it automatically gets set)
2. Use model.toJSON() in render
3. Pass the model into the template and use model.escape()
4. In initialize, bind the change event to call render
5. Set the models attributes in a UI triggered event
6. Update the change event to be a specific attribute and a function other than render

### Level 5 - Collections

1. Create a collection and set the model
2. Call fetch to get the collection
3. Use reset to seed the collection
4. Add a comparator to sort the models
5. Add a model to the collection
6. Remove a model from the collection
7. bind the 'add' event to call a function
8. bind the 'reset' event to call a function
9. Iterate through the models

### Level 6 - Collection + Views

1. Create a Collection View
2. Instantiate the view and pass in the collection (and the el)
3. in initialize, bind 'add' to the addOne function
4. Implement the addOne function, rendering a single view
5. In render(), iterate over the collection and call addOne for each one
6. Refactor that to addAll
7. In initialize, bind 'all' to addAll
8. Bind 'remove' to the remove function (which needs to be written)

### Level 7 - Router / History

1. Create a simple router with one route /todos/:id that calls a function when called
2. Instantiate the router inside a ready event
3. Start the backbone history watching with pushState: true
4. navigate to the /todos/:id route using navigate
5. Add an event listener for the /todos/:id route

### Level 8 - Putting it all together

**Show the cool stuff that you can now do with the backbone base**

* [Dispatcher?](http://documentcloud.github.com/backbone/#Events)

### Ember vs backbone:

but how to put it concisely ... Ember is an (IMO) more experimental attack at the end-to-end problem, by introducing new concepts to JavaScript, like the aforementioned Ember.meta bindings on objects ... Backbone is simply the lowest-common denominator set of functions and patterns to be productive

[#documentcloud irc log](https://raw.github.com/gist/1732351/394300e27f56afd4f49476df79f7c90284f03d27/backbone-ember-back-and-forth-transcript.txt)

jashkenas: personally -- I like to have 99% of code outside of the domready wrapper.
jashkenas: and then do:
jashkenas: $(function(){ app.initialize(); });


