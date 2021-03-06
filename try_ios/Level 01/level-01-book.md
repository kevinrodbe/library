## Level 1 Book

### Challenges
1. In the application:didFinishLaunchingWithOptions: method in the app delegate, use NSLog to output a string to the console, so you can see when this method is called. [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
2. In the application:didFinishLaunchingWithOptions: method in the app delegate, instantiate a UIWindow the size of the bounds of the screen. [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
3. Let’s try showing something to the user.  Create an instance of UIViewController, and make it the UIWindow’s rootViewController. [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
4. Instantiate a new UIView, set it’s background color to [UIColor greenColor], and make it the viewController instance’s view. [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
5. What’s going on, why don’t we see green?  We haven’t yet told the UIWindow that is should be the key window and visible.  Do that now.  (Might not need this) [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
6. It’s called Cocoa Touch for a reason.  Let’s change the alpha of the view whenever a person touches the screen.  To do that, we need to subclass UIViewController.  Update the AppDelegate to use ViewController, our new UIViewController subclass that we are about to create. (change this to just subclass ViewController for the viewDidLoad[b]) [code](https://github.com/envylabs/TryIOSContent/tree/v1b) *Look into using gesture recognizers* *look into using loadView, loadView for creating the objects, viewDidLoad for setting properties on the views, self.loadView*
7. You’ll see we’ve already defined a couple of methods in the ViewController implementation.  These two methods you will always want to override.  Move the UIView creation and setting from the AppDelegate into the viewDidLoad method in the ViewController. [code](https://github.com/envylabs/TryIOSContent/tree/v1a)
8. Now we have the perfect place to write the code that responds to touch events.  Implement the touchesEnded:withEvent: method in the implementation between the curly braces.  In the method definition, use NSLog to log the UIEvent object to the console using %@. [code](https://github.com/envylabs/TryIOSContent/tree/v1c)
9. Uncomment out the code in the touchesEnded:withEvent: that will set a random alpha value on the backgroundColor of our view.  Hit submit and see it in action in the simulator. [code](https://github.com/envylabs/TryIOSContent/tree/v1c)
10. Right now we only have 1 view, so it’s simple enough to do it in code, but Xcode ships with something called Interface Builder, that allows you to graphically layout your interface (aka views).  Interface Builder creates Xib files, which get turned into Nib files, which can be loaded by a UIViewController to construct the views for that controller.  We’ve gone ahead and created a Interface Builder (xib) file that has just 1 UIView in it, much like we had before, and named it ViewController.xib.  Update the instantiation of ViewController with initWithNibName to load in the xib file, and go ahead and remove the manual UIView instantiation in viewDidLoad. [code](https://github.com/envylabs/TryIOSContent/tree/v1d)

## Level 1

In order to write iPhone and iPad applications you're going to need to know a little Objective C.  If you're not comfortable with Objective C please go do one of the following:

* Complete **Level 0: An Objective-C Primer**.
* Watch this [CodeTV Screencast](http://www.codeschool.com) on the subject.
* ~~Read through [Learn Objective C](http://cocoadevcentral.com/d/learn_objectivec/)~~ (There are a lot of good things here but there is too much out-of-date and unnecessary information. I just realized this after reading through this last week - Chris)

Go to any bookstore and open up the first iOS development book you see and inevitably, the first
chapter will be all about Xcode.  Xcode is the IDE (Integrated Development Environment) from Apple used
to build iOS and Mac applications.  In this course we're going to encourage you to STAY away from XCode, don't even think about it.  That is because this course, as all other Code School courses, rests on the princicle of Learning by Doing.  And so we've built a completely browser based system for challenging you on what you are learning.  Don't worry though, as we go along we will be sure to point out Xcode resources that you can use to learn the IDE.

I suspect learning to build iPhone apps could feel a lot like learning to drive a submarine… you're going to look at some code or lets say.. interfaces, and there's going to be a ton of knobs and instruments.  If we sit down in the navigator's seat and attempt to explain what every single button does, you're never going to be able to set sail.  Our goal is to get you sailing as soon as possible, which means we're going to be ignoring some knobs or well.. methods and code along the way.  You're going to be seeing a lot of foreign looking instrumentation as we learn.. don't let it intimidate you.  Stay focused on what's in front of you.. try not to get too distracted.. and you'll be diving to the bottom of the ocean in no time.

#### Video 1

Together in this level we're going to build a Single View application. A view is simply an area of the screen that a user can interact with. The view we create will have a background color, and when we tap anywhere on the screen, the alpha transparency of the view will change.  Not terribly complex or interesting, but you have to start somewhere. 

![project files](http://cl.ly/image/0n0z1Z1Y0Y35/Screen%20Shot%202012-09-10%20at%204.05.24%20PM.png)

**The Application Delegate**

When we start a new Xcode project, we usually start out with a bunch of generated files such as `AppDelegate.h` and `AppDelegate.m`, which make up this application's `AppDelegate` class. 

The AppDelegate class defines methods that will be called at different points in the Application Lifecycle (we will cover more about the lifecycle in a future level). Every iPhone application has an AppDelegate, but this one is yours.  One method that you will commonly want to implement is the
`application:didFinishLaunchingWithOptions:` method, that will get called by the OS whenever your application is launched.  But how will we know when it is called?  We can use NSLog inside the method definition, and build and run the application in the iOS simulator and we can see that the string was logged. In case you're not familiar, here is an example of how to use NSLog:

```
NSLog(@"Hello World");
```

Notice the @ symbol before the string and the semicolon at the end of the line.  Now go ahead and add this inside the function.

#### Challenge 1

- AppDelegate.h
- AppDelegate.m

In the application:didFinishLaunchingWithOptions: method in the app delegate, use NSLog to output a string (any string you like) to the console, so you can see when this method is called.

```
# AppDelegate.m

#import "AppDelegate.h"

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSLog(@"Application Did Finish Launching"); 
    return YES;
}
@end

```

-----


Congratulations on running your first iPhone application!  But just logging to the console is not going to get you too high up the App Store best-sellers list.  Let's display someone on the screen for our hypothetical users to interact with.  To do that, we are going to need three things: A Window, a View Controller, and a View.

### The Window

First steps first, we need to figure out how big our iPhone screen is.  To do this we can tell the UIScreen class to send us the mainScreen for our app, and then send the bounds message into the UIScreen instance we received to get back a CGRect instance, like so:

```
CGRect viewRect = [[UIScreen mainScreen] bounds];
```

Apple maintains great developer documentation on these common classes, so if you ever want to learn about the properties on such an object just head over there and search for UIScreen or CGRect to learn about these classes and how they can be used.  All these methods are linked below the video.

[UIScreen Class Reference](http://developer.apple.com/library/ios/#documentation/uikit/reference/UIScreen_Class/Reference/UIScreen.html)

[UIWindow Class Reference](http://developer.apple.com/library/ios/#documentation/UIKit/Reference/UIWindow_Class/UIWindowClassReference/UIWindowClassReference.html)

Now `viewRect` is a CGRect object that defines the "bounds" of the screen.  We can verify this works properly by changing our Log to do something like:

```
CGRect viewRect = [[UIScreen mainScreen] bounds];
NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
```

When we run this code, you can see that it prints: 

2012-09-24 18:36:30.269 AlphaTouch[19157:c07] Screen is 480.000000 tall and 320.000000 wide

Now that we have the bounds, we can start drawing on it right?  Well not quite, just like a painter needs a canvas to start drawing on we need a canvas or "Window" in our case.

In iOS, the `UIWindow` objects provide an area of an application to display it's views. iOS apps generally only have one UIWindow unless views need to be displayed on multiple screens. Often, the UIWindow is created in the `application:didFinishLaunchingWithOptions:` method and then left alone (there isn't much you need it for after that). Let's instantiate our `UIWindow` now and give it a `CGRect` so it knows how big to draw itself:
 
```
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	CGRect viewRect = [[UIScreen mainScreen] bounds];
	UIWindow *window = [[UIWindow alloc] initWithFrame:viewRect];
	
	NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
@end
```

Here we are creating a new UIWindow instance called window.  To do this we are "alloc"ating memory for a new UIWindow, then calling initWithFrame on this new object, sending it the viewRect we created.

There is a problem here, though. When the `application:didFinishLaunchingWithOptions:` method is executed and returns, that `window` variable will go away, and we won't be able to get to it again in case we need it. However, there is an easy fix:  Our AppDelegate header file was generated with a `UIWindow` property named `window`.  If we open it up we can see it right here:

```
@property (strong, nonatomic) UIWindow *window;
```

So let's use property syntax to assign the UIWindow to this property `self.window`, like so:

```
@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    
    NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
@end
```

TODO: Not a fan of this challenge, come back.

#### Challenge 2

- AppDelegate.h
- AppDelegate.m

In the application:didFinishLaunchingWithOptions: method in the app delegate, instantiate a `UIWindow` the size of the bounds of the screen.

```
# AppDelegate.m

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    
    NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
@end
```

----

##### Challenge 3

- AppDelegate.h
- AppDelegate.m

Next up is we have to tell the UIWindow that it's the key window (the window that should receive keyboard and other non-touch related events), and that it should be visible to the user.  We do this by sending `makeKeyAndVisible` to the self.window instance the line after we set the self.window.  Go ahead and try this below.

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    [self.window makeKeyAndVisible];
    
    NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
```

But still: the user sees nothing but a black screen (although it [could be worse](http://www.maximumpc.com/files/u69/BSOD_Main.png)) and we get a log message telling us "Application windows are expected to have a root view controller at the end of application launch".  

### View Controllers

If the `window` is the canvas, than you can think of a View Controller as the paintbrush (and the View would be the paint, which we'll get to in a bit).  We need some object that controls what is put on the screen, and that object is a `UIViewController` instance.  It does exactly what it says: it controls views.  A "View" is an actual thing the user can see (like a button), and the View Controller is there to take that Button (`view`) and put it in the canvas (`window`).  

#### Challenge 4

- AppDelegate.h
- AppDelegate.m

Since `window.rootViewController` expects an instance of UIViewController, let's alloc/init
one and assign it:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    UIViewController *viewController = [[UIViewController alloc] init];
    self.window.rootReviewController = viewController;
    [self.window makeKeyAndVisible];
    
    NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
```

Great, no more log message that we're missing a root view controller this time.  But wait, now what?  We keep doing these things, and yet the user sits there, bored.  Don't worry, we are very close.  

### Views

We just created the canvas (UIWindow), grabbed our favorite paintbrush (ViewController), and finally it's time to put some paint (View) on the canvas that is our app. Eventually, your app will have many view objects (everything you see in an iPhone app is a view, even from the smallest text label).  Each view represents something on the screen.  It is, quite literally, the paint.  

#### Challenge 5

- AppDelegate.h
- AppDelegate.m

Since we already have created our `rootViewController` instance, we can create an instance of `UIView` and set the `rootViewController.view` property, like so:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    UIViewController *viewController = [[UIViewController alloc] init];
    UIView *view = [[UIView alloc] initWithFrame:viewRect];
    viewController.view = view;
    self.window.rootReviewController = viewController;
   
    [self.window makeKeyAndVisible];
    
    NSLog(@"Screen is %f tall and %f wide", viewRect.size.height, viewRect.size.width);
    return YES;
}
```

As you can see, when we created our view with `initWithFrame`, we passed in the same
`bounds` object that we did when we initialized our `UIWindow` object.  This means that our new view instance will take up the entire window.  We could have passed in a different `bounds` object, with smaller dimensions, and made the view instance take up a subset of space in the window. 

TODO: Thinking about doing this.. smaller box as a challenge.

Before we hit the `Build and Run` button, let's give our new View a background color so
when we run our app, we'll finally see something other than a black void:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    UIViewController *viewController = [[UIViewController alloc] init];
    UIView *view = [[UIView alloc] initWithFrame:viewRect];
    
    view.backgroundColor = [UIColor purpleColor];
    viewController.view = view;
    self.window.rootViewController = viewController;

    [self.window makeKeyAndVisible];
    
    NSLog(@"Application Did Finish Launching");
    return YES;
}
```

TODO: Consider making changing the UIColor a challenge.  Look up another color in documentation.

And after hitting 'Build and Run', we get this beauty:

![Our first View](http://f.cl.ly/items/3S270E2T2z0F1S403e0O/Resized%20Screen%202012-09-10%20at%2010.06.11%20PM.png)

### Cleaning Things Up

Before we move on to the exciting things like allowing the user to touch the screen, we have some cleanup to do.  When we generated our project it created for us a ViewController.m and ViewController.h, but we haven't been using it, we created our own UIViewController from scratch.  

If we open up ViewController.h here's what we'll see:

```
#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

@end
```

So this is saying that the ViewController class is a subclass of `UIViewController`.  The answer to *where do I put this code?* in iOS development is, very often, **in a subclass**.  We create a own application specific *subclass* and implement methods defined in the parent class (or *superclass*).

So, lets modify our AppDelegate code to use this ViewController (do a magic move in the slides)

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    self.window = [[UIWindow alloc] initWithFrame:viewRect];
    self.viewController = [[ViewController alloc] init];  // Added self.
    UIView *view = [[UIView alloc] initWithFrame:viewRect];
    
    view.backgroundColor = [UIColor purpleColor];
    self.viewController.view = view; // Added self.
    self.window.rootViewController = self.viewController; // Added self.
    
    [self.window makeKeyAndVisible];
    
    NSLog(@"Application Did Finish Launching");
    
    return YES;
}

```

Notice how we have to add self. to all references of viewController, and if we run the code we can see that it still works properly.. woohoo!  

Now comes actually "cleaning-up" of our code.  As we mentioned above, it's our View Controller which is in charge of the views and the data, so we need to move the `UIView` we created here in our AppDelegate into the `ViewController` class.  This is a good time to peek inside our `ViewController.m`:

```
#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
```

The first line simply includes our header (you should already know that). Next, it looks like we are re-defining our `ViewController` class, but that's not the case. Notice the parenthesis? This means we are creating a `category`. All you need to remember is that if the `ViewController` class has any private methods, they should be declared in here. If that doesn't make sense, don't worry, it's not critical right now.

> Coding Tip:
>
> Normally a `category` will be assigned a name. Category names are placed inside the parenthesis on the line the category is defined. Here's an example of a `ViewController` category called `WebUtililties`:
>
> `@interface ViewController (WebUtililties)`
>
> By default, with the creation of a new subclass, Xcode creates an unnamed `category` (i.e. a `category` with empty parenthesis). This is simply a pattern used to when creating categories that only hold private methods and won't be shared.

Next, the `ViewController` has a `viewDidLoad` method. This is a `UIViewController` method that gets called when the `view` `@property` of the `UIViewController` is given a non-nil `UIView`. In other words, when the view controller gets a view, `viewDidLoad` is called to setup the view.

As it stands we don't have a good place to actually *instantiate* our `UIView` so let's override a `UIViewController` method called `loadView`.

```
- (void)loadView
{

}
```

`loadView` is called **automatically** by the OS when the view is needed and it has not yet been created (this means views are "[lazily-loaded](http://en.wikipedia.org/wiki/Lazy_loading)"). Don't ever call this method, let the OS handle that. This is where you will want to actually instantiate your view. Let's move those lines that create the view from the App Delegate over to this method.

Remember these lines over in our AppDelegate:

```
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    UIView *view = [[UIView alloc] initWithFrame:viewRect];
    self.viewController.view = view;
```

(Show both method definitions on the same slide and do a Magic Move so we can see the before and after for each method.. if it works.)

```
- (void)loadView
{
    CGRect viewRect = [[UIScreen mainScreen] bounds];
    UIView *view = [[UIView alloc] initWithFrame:viewRect];
    self.view = view;  // <--- This line changed slightly
}
```

Notice we didn't carry over the background color or anything else that didn't have to do with setting up the view. This is because there is a method to take care of that called `viewDidLoad`. It's very important that you make sure only create views in the `loadView` method and only setup the views in the `viewDidLoad` method. There's some magic going on behind the scenes and you will almost certainly run into trouble if you don't adhere to this. Let's update our `viewDidLoad` method now to setup the view.

```
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    self.view.backgroundColor = [UIColor purpleColor];
}
```

Great! Notice that this method makes a call to `super`. That's important because the in a more complex app a super class may be responsible for setting up some of the view. Also, notice that we **did not** call `super` in the `loadView` method. This is because the view only needs to be instantiated once.

Go ahead and run the app and you'll see that it still works! (this might be a good time for a diagram showing responsibilities… i.e. AppDelegate vs ViewController vs View.. maybe talk about rootViewController in it… just review)

Now, I have a confession to make.  Three of these lines aren't even needed and the code will still work.  By default if we don't create a `view` for our View Controller, it will automatically create one for us and also set it to the bounds of our screen. Yeah, pretty cool huh? This means we can completely get rid of the `loadView` method.

### Touch

#### Video

We need some way of specifying what happens when a touch occurs on our device. More specifically we need to be able to specify what code to execute when a touch event occurs.  To get started lets figure out how to print out a log message every time someone starts touching the screen. 

```
NSLog(@"Started touching the Screen");
```

Obviously your application is going to have different views (interfaces) and each of these views may be associated with one or more ViewController. You might want to listen for touch events at the ViewController level or more commonly at the View level.  For now lets listen for touches on our ViewController.

Our ViewController has a parent class of UIViewController and the UIViewController has a parent class of UIResponder (show visual).  The UIResponder class defines an interface for objects that respond to and handle events. So to start listening for events in our ViewController we just have to implement specific methods that get called when touch events occur.  

If you take a look in [the documentation for UIResponder](http://developer.apple.com/library/ios/#documentation/uikit/reference/UIResponder_Class/Reference/Reference.html), you'll find all sorts of methods which allow you to listen for touches and even motion, so when you shake your phone you can make your app do something. (show a list)

The one we're interested in (highlight is) touchesBegan:withEvent:, lets define this inside our ViewController so we can log out when a finger begins touching the screen.

So now in our implementation file, `ViewController.m`, we can override the 
`touchesBegan:withEvent:` method to do something when a touch happens:

```
@implementation ViewController

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    NSLog(@"Started touching the Screen");
}
@end
```

Now when we run this code when we click we get the appropriate log message.  Sweet!

#### Challenge 6 

- ViewController.m

Listen for the touchesEnded event log when we stop touching the screen.

```
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    NSLog(@"Stopped touching the screen");
}
```

#### Challenge 7

- AppDelegate.h
- AppDelegate.m
- ViewController.m
- ViewController.h

Now let's finish up by filling in some code in the `touchesEnded:withEvent:` method definition that will set the alpha transparency of the view to a random value between `0.0` and `1.0`. This should change the brightness of the background color you set.

```
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    self.view.alpha = ((double)arc4random() / 0x100000000);
}
```