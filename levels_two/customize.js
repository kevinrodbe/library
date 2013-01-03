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
    this.$el.html(this.template(this.model.toJSON()));
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

_.template("<% _.each(names, function(name) { %>" +
    "<li><%= name %></li>" +
    "<% }); %>"
  )

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

// Mustache has a lot of other nice features, and with Backbone, it's extremely easy
// to start using it right away.

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


// ### Customize $