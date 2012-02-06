// ### Level 3 - Views In Depth
//
// In the first chapter, we briefly covered how views are
// responsible for rendering the html for a corresponding model.

// Just to refresh our memories we built a very simple `TodoView`
// that displayed a single `TodoItem` model object.  Here is that code again:

// Creating the view class
var TodoView = Backbone.View.extend({
  render: function(){
    $(this.el).html('<h3>' + this.model.get('description') + '</h3>');
    return this;
  }
});

// our model instance
var todoItem = new TodoItem({description: 'Pick up milk'});

// instantiate our view instance
var todoView = new TodoView({model: todoItem});

// Render the view and insert it's top-level element into the DOM
todoView.render()
$('#app').append(todoView.el);

// For the rest of this chapter, we are going to be building on this
// simple example to add functionality to this view, from interacting with
// user events (mouse clicks, keypresses, etc.) to updating the model, to
// updating the html in response to model events.

// ### The el
//
// First though, I want to go over how `.el` works and how we can customize it.
//
// Every View instance automatically gets an `.el` property, and by default it is
// just an empty div.  

// You can see this yourself easiest in the console by
// instantiating a new View instance and call `.el` on it, like this:
var todoView = new TodoView();
console.log(todoView.el) // '<div></div>'

// Backbone gives us a couple of ways to customize the `.el`.  We can change
// it from a `div` by using tagName:
var TodoView = Backbone.View.extend({
  tagName: 'article'
});

// and now when creating a new instance of `TodoView`, `.el` will be an `<article>`
var todoView = new TodoView();
console.log(todoView.el); // '<article></article>'

// we can also set some attributes of the `.el` by passing in `id` or `className`
// just like we did `tagName`
var TodoView = Backbone.View.extend({
  tagName: 'article',
  id: 'todo-view',
  className: 'todo'
});

var todoView = new TodoView();
console.log(todoView.el); // '<article id="todo-view" class="todo"></article>

// `.el` returns the HTML DOM element, but since we are using jQuery, we'll
// probably want to wrap that in a `$(todoView.el)` call to be able to use 
// jQuery.

// Backbone sets a cached property at `.$el` that will return the `.el` wrapped
// in jQuery:
todoView.$el.show() // calls the jQuery.show() function

// Sometimes, you might not want to create a new DOM element but instead use one that already
// exists on the page.
// For example, maybe there is already a `<div id="todo"></div>` on the page
// and we want that to be attached to the `.el` of the view.  

// All we have to do is pass in the `el` option when creating a new View instance
var todoView = new TodoView({el: $('#todo')});
console.log(todoView.el); // '<div id="todo"></div>

// #### Templates

// In Level 1 when we wanted to render some extra HTML we used good ole
// javascript string concatenation, like this;
$(this.el).html('<h3>' + this.model.get('description') + '</h3>');

// Which is fine for that small amount of HTML, but what happens when we
// have a whole lot of HTML for that one view?  

// We don't want to end up writing something like this:
$(this.el).html('<div class="' + model.get('status') + '">' +
                   '<article>' +
                      '<span>' + model.get('status') + '</span>' +
                      '<h3>' + model.get('descrption') + '</h3>' +
                    '</article>' + 
                 '</div>')

// And this is still a pretty simple snippet of HTML, you could imagine how it could
// get unweildy very quickly.

// If your from a Rails background, you might recognize that we don't have this
// problem in server side land.  That's because in Rails we use a template engine (like erb)
// to generate our HTML for us.

// In Backbone we can do the same thing with client side templates.  
// Backbone comes built in with one from the [underscore library](http://documentcloud.github.com/underscore/).

// To use it, you first have to set the template when creating your View class, like this:
var TodoView = Backbone.View.extend({
  // `_` is the variable the underscore library is stored in.
  // Calling `_.template` will return a template function.
  template: _.template('<h3><%= description %></h3>')
});

// As you can see, our template uses erb-like tags to describe 
// the dynamic values we want our HTMl to be populated with. Let's look
// at that template string a little more closely

// Notice how inside of the `<%= %>` tags we aren't calling `model.get('description')`
// but instead just using `description`.
'<h3><%= description %></h3>'

// So now our View's `render` function will use the template:
var TodoView = Backbone.View.extend({
  template: _.template('<h3><%= description %></h3>'),

  render: function(){
    // `this.template` takes a single JSON object as an argument
    // `description` here will populate the `<%= description %>`
    // in the template
    var attributes = {description: 'Pick up milk.'};
    //
    // `this.template` is the function that was set above
    // by the call to `_.template`
    this.$el.html(this.template(attributes));
    return this;
  }
});

// create our `todoView` instance
var todoView = new TodoView({});
// render our view, which will use the new template function
todoView.render();
console.log(todoView.el) // '<div><h3>Pick up milk.</h3></div>'


// #### User Events
//
// Not only are Views responsible for generating the HTML to display to the User,
// but they are also responsible for responding to User events, such as
// clicking on a button, or pressing a certain key, or hovering over an element.
//
// These events are not the same as the Model events we covered in Level 2, but they
// are similar.  
//
// Backbone provides an easy way to declaratively define which events our View
// should handle, and what functions should be called when those events occur.
//
// For example, imagine we want to alert the user every time they click on the 
// description element (in this case the `h3`).

// First, we need to declare the event when creating the `TodoView` class
var TodoView = Backbone.View.extend({
  events: {
    // call the `alertStatus` function on this view whenever the user
    // clicks on an `h3` element.
    // The `h3` in this case is the element selector, and so
    // it could be any selector you'd use in jQuery.
    "click h3": "alertStatus"
  },

  // Define the alertStatus function on the view.
  // Now whenever the user clicks on the h3, they 
  // will know it :)
  alertStatus: function(e){
    alert('Hey you clicked the h3!');
  },

});

// Any event you can listen to on an element in jQuery can be used here.
// In fact, this code uses jQuery to do the event listening and firing. So any
// of these can be used:
//
// * [change](http://api.jquery.com/change/)
// * [click](http://api.jquery.com/click/)
// * [dbclick](http://api.jquery.com/dblclick/)
// * [focus](http://api.jquery.com/focus/)
// * [focusin](http://api.jquery.com/focusin/)
// * [focusout](http://api.jquery.com/focusout/)
// * [hover](http://api.jquery.com/hover/)
// * [keydown](http://api.jquery.com/keydown/)
// * [keypress](http://api.jquery.com/keypress/)
// * [load](http://api.jquery.com/load/)
// * [mousedown](http://api.jquery.com/mousedown/)
// * [mouseenter](http://api.jquery.com/mouseenter/)
// * [mouseleave](http://api.jquery.com/mouseleave/)
// * [mousemove](http://api.jquery.com/mousemove/)
// * [mouseout](http://api.jquery.com/mouseout/)
// * [mouseover](http://api.jquery.com/mouseover/)
// * [mouseup](http://api.jquery.com/mouseup/)
// * [ready](http://api.jquery.com/ready/)
// * [resize](http://api.jquery.com/resize/)
// * [scroll](http://api.jquery.com/scroll/)
// * [select](http://api.jquery.com/select/)
// * [unload](http://api.jquery.com/unload/)
