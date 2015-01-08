// ### Level 2 - Collections
//
// Since you already know the basics of Backbone collections, let's look at some more
// advanced features.

// #### parse
//
// Collections are resources just like models, and therefore need to be parsed
// in much the same way.  Collection resources often include extra data in a
// wrapper that you may or may not want to keep around.  For example, you may
// include a per page count and total count.
//
//    {
//      "total": 25,
//      "per_page": 10,
//      "page": 2,
//      "todos": [
//        {"id": 1},
//        {"id": 2},
//        ...
//      ]
//    }

// Parse some collection data and keep a reference to the paging data.  These
// are just plain properties and are in no way Backbone specific.  However,
// you'll want to avoid overwriting standard collection methods and properties
// when using this technique.
var TodoItems = Backbone.Collection.extend({
  parse: function(response) {
    this.perPage = response.per_page;
    this.page = response.page;
    this.total = response.total;
    return response.models;
  }
});

// #### Generating Data

// Like models, collections also implement `toJSON`.  You can add a wrapper or
// a change the data via the same methods.
var TodoItems = Backbone.Collection.extend({
  toJSON: function() {
    return {todos: this.models};
  }
});

// #### comparator
//
// In a real application, collections often need to be sorted.  Backbone
// supports this and provides several tools for sorting your collections.

// Sort order is specified by the `comparator` property, which specifies an
// attribute to sort by.
var TodoItems = Backbone.Collection.extend({
  comparator: 'priority'
});

// If you need more fine grained control, you can supply a function as a
// comparator.  This function takes a model as an argument and returns the
// value to be compared.  For example, you can sort a collection in reverse
// order.
var TodoItems = Backbone.Collection.extend({
  comparator: function(model) {
    return -model.get('priority');
  }
});

// #### Aggregate Values
//
// You'll often need to retrieve aggregate values for a collection.  For
// example, you might want to display a count of completed todo items.
var TodoItems = Backbone.Collection.extend({
  completedCount: function() {
    return this.where({status: 'complete'}).length;
  }
});
