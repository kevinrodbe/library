// ### Alternate Templates

// Backbone.js doesn't try to make all your decisions for you.  In fact, 
// it makes a surprisingly few decisions, and can be customized very easily.

// One place where you might want to customize is in your templates. The one
// that comes with underscore is simple enough but sometimes you might want
// to use something like Mustache.js or Hogan.js.  

// There is nothing special about the underscore template.  You can easily
// switch out another templating engine with hardly any code. One such
// templating engine is Mustache. Mustache tries to be as simple as possible,
// and provides only logic-less templates (so can't just execute arbitrary javascript
// like you can in underscore)

// Let's first show you an example of switching from using underscore to 
// Mustache and then we'll go into a little more detail about how Mustache
// templates work.

// Here is our Backbone View that uses the `template` function from underscore.js
// to assign a template function to the instance of the view.
var TodoItemView = Backbone.View.extend({
  template: _.template("<span><%= description %></span" +
    "<em><%= assigned_to %></em>"),

  render: function(){
    this.$el.html(this.template(this.model.attributes));
  }
});

// Remember that `_.template()` actually returns a function, and we assign
// that function to the `template` property on the view instance, which
// is then used in the `render` function to create a string of HTML.

// To prove how flexible Backbone is, let's first not use the property name `template`
// and instead use `banana`:

var TodoItemView = Backbone.View.extend({
  banana: _.template("<span><%= description %></span" +
    "<em><%= assigned_to %></em>"),

  render: function(){
    this.$el.html(this.banana(this.model.toJSON()));
  }
});

// Hey, it still works! This is a silly example but I wanted to show you
// how little Backbone depends on the word `template`. In fact, if you search
// the [Backbone source](http://backbonejs.org/docs/backbone.html), the only
// place you find the word `template` is in a documentation comment.

// So to replace underscore templates with Mustache.js, we just need to use
// the `Mustache.compile` function, like so:

var TodoItemView = Backbone.View.extend({
  template: Mustache.compile("<span>{{ description }}</span" +
    "<em>{{ assigned_to }}</em>"),

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
  }
});

// As you can, almost everything stayed the same. However, we did change the template
// string to work with Mustache. Instead of using `<%=` and `%>` as placeholders, we
// used double curly braces. Many people think this looks better, especially when 
// rendering HTML, because the `<%=` and `%>` placeholders are hard to see in the HTML sea
// of brackets.

// Other than that, nothing really changed, so why bother? Well, Mustache.js is a much
// more full featured templating solution than the underscore.js one.

// For example, let's say you have an Array of strings and want to render each one
// of them as an `li`, in underscore.js you'd have to use _.each, like so:

<% _.each(names, function(name) { %>
  <li><%= name %></li>
<% }); %>

// From an aesthetic standpoint, this is pretty bad. It's really awkward that we
// have to have a line just to close the function call that just looks like a mishmash
// of characters `<% }); %>`

// With mustache, you can use a loop "section" to do the same thing, but much cleaner.
// A section in mustache starts with #, so to output an array of "names", we could do this:

{
  "names": ["Eric", "Nate", "Jacob"]
}

