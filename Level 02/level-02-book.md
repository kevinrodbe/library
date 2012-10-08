## Notes

### Concepts covered

* Creating properties (and how to do it specifically for interface items)
    * The ViewController's view retains the subviews (thus the weak reference)
* Creating a UIButton in code
    * CGRectMake / UIView frame
    * HIG (how big to make the button)
* Adding a view as a subview using addSubview
    * relative frames
* Setting a UIButtons action when tapped using @selector
* selectors, messages, and method definitions
* NSString stringWithFormat
* Adding views using IB
* Connecting views in IB to controller properties using IBOutlet and IBAction
    
### Challenge Applications:

Instead of a button, use a slider that sets the opacity of an image view that is already a subview of the controller's view, AND updates a label to show the opacity value.

### Steps

* Create a UIButton that does the same thing as before with the changing of the alpha of the view.  This allows us to explain in the video about adding the button as a subview of the top level view.
    * Create the UIButton property in the ViewController.h 
* Explain the selector versus method definition versus a message.
* Add another subview (label), and use an outlet on the ViewController to update the value of the label after the button is clicked.
    * Create the UIButton property in the ViewController.h
* Explain NSString for setting the label with a dynamic value.
* Subviews get properties from their parent views, so animation of all subviews and happen by updating the property and animating it on the parent view.
* Refactor to IB step:
    * Create the subviews in IB
    

## Content

### Video 1

We left off in Level 1 with an App that had the ability to change the opacity of it's view whenever you touched anywhere on the screen.  It did this through communicating with it's `ViewController`, our custom class for controlling the view's of our application.  In this Level, we are going to add some more UI to our app, some actual UI "controls" and then display information about our app to the user.  It's not going to be too complicated but it will introduce some of the core concepts behind your app's User Interface.

Right now, it's really hard for our users to figure out what to do with our app by just looking at it.  Nothing on it looks clickable, it's just a blank screen, and they won't figure out what is going on until they happen to tap on it. This is bad design.  What we need is a way to let the user know they can tap something.  A good way to do this would be with a button.  Everyone knows how a button works.  You "push" a button, and some action occurs.

