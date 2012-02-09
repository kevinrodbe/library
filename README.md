### Challenges:

#### Level 1 - Intro:

1. Create a `TodoItem` Model class
2. Instantiate a `TodoItem` instance with a description
3. Create a `TodoView` View class
4. Instantiate a `TodoView` instance, passing into the model instance
5. Add a `render` function to `TodoView` that adds an `h3` with the description of the todo
6. Call the `render` function on the `TodoView` instance and insert it's top-level element into `#app`

### Level 2 - Models:

1. Set the `url` on `todoItem` and call `fetch()`
2. Set the `urlRoot` when creating the `TodoItem` class.
3. Set the `description` using `set` and call `save` on the `todoItem`
4. Alert the user whenever an attribute on `todoItem` changes using `on`
5. Alert the user whenever `status` changes on `todoItem` using `on`
6. Set `defaults` on the `TodoItem` class for `description` and `status`
7. Create a new `TodoItem` and call `toJSON()` on it.

### Level 3 - Views:

1. Create a new `TodoView` instance and log it's top-level element
2. Change the `tagName` of the `TodoView` to `article`
3. Change `TodoView` to have an `id` of `"todo-view"` and a `className` of `"todo"`
4. Pass in an existing element when instantiating a `TodoView` using `el`
5. Set the `template` of `TodoView` to `"<h3><%= description %></h3>"`
6. Change the `render` function to call `template`
7. Add an event to `TodoView` that calls `alertStatus` whenever the `h3` is clicked

### Level 4 - Models + Views

1. Instantiate a `TodoItem`, and then pass it in as the model to a new `TodoView`
2. Update the `TodoView` `render` call to use `model.toJSON()`
3. Implement the `toggleStatus` function on the view
4. Refactor the `toggleStatus` functionality to the model
5. Bind to the model's `'change'` event to call `render`
6. Bind to the model's `'destroy'` event to call `remove`, implement `remove`

### Level 5 - Collections

1. Create a Collection class `TodoItems` that manages the `TodoItem` model.
2. Instantiate a new `TodoItems` instance named `todoItems`
3. Add a `TodoItem` instance to the collection using `add`
4. Use `get` and `at` to retrieve a single `TodoItem` from the collection
5. Use `reset` to seed the `todoItems` models
6. Set the `url` of the collection and call `fetch()`
7. Alert when the `todoItems` `'reset'`/`'add'`/`'remove'` event is fired
8. Destroy a model when it is removed from the collection using the `'remove'` event
9. Use `forEach` to log all the descriptions in the collection

### Level 6 - Collection + Views

1. Create a collection view class called `TodosView` and instantiate it with `todoItems`
2. Implement `render` using `forEach` and creating a `TodoView` for each model
3. Refactor `forEach` to call `addOne`, and bind `addOne` in `TodoView#initialize`
4. Render the `todosView` and put it's top-level element into the DOM
5. Bind to the collection's `add` event to call `addOne`
6. Refactor the `forEach` into `addAll`, and bind the collections `reset` to `addAll`
7. In the collections `initialze`, bind `hideModel` to `remove` event, triggering the `hide` event.
8. In the model view, bind to the `hide` event to remove the view from the DOM


### Level 7 - Router / History

1. Create a Router class
2. Add `routes` to the router class for `todos/:id`
3. In the `show` action, log out the id
4. Call Backbone.history.start()
5. Use `navigate`
6. Instantiate the router, passing in the collection.  Set the collection in `initialize`. Call `focusOnTodoItem` in `show`
7. Implement the `index` route and action, calling `fetch` on the collection

### Level 8 - Putting it all together

- **not sure if we are going to do this one**

### Resources:

- [Backbone Boilerplate](https://github.com/tbranyen/backbone-boilerplate)
- [Rake Pipeline Web Filters](https://github.com/wycats/rake-pipeline-web-filters)
- [Rake Pipeline](http://rubydoc.info/github/livingsocial/rake-pipeline/master/file/README.yard)
- [Why underscore and backbone don't support AMD](https://github.com/documentcloud/underscore/pull/431)
- [DocumentCloud backbone](https://github.com/documentcloud/documentcloud/tree/master/public/javascripts)
- [TodoMVC Backbone example](https://github.com/addyosmani/todomvc/blob/master/architecture-examples/backbone/js/todos.js)
- [Backbone Fundamentals](https://github.com/addyosmani/backbone-fundamentals)
- [Dispatcher?](http://documentcloud.github.com/backbone/#Events)
- [#documentcloud irc log](https://raw.github.com/gist/1732351/394300e27f56afd4f49476df79f7c90284f03d27/backbone-ember-back-and-forth-transcript.txt)


