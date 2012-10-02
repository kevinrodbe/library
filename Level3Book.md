## Level 3

![image](http://developer.apple.com/library/ios/DOCUMENTATION/WindowsViews/Conceptual/ViewControllerCatalog/Art/NavigationViews.png)

Create tab view controller in code with three tabs, "Feed", "Favorites", and "Profile".  

Navigation Controller:

Have a profile a screen that shows information, and when tapping on the image view it will transition to the next screen with a full image.

Talk about Categories (UIImageView+initWithImageName)

## Content

### Video 1

So far in the first two levels we've had a single "canvas" to paint on.  One view controller, and one view.  In iOS, a single view should only really have one main purpose.  But what if we wanted to have an application with more than 1 view?  Take for example the "Clock" application made by Apple:

![image](file:///Users/eric/Library/Developer/Shared/Documentation/DocSets/com.apple.adc.documentation.AppleiOS6.0.iOSLibrary.docset/Contents/Resources/Documents/documentation/UIKit/Reference/UITabBarController_Class/Art/tabbar_compare.jpg)

It has 4 different "functions": World Clock, Alarm, Stopwatch, and Timer.  Each of these options  bring up completely different views, they completely repaint the "canvas" to have the best interface for the task at hand.

This is a very common pattern in iOS apps. Just within the default Apple apps, we see this used in Clock, Music, App Store, iTunes, Photos, Phone, and Podcast. Since it is a very common pattern, Apple wanted a way for 3rd party developers (that's you!) to implement the same pattern, and to make it easy. So they created a subclass of `UIViewController` called `UITabBarController` to do just that. Just like `UILabel` is a specialized subclass of `UIView`, so is `UITabBarController` a specialized subclass of `UIViewController`.

`UIViewControllers` that hold or contain other `UIViewControllers` are called "Container View Controllers". This is common terminology that you should know.

There are other subclasses of `UIViewController` that Apple provides, which we will be covering a bit later, but let's start with learning how to use `UITabBarController`.

`UITabBarController`'s are designed to work *as-is* which means you shouldn't create a custom subclass.  Just use `alloc/init` to create an instance in your `AppDelegate`:

```
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    
    self.window.rootViewController = tabBarController;
    [self.window makeKeyAndVisible];
    return YES;
}
```

As you can see, instead of setting the `rootViewController` of our window to a `UIViewController`, we set it to our newly created `UITabBarController` instance, `tabBarController`.  A `UITabBarController` usually has two or more tab bar items along the bottom tab bar. Each tab bar item points to a custom `UIViewController`, which is responsible for the UI displayed when it's corresponding tab bar item is selected.

To see this in action, we are going to create two custom `UIViewController`s, `FirstViewController` and `SecondViewController`.  Here are the header files:

```
// FirstViewController.h

@interface FirstViewController : UIViewController

@end
```

```
// SecondViewController.h

@interface SecondViewController : UIViewController

@end
```

And the implementation files:

```
// FirstViewController.m

#import "FirstViewController.h"

@implementation FirstViewController
							
- (void)viewDidLoad
{
    [super viewDidLoad];
}

@end
```

```
// SecondViewController.m

#import "SecondViewController.h"

@implementation SecondViewController
							
- (void)viewDidLoad
{
    [super viewDidLoad];
}

@end
```

Now all we have to do is create isntances of our two view controllers tell our tab bar controller that these two controllers should be used:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.tabBarController = [[UITabBarController alloc] init];
    
    UIViewController *viewController1 = [[FirstViewController alloc] init];
    viewController1.title = @"First";
    UIViewController *viewController2 = [[SecondViewController alloc] init];
    viewController1.title = @"Second";
    self.tabBarController.viewControllers = @[viewController1, viewController2];
    
    self.window.rootViewController = self.tabBarController;
    [self.window makeKeyAndVisible];
    return YES;
}
```

**Note** We are using the new Objectice-C Array literal when setting the `viewControllers` property of our `tabBarController`.  `@[viewController1, viewcontroller2]` will create an NSArray with our 2 view controller instances as items.  This is much simpler (and less error prone) than what we'd previously have to do:  `[NSArray arrayWithObjects: viewController1, viewController2, nil];`

**Build and Run**

### Challenge 1

Create three ViewControllers for our InstaPhoto app (that will correspond to the three items we want in the tab bar), "FeedViewController", "FavoritesViewController", and "ProfileViewController".

#### Answer

```
// FeedViewController.h
#import <UIKit/UIKit.h>

@interface FeedViewController : UIViewController

@end

// FeedViewController.m
#import "FeedViewController.h"

@implementation FeedViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

@end

//etc.
```

### Challenge 2:

In the AppDelegate below, create a new instance of UITabBarController and set it as the UIWindow's rootViewController:

#### Answer

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.tabBarController = [[UITabBarController alloc] init];
    self.window.rootViewController = self.tabBarController;
    [self.window makeKeyAndVisible];
    return YES;
}
```

### Challenge 3:

In the AppDelegate, create an instance of each of the view controller's and set their titles to `@"Feed"`, `@"Favorites"`, and `@"Profile"` respectively.  Then go ahead and make them the `UITabBarController's` tabs, in that order.

#### Answer

```
#import "AppDelegate.h"

#import "FeedViewController.h"
#import "FavoritesViewController.h"
#import "ProfileViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    // Override point for customization after application launch.
    self.tabBarController = [[UITabBarController alloc] init];
    
    FeedViewController *feedViewController = [[FeedViewController alloc] init];
    feedViewController.title = @"Feed";
    
    FavoritesViewController *favoritesViewController = [[FavoritesViewController alloc] init];
    favoritesViewController.title = @"Favorites";
    
    ProfileViewController *profileViewController = [[ProfileViewController alloc] init];
    profileViewController.title = @"Profile";
    
    self.tabBarController.viewControllers = @[feedViewController, favoritesViewController, profileViewController];
    
    self.window.rootViewController = self.tabBarController;
    [self.window makeKeyAndVisible];
    return YES;
}

@end
```

### Video 2

Right now our Tab Bars are a little boring and are just showing the titles of their corresponding View Controller.  As you probably already know, in most applications each Tab Bar Item has a little icon to represent what the function of that tab is.  To set the image associated with the tab, we have to access the `tabBarItem` property on our View Controllers.

If we go into our `AppDelegate.m` and use `NSLog` to inspect the `tabBarItem` of our `viewController1`, we can see that `tabBarItem` is an instance of `UITabBarItem`:

`NSLog(@"viewController1 tabBarItem: %@", viewController1.tabBarItem);`

`viewController2 tabBarItem: <UITabBarItem: 0xb0657c0>`

We can then head over to the [UITabBarItem Class Reference](http://developer.apple.com/library/ios/#DOCUMENTATION/UIKit/Reference/UITabBarItem_Class/Reference/Reference.html) and look up the properties that we can set to customize the tab bar item, and we can see that there are no properties for setting the image.  But if you look at the top of that file, you can see `UITabBarItem` inherits from `UIBarItem`:

![image](http://f.cl.ly/items/222X0r320r1Q3T3p232U/Screen%20Shot%202012-10-02%20at%209.46.34%20AM.png)

If we click on that link, we are taken to the [UIBarItem Class Reference](http://developer.apple.com/library/ios/#DOCUMENTATION/UIKit/Reference/UIBarItem_Class/Reference/Reference.html#//apple_ref/occ/cl/UIBarItem) where we find that `image` is a property of type `UIImage`, and has this description:

> This image can be used to create other images to represent this item on the bar—for example, a selected and unselected image may be derived from this image. You should set this property before adding the item to a bar. The default value is nil.

So now we know how to set `tabBarItem` image on our view controllers:

```
@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
 
    UIViewController *viewController1 = [[FirstViewController alloc] init];
    viewController1.title = @"First";
    UIViewController *viewController2 = [[SecondViewController alloc] init];
    viewController2.title = @"Second";

    viewController1.tabBarItem.image = [UIImage imageNamed:@"first"];
    viewController2.tabBarItem.image = [UIImage imageNamed:@"second"];
    
    self.tabBarController = [[UITabBarController alloc] init];
    self.tabBarController.viewControllers = @[viewController1, viewController2];
    self.window.rootViewController = self.tabBarController;
    [self.window makeKeyAndVisible];
    return YES;
}
```

`[UIImage imageNamed:@"first"]` will return an instance of `UIImage`, and `@"first"` is the name of an image we have added to our project (with it's 2x variant for retina screens):

![image](http://f.cl.ly/items/1Q302a1V2z2s3H3H1o0R/Screen%20Shot%202012-10-02%20at%209.50.14%20AM.png)

So far so good!  But at this point, our code could use a little refactoring.  We shouldn't be setting the title and tabBarItem's for these view controllers in the AppDelegate, but instead we should set them in the View Controller's themselves.  So where should we move the title and image setting code to in the controller's?  We could try and use `loadView`, since that is called whenever the view controller's view is loaded, that should work, right?

```
- (void)loadView
{
    self.title = @"First";
    self.tabBarItem.image = [UIImage imageNamed:@"first"];
}
```

But then when we build and run, we can see that something isn't working:

![image](http://f.cl.ly/items/2Q180T1G330K02301m14/Resized%20Screen%202012-10-02%20at%2010.13.35%20AM.png)

Only when we tap on the second tab bar does it load it's title and image:

![image](http://f.cl.ly/items/1U0a1V3Y0p2W0C3e0T0v/Resized%20Screen%202012-10-02%20at%2010.13.48%20AM.png)

This is because `loadView` is only called once the `view` property is accessed on the View Controller, and the `SecondViewController`'s view doesn't need to be loaded until it is accessed.  We need to set the title and image when the view controller instance is first created.  To do this, we can override the `initWithNibName:bundle:nibBundleOrNil` method on the view controller, like this:

```
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    self.title = @"First";
    self.tabBarItem.image = [UIImage imageNamed:@"first"];
    
    return self;
}
```

This method is called internally whenever a `UIViewController` instance is created.  So when we call `[[FirstViewController alloc] init];` in our AppDelegate, the `initWithNibName:bundle:nibBundleOrNil` method is called.  We have to call the `super` method first, which will return an instance of `FirstViewController` and we assign that to `self`.  This works even though we don't have a nib file for this view controller.  So now when we build and run, you can see that both tabs are filled out on first load:

![image](http://f.cl.ly/items/132T093z1U1A3y220k06/Resized%20Screen%202012-10-02%20at%2010.22.42%20AM.png)

### Challenge 4

We've created and added 3 images for use in the tab bars, "feed", "favorites", and "profile".  In each of the view controllers below, set the title and the tabBarItem.image in the `initWithNibName:bundle:nibBundleOrNil` method.

#### Answer:

**FeedViewController.m**

```
#import "FeedViewController.h"

@implementation FeedViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    self.title = @"Feed";
    self.tabBarItem.image = [UIImage imageNamed:@"feed"];
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

@end
```

etc.

### Video 3