![image](http://blog.hostgator.com/images/big_red_button.jpg)

We *could* build our own button using just `UIView` and some drawing code, as well as implementing the correct "touches" methods.  But Cocoa Touch ships with many common controls that we can use in our apps, like `UIButton` or `UISlider`, which inherit from `UIView` and supply ways to perform some method when the user interacts with the control (taps as in the case of `UIButton` or slides as in `UISlider`).

Let's add a UIButton to our UI that when pressed, will change the opacity of the `ViewController`'s to a random value.

Here is how we'd create a new `UIButton` in code:

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor blueColor];
    
    UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    firstButton.frame = CGRectMake(100, 100, 100, 44);
    [firstButton setTitle:@"Click me!" forState:UIControlStateNormal];
    [self.view addSubview:firstButton];
}
```

That's a lot of code, so let's go through it piece by piece and see how it works.  First off, we notice that we are back in the `ViewController.m` file, in the `viewDidLoad` method.  If you remember from Level 1, we are loading the `ViewController`'s "main" UIView in an Interface Builder file.  By the time `viewDidLoad` is called, `self.view` has been set and is an instance of UIView, filling the entire screen of the app.  This gives us a good place to hook in and update the user interface.

We start by creating an instance of `UIButton` and just assigning it to a local variable named `firstButton`.

```
UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
```

We're using the `buttonWithType` method on `UIButton` and passing in an option called `UIButtonTypeRoundedRect`.  This option controls how the `UIButton` will look when it is drawn on the screen.  Here are the other values you could use for this option:

```
typedef enum {
   UIButtonTypeCustom = 0,
   UIButtonTypeRoundedRect,
   UIButtonTypeDetailDisclosure,
   UIButtonTypeInfoLight,
   UIButtonTypeInfoDark,
   UIButtonTypeContactAdd,
} UIButtonType;
```

**Note** Talk about enums?

After we've created our instance, we give it a `frame`.  Back in Level 1, when we created our first view, we assigned it a frame the full width and height of the screen, and positioned it at the very top left corner (point 0,0), thus ensuring the view filled the entire screen.  Well, we don't want our `firstButton` to fill the entire screen, so we have to create a `frame` that is smaller than the entire window.  We do this with `CGRectMake`:

```
firstButton.frame = CGRectMake(100, 100, 100, 44);
```

`CGRectMake` is a convienent function for creating `CGRect` objects that define the four values needed to create the `frame` of a view: 

* Number of points from the left of the view's container
* Number of points from the top of the view's container
* Number of points wide
* Number of points tall

**Note** points vs pixels?

So, using the `CGRectMake` function above, it means we want our `firstButtom` to be `100` points wide, `44` points high, and `100` points from both the top and left of the screen.  We didn't pick the `44` points number out of thin air, but instead we followed the [Apple Human Interface Guidelines for iOS](http://developer.apple.com/library/ios/#DOCUMENTATION/UserExperience/Conceptual/MobileHIG/Introduction/Introduction.html) (or HIG as commonly refered to) for the recommended size of clickable targets:

    The screen size of iOS-based devices might vary, but the average size of a fingertip does not. Regardless of the device your app runs on, following these guidelines ensures that people can comfortably use your app.

    Give tappable elements in your app a target area of about 44 x 44 points. The iPhone Calculator app is a good example of fingertip-size controls.
    
Next up, we set the title of the button, like so:

```
[firstButton setTitle:@"Click me!" forState:UIControlStateNormal];
```

You can pass in different options in the `forState` parameter to set the title based on the buttons state. For example, if you wanted the button's title to be "You're clicking me!" when the user's finger is touching the button, you would do:

```
[firstButton setTitle:@"Click me!" forState:UIControlStateNormal];
[firstButton setTitle:@"You're clicking me!" forState: UIControlStateHighlighted];
```

Okay, we are ready to build our app and run it in the simulator to see our nice new beautiful button!  Oops, where is it?  Well, we forgot one crucial step.  Just creating the `UIButton` instance and setting it's `frame` was not enough.  We actually need to add that `UIButton` instance as a `subview` of another view that is already on the screen.  Luckily, we already have a view, our `ViewController`'s `view` property holds a `UIView` that fills the screen, so if we had our `firstButton` as a subview, it will be displayed:

```
[self.view addSubview:firstButton];
```

Before we explain more about how this works, let's build and run our app (build and run and show it in simulator).

This is actually how the entire UI for an app is built:  by creating a "hierarchy" of views, they are position and shown above or below other views, depending on where they are in that hierarchy.  This is known as the "View Hierarchy".  Each view has one "superview" or "parent view", for example, our `firstButton`'s `superview` is the `self.view`.  Each view also has a list of `subviews`.  In our example, when we call `[self.view addSubview:firstButton]` we are adding `firstButton` to the end of `self.view`'s list of subviews, which in this case would consist of only 1 view, `firstButton`.

![image](http://yuml.me/bf7c4167)

If we were to add another subview to `self.view`, this time a `UILabel`, like so:

```
UILabel *firstLabel = [[UILabel alloc] initWithFrame:CGRectMake(100, 200, 200, 44)];
firstLabel.text = @"Hello I am a UILabel";
[self.view addSubview:firstLabel];
```

Then our diagram would look like this:

![image](http://yuml.me/ad879ca8)



### Challenge 1

A `UILabel` is another `UIView` subclass that does a specific task: displays read-only text.  In `viewDidLoad`, Create an instance of `UILabel`.  Make it 200 points wide and 44 points high.  Offset it 100 points from the left of the screen and 200 points from the top.  Set it's `text` property to `@"Hello I am a UILabel"`.  Then display it on screen by adding it to the `ViewController`'s root view list of subviews using `addSubview`.

#### Answer:

```
UILabel *firstLabel = [[UILabel alloc] initWithFrame:CGRectMake(100, 200, 200, 44)];
firstLabel.text = @"Hello I am a UILabel";
[self.view addSubview:firstLabel];
```

### Video 2

We've now successfully added a UIButton to our view, but it's not doing anything! We need to tell the button what to do when it is tapped.  If you remember from Level 1, we responded to the user tapping on our view by implementing the `-touchesEnded:withEvent:` method on our `ViewController`.  We could, if we wanted to, create a custom subclass of `UIButton` and implement `-touchesEnded:withEvent:` to run some code whenever the button is pressed, but that is overkill.  `UIButton`s are made to be pressed, so they have an API for handling presses.

Here is how you'd call a method named `buttonPressed:` on the `ViewController` whenever the `firstButton` is tapped:

```
[firstButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
```

The method `addTarget:action:forControlEvents:` is defined on the `UIControl` class, which `UIButton` and other controls inherit from.  What we are doing above is telling the button to call the `buttonPressed:` method (that's the action part) on the target `self` (the `ViewController` instance), whenever the control event `UIControlEventTouchUpInside` occurs.

Now, in `ViewController`, we have to define the `buttonPressed:` method:

```
- (void)buttonPressed:(id)sender
{
    NSLog(@"Button pressed, sender: %@", sender);
    self.view.alpha = ((double)arc4random() / 0x100000000);
}
```

**Note:** Cover @selector()?

Now, whenever the user taps the `firstButton` view, the `buttonPressed:` method will be called with one argument, the `UIControl` that caused the method to be called, in this case, the `UIButton` instance.  The method gets the `sender` as an argument because we could have a situation where multiple `UIControl`s pointed at the same method and we could use the `sender` parameter to tell which one fired the action.

We can use `NSLog` to see exactly what the `sender` argument is, by using the `%@` formatter.  `%@` is a placeholder like `%d` (which would display an int type), but for objects.

```
Button pressed, sender: <UIRoundedRectButton: 0x717c8a0; frame = (100 100; 100 44); opaque = NO; layer = <CALayer: 0x717bc30>>
```

Using this `sender` argument, we could do things like removing the button from the view after it is tapped, thus only allowing it to be tapped once.  We do this by calling the `removeFromSuperview` on the `sender`, like so:

```
- (void)buttonPressed:(UIButton *)sender
{
    NSLog(@"Button pressed, sender: %@", sender);
    self.view.alpha = ((double)arc4random() / 0x100000000);
    [sender removeFromSuperview];
}
```

We didn't know it before, but when we added `firstButton` to the list of `self.view`'s subviews, the button got a reference back to `self.view` as the buttons "superview".  The diagram would look like this:

![image](http://yuml.me/ea829d65)

That allows us to be able to remove a view (the `UIButton`) from it's superview by just calling `removeFromSuperview`.

**Build and Run**

We can also use the `sender` argument in a different way, to slightly change what the method does.  Let's say we had two buttons: one that makes the alpha of the view 50% and one that makes it 100%.  We could have both these buttons fire the same method when pressed, and the method could inspect the sender to figure out what value to set the alpha.

First, we create two buttons and give them the same action/target:

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor brownColor];
    
    UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    firstButton.frame = CGRectMake(100, 100, 100, 44);
    [firstButton setTitle:@"Make 50%!" forState:UIControlStateNormal];
    [firstButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:firstButton];
    
    UIButton *secondButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    secondButton.frame = CGRectMake(100, 150, 100, 44);
    [secondButton setTitle:@"Make 100%!" forState:UIControlStateNormal];
    [secondButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:secondButton];
}
```



Nowe we need to implement `buttonPressed:` to do two different things, set the alpha to `0.5` or `1.0`, depending on which button is pressed.  We can do that using the label text of the buttons:

```
- (void)buttonPressed:(UIButton *)sender
{    
    if ([sender.titleLabel.text isEqualToString:@"Make 50%!"]) {
        self.view.alpha = 0.5;
    }else{
        self.view.alpha = 1.0;
    }
    
}
```

We get the label text of the button with `sender.titleLabel.text`, and we if it's equal to the label text of the 50% button, we set the alpha to `0.5`, if not, we set it to `1.0`.

**Note** explain `isEqualToString:`


### Challenge 2

We've already created and added to the view a button called `makeYellowButton`.  We've also added a method to `ViewController` that will change the background color of the view to yellow.  Using `addTarget:action:forControlEvents:`, make it so that when the `makeYellowButton` is pressed, the `makeViewBackgroundYellow` method is called.

#### Answer:

```
@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    UIButton *makeYellowButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    makeYellowButton.frame = CGRectMake(100, 200, 120, 44);
    [makeYellowButton setTitle:@"Make Yellow!" forState:UIControlStateNormal];
    [makeYellowButton addTarget:self action:@selector(makeViewBackgroundYellow:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:makeYellowButton];
}


- (void)makeViewBackgroundYellow:(UIButton *)sender
{
    self.view.backgroundColor = [UIColor yellowColor];
}

```

### Challenge 3

We've created another button called `makeBrownButton` and added it to our View.  Unfortunately it currently has the same exact frame as `makeYellowButton`.  Change the frame of `makeBrownButton` so it's exactly 100 points below `makeYellowButton`.

#### Answer

```
UIButton *makeYellowButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
makeYellowButton.frame = CGRectMake(100, 100, 120, 44);
[makeYellowButton setTitle:@"Make Yellow!" forState:UIControlStateNormal];
[makeYellowButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:makeYellowButton];

UIButton *makeBrownButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
makeBrownButton.frame = CGRectMake(100, 244, 120, 44);
[makeBrownButton setTitle:@"Make Brown!" forState:UIControlStateNormal];
[makeBrownButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:makeBrownButton];
```

### Challenge 4

In the last challenge, you created 2 buttons that both called `changeBackgroundColor:` when tapped.  Update the `changeBackgroundColor:` method below to change the background color to brown when the `makeBrownButton` is pressed, and yellow when the `makeYellowButton` is pressed

#### Answer

```
- (void)changeBackgroundColor:(UIButton *)sender
{
    if ([sender.titleLabel.text isEqualToString:@"Make Brown!"]) {
        self.view.backgroundColor = [UIColor brownColor];
    }else{
        self.view.backgroundColor = [UIColor yellowColor];
    }
    
}
```

### Video 3

That `if` expression we saw in the last video is not really the best way to test for the identity of our buttons.  If we changed the title of the `"Make 50%!"` button, our `buttonPressed:` method would stop working.  

There is one much better way to do this: assigning those button instances in `viewDidLoad` to properties, instead of just local variables.  This will allow all instance methods of the `ViewController` to have access to these buttons.

Let's start by opening `ViewController.h` and adding the property definition for the `firstButton`:

```
#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

- (void)buttonPressed:(id)sender;

@property (weak, nonatomic) UIButton *firstButton;

@end
```

Here, we've named the property that same as the local variable we are using in `viewDidLoad`, but we didn't have to, we could have named it anything.  In fact, let's give it a better name:

```
@property (weak, nonatomic) UIButton *fiftyPercentButton;
```

You'll notice that we are using a `weak` reference to this property.  That means that our `ViewController` doesn't need to "own" this button, and doesn't care if the OS removes it from memory.  But of course, we don't want the OS removing this button from memory when it's being displayed to our user.  That would be bad (and most likely crash your app).  The `ViewController` doesn't need to "own" this button because when we add it to the root view's list of subviews, that root view will take ownership of the button and make sure it's not removed from memory.  

**NOTE: should we cover this?**

We've also declared the property `nonatomic`.  This is a pretty complicated subject, so for now we suggest just always using nonatomic because it is faster.

Now we can update our `viewDidLoad` code to use this property:

Original code:

```
UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
firstButton.frame = CGRectMake(100, 100, 100, 44);
[firstButton setTitle:@"Make 50%!" forState:UIControlStateNormal];
[firstButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:firstButton];
```

Using the property:

```
self.fiftyPercentButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
self.fiftyPercentButton.frame = CGRectMake(100, 100, 100, 44);
[self.fiftyPercentButton setTitle:@"Make 50%!" forState:UIControlStateNormal];
[self.fiftyPercentButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:self.fiftyPercentButton];
```

Instead of defining a new local variable using the `UIButton *` syntax, we just set the `fiftyPercentButton` property on `self` (which is the instance of `ViewController`).

Now that we have our button instance stored in an instance variable (as opposed to a local variable, which scope only lasts for the `viewDidLoad` call), we can update our `buttonPressed:` button to use this instance variable:

```
- (void)buttonPressed:(UIButton *)sender
{
    if (sender == self.fiftyPercentButton) {
        self.view.alpha = 0.5;
    }else{
        self.view.alpha = 1.0;
    }
}
```

### Challenge 5

In `ViewController.h`, declare a property for your `makeYellowButton` and `makeBrownButton`.  Make sure they are both `weak` references.

#### Answer:

```
#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

- (void)buttonPressed:(id)sender;

@property (weak) UIButton *makeYellowButton;
@property (weak) UIButton *makeBrownButton;

@end
```

### Challenge 6

Refactor your `viewDidLoad` method to use these newly defined properties.

#### Answer

```
self.makeYellowButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
self.makeYellowButton.frame = CGRectMake(100, 100, 120, 44);
[self.makeYellowButton setTitle:@"Make Yellow!" forState:UIControlStateNormal];
[self.makeYellowButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:self.makeYellowButton];

self.makeBrownButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
self.makeBrownButton.frame = CGRectMake(100, 244, 120, 44);
[self.makeBrownButton setTitle:@"Make Brown!" forState:UIControlStateNormal];
[self.makeBrownButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
[self.view addSubview:self.makeBrownButton];
```

### Challenge 7

Now we can finish by refactoring your `changeBackgroundColor:` method to use the instance variables to test which button has fired the method by comparing the sender.


#### Answer

```
- (void)changeBackgroundColor:(UIButton *)sender
{
    if (sender == self.makeBrownButton) {
        self.view.backgroundColor = [UIColor brownColor];
    }else{
        self.view.backgroundColor = [UIColor yellowColor];
    }
    
}
```

### Video 4

In Level 1 we introduced you to Interface Builder, but so far in Level 2 we've skipped using Interface Builder and instead created our interface in code.  But you don't have to create your interface in code (although some people prefer it that way), you can instead layout your interface in the Interface Builder tool.  Let's walk through refactoring our little app to use IB, and how the code we wrote earlier translates into what IB actually does.

First, let's add two UIButtons to our Interface:

![image](http://f.cl.ly/items/3Y0f3y3i0A1v3g3m0a2y/Resized%20Screen%202012-09-26%20at%2011.06.45%20AM.png)

And then just double click to set their titles:

![image](http://f.cl.ly/items/1f21241r0W3f0T3F2A1x/Resized%20Screen%202012-09-26%20at%2011.07.58%20AM.png)

If you click this little button here:

![image](http://f.cl.ly/items/1n3y1T340G2I3U311w2b/Resized%20Screen%202012-09-26%20at%2011.08.56%20AM.png)

You can view your View Hierarchy:

![image](http://f.cl.ly/items/3b120R1I3L1a0T450A2u/Resized%20Screen%202012-09-26%20at%2011.09.54%20AM.png)

When we added those buttons to our view, it added them as subviews of the root view, just like we did when we called `addSubview` in our code.  So now that we are creating buttons graphically, we can remove the code in `viewDidLoad`

**Build and run**

Oops, our buttons have seemed to stop working.  That's because we removed the `addTarget:action:forState` method calls. How do we get those back?  

We have to "connect" our IB buttons to the `buttonPressed:` method, just like we did with `addTarget:action:forState`.  When we select the button, and open the "Connections" tab in the Inspector to the right, we can see it doesn't have any connections:

![image](http://f.cl.ly/items/060u0k1L0q3A22061Z35/Resized%20Screen%202012-09-26%20at%2011.22.13%20AM.png)

We can give the button a new connection by holding down the CTRL key and dragging from the button to the "Files Owner" in the Document Outline.

**Show dragging**

Hmm, what is going on here?  Well, we need to change a little something in our code to let IB know what methods are available for connecting to controls in the interface.  We do this by "tagging" a method with `IBAction` in the `ViewController` header file, like so:

Before:

```
@interface ViewController : UIViewController

- (void)buttonPressed:(id)sender;

@end
```

After:

```
@interface ViewController : UIViewController

- (IBAction)buttonPressed:(id)sender;

@end
```

Now when we drag:

**Show dragging working**

And we can see now in our Connections Inspector that we have connection on the "Touch Up Inside" event:

![image](http://f.cl.ly/items/3H1V3y1h2j0E3H3F3t1X/Resized%20Screen%202012-09-26%20at%2011.28.18%20AM.png)

Now let's do the same for our other button.  When we build and run though, our app is still not working.  If we go back and inspect our `buttonPressed:` method, we can see the problem right away:

```
- (void)buttonPressed:(UIButton *)sender
{
    if (sender == self.fiftyPercentButton) {
        self.view.alpha = 0.5;
    }else{
        self.view.alpha = 1.0;
    }
}
```

We're no longer setting the `fiftyPercentButton` property in viewDidLoad, so `self.fiftyPercentButton` will return `nil`, instead of the instance of the `"Make 50%!"` button.  How do we make it so that when the button in IB is created, it is set as a property on our `ViewController`, so we can access it from anywhere in our controller instance?  

For that we need to tag our `fiftyPercentButton` `@property` declaration as being an `IBOutlet`.  So we go from this:

```
@property (weak, nonatomic) UIButton *fiftyPercentButton;
```

To this:

```
@property (weak, nonatomic) IBOutlet UIButton *fiftyPercentButton;
```

The final step is to create the connection between the button in IB and the `@property` in our `ViewController`.  We can again drag from the button in IB to the "File Owner" and select the `fiftyPercentButton` option:

![image](http://f.cl.ly/items/2C2j3Z2B2L194229392v/outletconnection.jpg)

Now you'll see we have set a "Referencing Outlet" in the Connection Inspector:

![image](http://f.cl.ly/items/3o0Y2T1y3G420m0Y3B1T/Resized%20Screen%202012-09-26%20at%2012.56.13%20PM.png)

Now when this nib file loads, it will create an instance of UIButton and set it to the `fiftyPercentButton` property on `ViewController` as well as hook up the target/action to `buttonPressed:`.

**Build and run**

### Challenge 8

Update your `ViewController.h` file to make the two properties `IBOutlets` and the method an `IBAction`, so the Nib file can use them:

#### Answer

```
- (IBAction)buttonPressed:(id)sender;

@property (weak) IBOutlet UIButton *makeYellowButton;
@property (weak) IBOutlet UIButton *makeBrownButton;
```


