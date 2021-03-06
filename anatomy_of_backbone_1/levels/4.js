// ### Level 4 - Models and Views Together
//
// In this level, we are going to expand on the first level
// to explore how Models and Views work together in Backbone to
// provide clean separation between data and the DOM, which makes it easier
// to create complex, modern web applications.
//
// In this level, we are going to start adding some functionality to our
// Single Todo application.  At the end of this level, our app will
// allow the user to toggle the status of the TodoItem by checking a checkbox,
// and update the DOM to strikethrough the description if the status is `'complete'`

// Lets first update our `TodoView` template and add a checkbox.
var TodoView = Backbone.View.extend({
  // we are checking if the `status` is equal to `'complete'`
  // so we can start the checkbox as checked.  We'll see how this is important
  // in a couple of slides.
  template: _.template('<h3><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

  // now in our render function, when we call the `template` function,
  // we will pass in the results of `this.model.toJSON()`, which will just
  // be a plain object of key/value pairs that represent the model's attributes:
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  // We want to call a function on this View whenever the user
  // checks or unchecks the checkbox.

  // Let's use the `events` declaration we learned about in Level 3
  // to trigger a function whenever the `change` event is fired on our
  // input element
  events: {
    'change input': 'toggleStatus'
  },

  // All that is left is to implement the `toggleStatus` function.
  // Let's start with just updating the model based on it's current status.
  toggleStatus: function(){
    // TODO: use `===` instead of `==`
    if(this.model.get('status') == 'incomplete'){
      this.model.set({'status': 'complete'});
    }else{
      this.model.set({'status': 'incomplete'});
    }
  }

  // This will work just fine, but we should refactor this code
  // into the model, that way the view doesn't know too much about how
  // this model works, and we can change the model easier in the future.

  // Just tell the model to toggle it's status, the
  // model will do what is right
  toggleStatus: function(){
    this.model.toggleStatus();
  }

});

// And in our model, we define the `toggleStatus` function
// to do just as it was doing in our view,
// but instead of calling `this.model.get` and `this.model.set`,
// we just call `this.get` and `this.set`.
var TodoItem = Backbone.Model.extend({
  toggleStatus: function(){
    if(this.get('status') == 'incomplete'){
      this.set({'status': 'complete'});
    }else{
      this.set({'status': 'incomplete'});
    }

    // Save these changes to the server
    this.save();
  }
});

// This "refactor to the model" is a common pattern in Backbone.  It's a good
// idea to move model specific functionality into the Model layer, that
// way if ever need to toggle the status of the model instance from a different
// view, you can use `this.model.toggleStatus()` and not have to define toggle
// behavior in two or more different views.

// ### Model events
//
// Now that we our responding to the checkbox's `change` event and updating
// our `todoItem`, we want to display to the user a reflection of the `todoItem's`
// status.

// First let's update the `h3's` `class` to be the status of the `todoItem`.
template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

// Let's assume we have a stylesheet with this declaration:
//
// `.complete { text-decoration: line-through; }`
//
// That means whenever the `h3's` class is `complete`, the text will have a strike-through
// and the user will know they have successfully completed their TodoItem.

// So with this model
var todoItem = new TodoItem({description: 'Pick up milk.', status: 'incomplete'});

// when we `render()` the view, the `h3's` class will equal `incomplete`
todoView.render();
console.log(todoView.el); // <div><h3 class="incomplete">...</h3></div>

// So now we just need to update the view when the model changes.  So where do
// we put the code to re-render the view when the model changes?

// Well, we could try putting it in the View's `toggleStatus` function, right?
// Something like this:
toggleStatus: function(){
  this.model.toggleStatus();
  this.render();
}

// But now the view will only re-render when that `toggleStatus` function
// is called.  What happens when we expand our app and our model instance's
// status can get updated from another part of the UI?

// Well, you might remember that back in Level 2, we were able to listen
// to `change` events on a model instance, and call a function when that
// event fired.  And it would make sense that our view would be interested in
// changes made to it's model, right?

// So, when we initialize our View, let's have the view tell the model to call
// the view's `render` function whenever the model changes.
var TodoView = Backbone.View.extend({
  // Backbone will automatically call this `initialize` function
  // when you do `var todoView = new TodoView({model: todoItem})`
  initialize: function(){
    // `on` takes a third argument called the `context`
    // argument.  For further explanation, check out [below](#section-25)
    this.model.on('change', this.render, this);
  }
});


// So now, whenever the model changes, the views `render` function is called, and the HTML
// is re-generated.  We also don't have to worry about inserting the view's `el` into the DOM
// because we only have to do that once, when we initially called `render`:
todoView.render();
$('#app').append(todoView.el);

// What about if we `destroy` the model, we should probably remove it from the DOM,
// right?
var TodoView = Backbone.View.extend({
  initialize: function(){
    // call the view's `this.remove` whenever this model is destroyed
    this.model.on('destroy', this.remove, this);
  },

  remove: function(){
    // use jQuery's [remove](http://api.jquery.com/remove/) to
    // remove this view's top-level element from the DOM
    this.$el.remove();
  }
});

// Calling `destroy` on the `todoItem` will remove it from the DOM:
todoItem.destroy();

// #### Brief Interlude on functions and `this`
//
// TODO: write this section [reference this](http://documentcloud.github.com/backbone/#FAQ-this)

// Now we are really starting to see some of the power that using Backbone
// gives us.  Anytime this model instance is changed, no matter from where in the
// UI, this on todoView will reflect the correct state to the user.

// Putting everything together, our new View and Model look like this:
var TodoView = Backbone.View.extend({
  template: _.template('<h3 class="<%= status %>"><input type=checkbox <%= status == "complete" ? "checked=checked" : "" %>/> <%= description %></h3>'),

  events: {
    'change input': 'toggleStatus'
  },

  initialize: function(){
    this.model.on('change', this.render, this);
    this.model.on('destroy', this.remove, this);
  },

  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  remove: function(){
    this.$el.remove();
  }

  toggleStatus: function(){
    this.model.toggleStatus()
  }
});

var TodoItem = Backbone.Model.extend({
  toggleStatus: function(){
    if(this.get('status') == 'incomplete'){
      this.set({'status': 'complete'});
    }else{
      this.set({'status': 'incomplete'});
    }
  }
});
