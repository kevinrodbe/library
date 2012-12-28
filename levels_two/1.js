// ### Level 1 - Models
//
// Since you already know the basics of models, let's dig a little deeper and
// learn how to customize them to fit your specific needs.

// #### Parsing Data

// As you know, models expect an object containing the attributes to be set
// during initialization.
var model = new Backbone.Model({description: 'milk', status: 'complete'});

// However, resources come in all different shapes and sizes and you can't
// always change them to fit the expectations of the client.  What if your
// data contains an object wrapper around the model's attributes?
//
//     {"item": {"description": "milk", "status": "complete"}}

// When you instantiate a model with this data, the attributes won't be
// correct.
var model = new Backbone.Model({
  item: {description: 'milk', status: 'complete'}
});
model.get('description'); // undefined :(

// This is where the `parse` function comes in.  It allows you to modify server
// data before setting the attributes on your model.
var Model = Backbone.Model.extend({
  parse: function(response) {
    if (response) response = response.item;
    return response;
  }
});

// By default, `parse` is only called upon receiving data from the server after
// saving or fetching a model.  However, you can force the parsing of data via
// the `parse` option.
var model = new Backbone.Model({
  item: {description: 'milk', status: 'complete'}
}, {parse: true});

// You can also change properties and otherwise massage data with `parse`.
// In the following example, rename the `desc` property as `description`.
var Model = Backbone.Model.extend({
  parse: function(response) {
    response.description = response.desc;
    delete response.desc;
    return response;
  }
});

// #### Generating Data

// As a complement to `parse`, Backbone models provide `toJSON` for generating
// resources to be sent to the server.  This can be rather handy if your server
// is expecting something other than the client representation.

// For instance, you may want to add back the wrapper we removed above.
var Model = Backbone.Model.extend({
  toJSON: function() {
    return {item: _.clone(this.attributes)};
  }
});

// You can also pick specific attributes using `_.pick` so that you don't
// send client specific attributes back to the server.
var Model = Backbone.Model.extend({
  toJSON: function(response) {
    return _.pick(this.attributes, 'description', 'status');
  }
});

// #### Custom ID Attribute

// By default, the `id` attribute of the model is copied to the `id` attribute.
// In other words, `model.get('id') === model.id`.  However, you sometimes need
// to use a non-standard `id` attribute.  For example, both CouchDB and MongoDB
// use `_id` instead of `id`.
var Modle = Backbone.Model.extend({
  idAttribute: '_id'
});
