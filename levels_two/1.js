// ### Level 1 - Models
//
// Since you already know the basics of models, let's dig a little deeper and
// learn how to customize them to fit your specific needs.
//
// Since it's familiar and easy to understand, we'll be using the canonical
// example, The Todo App.

// #### parse

// As you know, models expect an object containing the attributes to be set
// during initialization.
var todo = new Todo({description: 'milk', status: 'complete'});

// However, resources come in all different shapes and sizes and you can't
// always change them to fit the expectations of the client.  What if your
// data contains an object wrapper around the model's attributes?
//
//     {"todo": {"description": "milk", "status": "complete"}}
//
// For instance, this is the default format when using a Rails backend.
// Despite being able to turn this behavior off, there may be situations in
// which you don't want to or can't.

// When you instantiate a model with namespaced data, the attributes won't be
// correct.
var todo = new Todo({todo: {description: 'milk', status: 'complete'}});
todo.get('description'); // undefined :(

// This is where the `parse` function comes in.  It allows you to modify server
// data before setting the attributes on your model.
var Todo = Backbone.Model.extend({
  parse: function(response) {
    return response.todo;
  }
});

// By default, `parse` is only called upon receiving data from the server after
// saving or fetching a model.  However, you can force the parsing of data via
// the `parse` option.
var todo = new Todo({
  todo: {description: 'milk', status: 'complete'}
}, {parse: true});

// You can also change properties and otherwise massage data with `parse`.  In
// the following example, rename the `desc` property as `description`.  Also,
// ensure that the old property doesn't cause confusion by removing it with the
// `delete` operator.
var Todo = Backbone.Model.extend({
  parse: function(response) {
    response = response.todo;
    response.description = response.desc;
    delete response.desc;
    return response;
  }
});

// #### toJSON

// In case you're not familiar with the spec (http://es5.github.com/#x15.12.3),
// `toJSON` is a special name in javascript.  If you call `JSON.stringify` on a
// javascript object and there is a `toJSON` property on said object, its
// return value will be used instead of the object itself.  Be sure to keep
// this in mind as you're working with `toJSON` in the context of a Backbone
// model.
JSON.stringify({toJSON: function(){ return {x: 1}; }}); // '{"x": 1}'

// As a complement to `parse`, Backbone models provides a default `toJSON` for
// generating resources to be sent to the server.  This can be rather handy if
// your server is expecting something other than the client representation.
//
// For instance, you may want to add back the wrapper we removed above.  When
// doing so, you'll want to make sure you return a *copy* of the attributes via
// `_.clone` so that they can be munged before being sent to the server if
// desired.
var Todo = Backbone.Model.extend({
  toJSON: function() {
    return {todo: _.clone(this.attributes)};
  }
});

// You can also pick specific attributes using `_.pick` so that you don't send
// client specific attributes back to the server.  Whitelisting in this manner
// should be generally preferred to blacklisting in order to avoid including
// extra attributes accidentally.
//
// Also, make sure you restore the `desc` property with the value of
// `description` and then remove the client only `description` property with
// the `delete` operator.
var Todo = Backbone.Model.extend({
  toJSON: function() {
    var attrs = _.clone(this.attributes);
    attrs.desc = attrs.description;
    delete attrs.description;
    return {todo: _.pick(attrs, 'desc', 'status')};
  }
});

// #### ID Attribute

// By default, the `id` attribute of the model is copied to the `id` attribute.
// In other words, `model.get('id') === model.id`.  However, you sometimes need
// to use a non-standard `id` attribute.  For example, both CouchDB and MongoDB
// use `_id` instead of `id`.
var Todo = Backbone.Model.extend({
  idAttribute: '_id'
});