{{#names}}
<li>{{.}}</li>
{{/names}}

// The `.` refers to the current name, so the above template would output as:

<li>Eric</li>
<li>Nate</li>
<li>Jacob</li>

// You can also loop through an array of objects using a Mustache section very easily.
// Let's say you have this json:

{
  "people": [
    { name: "Eric", hairColor: "brown" },
    { name: "Nate", hairColor: "blond" },
    { name: "Jacob", hairColor: "blue" },
  ]
}

// In underscore, you'd have to do something like this:

<% _.each(people, function(person) { %>
  <li><%= person.name %> has <%= person.hairColor %> hair</li>
<% }); %>

// And then with Mustache:

{{#people}}
  <li>{{ name }} has {{ hairColor }} hair</li>
{{/people}}

// Which would then output

<li>Eric has brown hair</li>
<li>Nate has blond hair</li>
<li>Jacob has blue hair</li>

// Sections can also be used for these features:
//  * False Values or Emtpy Lists
//  * Array's of strings or objects
//  * Inverted sections (only render if something is false, empty, etc.)
//  * Functions

// Mustache has a lot of other nice features, and with Backbone, it's extremely easy
// to start using it right away. 
// For more on Mustache.js: https://github.com/janl/mustache.js/

// ### Customize Sync (Local Storage)

// By default, the data your Backbone app handles is stored on a server.  You
// fetch data from the server, change it, and then send it back to the server to 
// save.  For example, when you have this TodoItems collection below:

var TodoItems = Backbone.Collection.extend({
  url: '/todos'
});

var todos = new TodoItems();

// Now, when you call fetch, it will make an Ajax request to the `/todos` URL to get the JSON data for all todos:

todos.fetch() // GET /todos

// When you create a new TodoItem (using the Collection#create method), it will make an Ajax request on the server to save the new todo, like so:

todos.create({"description": "Pickup Milk"}) // POST /todos

// These ajax requests (and all others) are done through the Backbone.sync function. By default, it uses the jQuery.ajax
// function to make a "RESTful" JSON request.  This is known as the default Backbone "persistence strategy".  This makes
// it really easy to use a different "persistence strategy", by just replacing the `Backbone.sync` function.

// You can listen to the 'sync' event on a collection (or model) to inspect what's going on under the hood.  The
// sync event passes 3 arguments to the event callback: the model or collection, the server response, and any options used in the sync operation.
// You can listen for this event and log out these arguments to the console, like this:

todos.on('sync', function(model, resp, options){ 
  console.group("Sync"); 
  console.log(model); 
  console.log(resp); 
  console.log(options); 
  console.groupEnd();
});

// `console.group` groups together related console calls so they are easier to see.  Now when you call `todos.fetch()`, you see these three objects in the console
// **show console screencast**

// `sync` takes three arguments: `method`, `model`, and `options`.  
//
// * `method` is the CRUD method (`"create"`, `"read"`, `"update"`, or `"delete"`)
// * `model` is the model to the be saved (or collection to be read)
// *  `options` optional, holds success and error callbacks, and all other jQuery request options

// You can override sync at the global level or just through a specific model.  For example, if you wanted to ensure that a model is only ever "read"
// you could override the sync method like so:

var TodoItem = Backbone.Model.extend({
  sync: function(method, model, options){
    if (method === "read"){
      Backbone.sync(method, model, options);
    }else{
      console.error("You can not " + method + " the TodoItem model");
    }
  }
});

// When the method is `"read"`, we call the `Backbone.sync` function, passing in the `method`, `model`, and `options`. If not, we
// log an error to the console.  This ensures that a TodoItem is only ever read and never synced back up to the server.

// `sync` is usually used for a different purpose though: changing the "persistance strategy" completely.  For example, instead of using
// a RESTful JSON server to store data, we could use HTML5 localStorage, which allows you to store key/value pairs locally and have them persist
// across sessions (like cookies). Unlike cookies, this information is never sent to the remote web server.  It also has pretty good browser support,
// and is extremely simple to use. Let's override TodoItem `sync` to make it use `localStorage`:

// First, setup the sync function to use a `switch` statement to handle all four methods.
var TodoItem = Backbone.Model.extend({
  sync: function(method, model, options){
    // If options doesn't already exist, set it to an empty object
    options || (options = {});

    switch(method){
      case 'create':
      break;
      case 'read':
      break;
      case 'update':
      break;
      case 'delete':
      break;
    }
  }
});

// Now all we need to do is write some code to implement each of these four methods.  Before we do that, we
// need to know a little bit more about how `sync` works.  The default implementation of `sync` will make use
// of the `options.success` and `options.error` callback functions to pass back information about the `sync` operation
// (for example, the attributes object returned from the read operation).  

// Let's first implement the `create` method:

case 'create':
  var key = "TodoItem-" + model.id;
  localStorage.setItem(key, JSON.stringify(model.toJSON()));
break;

// Here we call `localStorage.setItem`, passing in the key and the value (a JSON string of the model's attributes).  The "key" we construct
// by concatenating the `"TodoItem-"` string with the model's `"id"` attribute.  This will give us a unique key that won't conflict with other models
// (if we had other models using localStorage we couldn't use just the model id as the key).

// Now we can implement the `"read"` method to retrieve the same key from localStorage, like so:

case 'read':
  var key = "TodoItem-" + model.get("id");
  var result = localStorage.getItem(key);
  if (result){
    result = JSON.parse(result);
  }else{
    options.error && options.error("Could not find TodoItem with id = " + model.get("id"));
  }
break;

// We first construct the key in the same way as we did in `create`, and then call `getItem` to try and retrieve the value. If 
// that value exists, we use JSON.parse to convert it into a JSON object.  If the value doesn't exist, then call the `options.error`
// callback, passing in a helpful error message.

// We still need to do something with the successful result.  After the switch statement, we can add this code to call the `success` callback
// with the result:
options.success && options.success(result);

// Now let's see this in action **Show a screencast**

// Of course, we'd still need to implement `delete` and `update` to complete this localStorage persistence strategy, but you get the idea.
// If you wanted to replace the persistence strategy for your entire Backbone app (all collections and models), you could use
// the [Backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage) library.

// After including the script into your app (after the backbone.js script), all you have to do is set the localStorage propert 
// ### Customize $