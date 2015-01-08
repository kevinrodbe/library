### Running Slides

You can use this app to run "slide code" to test out code.  This will help when writing slide content.  

To write a slide:

- Create a slide js file in app/assets/javascripts/slide. It can be named anything.
- In the slide js file, use the `createSlide` function to create a slide. For example, if you wanted to create a slide named 'models-1':

```
createSlide('models-1', function(){
  window.Model = Backbone.Model.extend({});
});
```

- Start the rails server (for example, on port 3000)
- To load the slide created above, go to localhost:3000/#models-1.  This will load just the slide code for 'models-1'

The HTML is located in app/views/home/index.html.erb.  

If you want to create a slide that loads another slide's code before it runs, you can do so like so:

```
createSlide('models-2', 'models-1, function(){
  var model = new window.Model();
});
```

This will load 'models-1' before loading 'models-2' when you go to localhost:3000/#models-1.

### Creating Todos

Run rake db:setup and then run the rails console:

```
> Todo.create :description => "Pickup Milk", :status => "incomplete"
```

