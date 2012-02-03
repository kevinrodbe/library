// Welcome to the introduction to **Backbone.js**, a library
// created to help make writing complex client side apps
// easier and more intuitive.
//
// Before we get into backbone, let's first look how we write client side apps today
// using our trusty jQuery.
//
// As an example to work through, we are going to be building a simple todo app.
// ### Using jQuery

// Do an ajax request to `/todo`, and pass JSON to the callback
// Example JSON response:
//
//    `{ description: 'Pick up milk', status: 'incomplete' }`
$.getJSON('/todo', function(data) {
  // Insert an h3 tag with a checkbox into the `#app` div already on the page
  $('#app').append('<h3><input type=checkbox /> ' + data.description + '</h3>')

  if(data.status == 'complete'){
    // If the task is already done
    // Add the `done` class to the h3
    $('#app h3').addClass('done');
    // And set the checkbox to checked
    $('#app input').attr('checked', true)
  }

  // Add an event handler to fire when they check/uncheck the checkbox
  // If the checkbox is checked, add the `done` class to the h3
  // else just remove the `done` class from the h3
  $('#app input').on('change', function(e){
    if($(this).is(':checked')){
      $('#app h3').addClass('done');
    }else{
      $('#app h3').removeClass('done');
    }
  })
});


// We are all used to this type of client side coding, 
// and it's fine for this little example
// but what happens when this application gets a little more complex.  
//
// What if in the sidebar of this application we have
// a button that, when clicked, will clear all completed todo's, 
// or if we wanted to be able to drag and drop to change the order, 
// or include deadlines in our todo's and have them displayed in a 
// mini calendar somewhere else on the page.
//
// When client side applications like this increase in complexity, 
// the data becomes more important. But if you notice above, we 
// aren't keeping the data, we are just putting it right into the DOM.
//
// ### Backbone intro
//
// Backbone.js gives you a neat way to work directly with the data 
// of the application, and by changing/adding/removing
// that data, the DOM will be updated to reflect those changes.
//
// In Backbone, the data is represented by the Model.  Model's are 
// similar to Rails models in that
// they are the domain objects of your application 
// (things like User, Post, Todo, etc.)
// 
// ### Backbone Model intro
//
// Model objects have attributes that are just key-value pairs, like
// the data we got back from our getJSON call above.

// Using our example above, we can create a `TodoItem` Model class 
// in backbone like this:
var TodoItem = Backbone.Model.extend({})

// `TodoItem` can now be used as a `constructor` of TodoItem objects.
// All that `extend` does is `subclass` the top-level Backbone.Model class.
// It's a bit complicated but we'll into it more later.

// Create a `TodoItem` model instance with some attributes:
var todoItem = new TodoItem({description: 'Pick up milk', status: 'incomplete'});

// Now we can get the data out of the model using `get`, like this:
todoItem.get('description') // 'Pick up milk'

// And we can change the data in the model using `set`, like this:
todoItem.set({status: 'complete'});
todoItem.get('status') // 'complete'

// ### Backbone View intro

// Now that we have our data, we need a way to display it.
// That's where `Views` come in.  In Backbone, you use a View
// to build the html that represents a single `Model` object.


// To create a TodoView `View` class:
var TodoView = Backbone.View.extend({})

// Notice again that we just extend the `Backbone.View`, just like
// we did with `Backbone.Model`.  

// **Note about naming convention**
//    
//      You might have noticed that we sometimes capitalize the first
//      letter of the variable and sometimes we don't.  This is just
//      a convention for distinguishing which variables hold a class
//      and which hold an instance.  For classes, we always capitalize
//      the first letter, followed by the first letter of every new word.
//      For object instances, we just don't capitalize the first letter.

// And we can create a `View` instance and pass in the model
// object so our view can access the data it needs
var todoView = new TodoView({model: todoItem})


// But how do we tell our view what HTML to build?  Well, we need to go
// back to when we first created our `TodoView` and modify it slightly.

// Extend from Backbone.View, but pass in an object to override it's default behavior
var TodoView = Backbone.View.extend({
  // Define a new render function for this `View` class only.
  render: function(){
    // `this.model` is the `todoItem` we passed in when creating the `View` instance.
    // So, using our example, the HTML that is generated is:
    //      `<h3>Pick up milk.</h3>`
    var html = '<h3>' + this.model.get('description') + '</h3>'
    // Even though we are using Backbone, we still need jQuery DOM
    // manipulation.
    // `$(this.el)` is this view instance's top-level DOM element
    // and all the HTML generated by this view will go inside of it
    $(this.el).html(html);
  }
});

// Now we can call this `render` function like so:
todoView.render()

// But our DOM has not yet been updated because the view's `this.el`
// still just exists in memory, and needs to be added to the DOM:
$('#app').append(todoView.el)

// **show this code in action with a cast** 

// So far, we've only just skimmed the surface of using Backbone.  Let's
// dive a little deeper on Backbone Models and see what else we can do with them.
//
// ### Outline for the rest of the course:
//
// * **Models**
// * **Views**
// * **Models + Views**
// * **Collections**
// * **Collections + Views**
// * **Router / History**
// * **Putting it all together**

