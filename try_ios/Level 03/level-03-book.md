## Level 3

### Goals

* Learn how to work with more than one view controller.
* Introduction to UITabBarController.
	* User will create the three InstaPhoto tabs: "Feed", "Favorites", and "Profile".
* Introduction to UINavigationController.
	* User will create a navigation controller in the profile tab that lets the user see a bigger version of their profile picture.
* Learn a little about UIImage and UIImageView.

### User Knowledge Assumptions

* Basic Objective-C knowledge.
* Understands how to use NSArrays.
* Understands UIViews and UIViewControllers.
* Understands the role of the App Delegate.
* Understands the difference between the `loadView` and `viewDidLoad` methods.
* Understands how to attach an action to a `UIButton` (covered in Level 2).

### Video



## Challenege 1

### Video

So far in the first two levels we've had a single "canvas" to paint on.  One view controller, and one view.  In iOS, a single view controller should only really have one main purpose. But what if we wanted to create an app with multiple views that perform different tasks? We wouldn't want one view controller controlling all of them! Take for example the "Clock" application made by Apple:

![image](http://developer.apple.com/library/ios/Documentation/UIKit/Reference/UITabBarController_Class/Art/tabbar_compare.jpg)

The Clock app has 4 different "functions": World Clock, Alarm, Stopwatch, and Timer. Each of these options brings up very different views. They completely repaint the "canvas" to have the best interface for the task at hand.

This is a very common pattern in iOS apps. Just within the default Apple apps, we see this used in Clock, Music, App Store, iTunes, Photos, Phone, and Podcast. Since it is a very common pattern, Apple wanted a way for 3rd party developers (that's you!) to easily implement the same pattern. Thus, they created a subclass of `UIViewController` called `UITabBarController` to do just that.

`UIViewControllers` that hold or contain other `UIViewControllers` are called "Container View Controllers". This is common terminology that you should remember.

There are other subclasses of `UIViewController` that Apple provides, which we will be covering a bit later, but let's start with learning how to use `UITabBarController`.

`UITabBarController`'s are designed to work *as-is* which means you shouldn't create a custom subclass. In the latest version of iOS, Apple provides some options for customization. Just use `alloc` and `init` to create an instance of a `UITabBarController`:

```
UITabBarController *tabBarController = [[UITabBarController alloc] init];
```

Once you've created a `UITabBarController` you'll need to give it the `UIViewControllers` you want it to manage and display. You can do this by calling the `setViewControllers:` method:

```
[tabBarController setViewControllers:@[viewController1, viewController2, viewController3]];
```

You'll notice that we are using Objective-C's *literal array syntax*. `@[]` is just a short-hand way of saying "make an array with the objects inside the brackets". We could have written this equivalently:

```
[tabBarController setViewControllers:[[NSArray alloc] initWithObjects:viewController1, viewController2, viewController3, nil]];
```

Note that the `UITabBarController` will arrange the view controllers in the tab bar just like they are arranged in the array you pass in.

If we were to simply create some view controllers and give them to the UITabBarController we would see something like this:

![empty tabs](https://dl.dropbox.com/s/xsqjh7ogmkx257l/tabbar_blank_tabs.png)

That's not helpful. To get a title to show we'll modify a `@property` of `UIViewController` called `title`. This is used for a few things, one of them being setting the tab bar title. We can set the property like this:

```
viewController1.title = @"view 1";
```

Pretty simple. With this knowledge you're ready to write some code!

### Challenge Instruction

In the App Delegate's `application:didFinishLaunchingWithOptions:` method create a UITabBarController and give it at least two generic UIViewControllers to display. Make sure to give the view controllers titles.

**Bonus:** If you want to get fancy try changing each view controllers `view`'s background color using what you learned in the previous levels. Hint: use `setBackgroundColor:` and `[UIColor <colorName>]`.

### Answer

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    UIViewController *viewController1 = [[UIViewController alloc] init];
    viewController1.title = @"view 1";
    UIViewController *viewController2 = [[UIViewController alloc] init];
    viewController2.title = @"view 2";
    UIViewController *viewController3 = [[UIViewController alloc] init];
    viewController3.title = @"view 3";
    
    viewController1.view.backgroundColor = [UIColor purpleColor]; // This is optional
    viewController2.view.backgroundColor = [UIColor redColor]; // This is optional
    viewController3.view.backgroundColor = [UIColor lightGrayColor]; // This is optional
    
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    [tabBarController setViewControllers:@[viewController1, viewController2, viewController3]];
        
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = tabBarController;
    [self.window makeKeyAndVisible];
    
    return YES;
}
```

## Challenge 2

### Video

Great job! Now that you're comfortable with using the `UITabBarController`, it's time to introduce the app you'll be building throughout the remainder of this course…

Presenting: InstaPhoto.

InstaPhoto is an app that lets users easily browse photos uploaded to the InstaPhoto service, save favorites, and manage their profile. There's a ton of work that goes into making an app like this (far beyond the scope of this course). Our goal is not to have you complete the course with an app-store ready app but to help you overcome the hurdles you will face when writing an app that *you* actually want to write. InstaPhoto is a great app to walk through because along the way you'll be able to use many native controls, get experience writing networking code, use and optimize table views, container views, store data, and much more.

InstaPhoto will feature three main sections: a Feed view, a Favorites view, and a Profile view. These will be represented by the following view controllers, respectively: "FeedViewController", "FavoritesViewController", and "ProfileViewController".

Let's go ahead and setup our initial `UIViewControllers` now. We'll create the classes for you. Make sure you give them a look  in the project navigator though.

### Challenge Instruction

Instantiate the new InstaPhoto view controllers (FeedViewController, FavoritesViewController, ProfileViewController) using `alloc` and `init` and add them to the tab bar. Give them the following titles, respectively: "Feed", "Favorites", and "Profile".

### Answer

```
#import "AppDelegate.h"
#import "FeedViewController.h"
#import "FavoritesViewController.h"
#import "ProfileViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    FeedViewController *feedViewController = [[FeedViewController alloc] init];
    feedViewController.title = @"Feed";
    
    FavoritesViewController *favoritesViewController = [[FavoritesViewController alloc] init];
    favoritesViewController.title = @"Favorites";
    
    ProfileViewController *profileViewController = [[ProfileViewController alloc] init];
    profileViewController.title = @"Profile";
    
    self.tabBarController.viewControllers = @[feedViewController, favoritesViewController, profileViewController];
        
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = tabBarController;
    [self.window makeKeyAndVisible];
    
    return YES;
}
```

## Challenge 3

### Video

Right now our tab bar is a little boring. We are just showing the titles of their corresponding View Controllers. Most apps place a little icon in the tab to represent what the function of that tab is. To set the image associated with the tab, we have to access the `tabBarItem` `@property` on our view controllers.

In Xcode, if we wanted to discover more about a particular `@property` or class, we could hold the `option`/`alt` key and left click on the item and documentation would appear:

![image](https://dl.dropbox.com/s/f1wmbquayyako8v/xcode_documentation_help.png)

We see that it's a UITabBarItem and even have nice little links right to the documentation! Since you don't have this we'll give you the link: If you check out [UITabBarItem Class Reference](http://developer.apple.com/library/ios/#DOCUMENTATION/UIKit/Reference/UITabBarItem_Class/Reference/Reference.html) you'll notice there isn't a property or method for setting the tab bar image! Before posting on StackOverflow you should do some more investigation. At the top of the page you'll see that `UITabBarItem` inherits from `UIBarItem`:

![image](http://f.cl.ly/items/222X0r320r1Q3T3p232U/Screen%20Shot%202012-10-02%20at%209.46.34%20AM.png)

If we click on that link, we are taken to the [UIBarItem Class Reference](http://developer.apple.com/library/ios/#DOCUMENTATION/UIKit/Reference/UIBarItem_Class/Reference/Reference.html#//apple_ref/occ/cl/UIBarItem) where we find that `image` is a property of type `UIImage`, and has this description:

> This image can be used to create other images to represent this item on the bar—for example, a selected and unselected image may be derived from this image. You should set this property before adding the item to a bar. The default value is nil.

That's just what we need. Before we get to the code, I'll need to give you a quick run-down of `UIImage`:

* `UIImage`'s represent a PNG or JPG.
* You can create a `UIImage` by calling `[UIImage imageNamed:@"image-name"]`. Notice you don't need to specify the type of image, just the name of the image in your project navigator. 
* Also you don't need to `alloc` or `init`.

Let's try setting the images now. We'll add some images files for you to the project navigator.

### Challenge Instruction

Using the `image` `@property` of `tabBarItem` set the following images for the view controllers:

* FeedViewController: "tab_icon_feed"
* FavoritesViewController: "tab_icon_favorites"
* ProfileViewController: "tab_icon_profile"

### Answer

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    FeedViewController *feedViewController = [[FeedViewController alloc] init];
    feedViewController.title = @"Feed";
    feedViewController.tabBarItem.image = [UIImage imageNamed:@"tab_icon_feed"];
    
    FavoritesViewController *favoritesViewController = [[FavoritesViewController alloc] init];
    favoritesViewController.title = @"Favorites";
    favoritesViewController.tabBarItem.image = [UIImage imageNamed:@"tab_icon_favorites"];
    
    ProfileViewController *profileViewController = [[ProfileViewController alloc] init];
    profileViewController.title = @"Profile";
    profileViewController.tabBarItem.image = [UIImage imageNamed:@"tab_icon_profile"];
    
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.viewControllers = @[feedViewController, favoritesViewController, profileViewController];
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = tabBarController;
    [self.window makeKeyAndVisible];
    
    return YES;
}
```

## Challenge 4

### Video

So far so good! At this point, our code could use a little refactoring. We shouldn't be setting our view controller's title and tabBarItem's in the App Delegate. Instead, we should set them in the view controller's themselves.  So where should we move the title and image setting code to in the controllers? We could try and use `loadView`, since that is called whenever the view controller's view is loaded - that should work, right?

> FeedViewController.m

```
- (void)loadView
{
    self.title = @"Feed";
    self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_feed"];
}
```

> FavoritesViewController.m

```
- (void)loadView
{
    self.title = @"Favorites";
    self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_favorites"];
}
```

> ProfileViewController.m

```
- (void)loadView
{
    self.title = @"Profile";
    self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_profile"];
}
```

Let's see what we get:

![image](https://dl.dropbox.com/s/5uf0o7rt1de5wxl/tab_bar_missing_01.png)

Well that's not right. We find that the image and title only appear after we've tapped on the tab:

![image](https://dl.dropbox.com/s/hzhvrl3geogljh8/tab_bar_missing_02.png)

Remember that `loadView` is called once when the `view` `@property` is accessed and needs to be created. Tab bars are efficient as they only load a tab when it's needed. This is another example of [lazy loading](http://en.wikipedia.org/wiki/Lazy_loading). Therefore, the title and image are only set when the `view` is accessed which only happens when the tab is pressed.

Next, let's try moving the code to the `initWithNibName:bundle:` method. Try doing this and see what happens.

TODO: talk about initWithNib

### Challenge Instruction

Move the initialization code from the `loadView` methods to the `initWithNibName:bundle:` of the view controllers.

### Answer

> FeedViewController.m

```
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.title = @"Feed";
        self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_feed"];
    }
    return self;
}
```

> FavoritesViewController.m

```
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.title = @"Favorites";
        self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_favorites"];
    }
    return self;
}
```

> ProfileViewController.m

```
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.title = @"Profile";
        self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_profile"];
    }
    return self;
}
```

## Challenge 5

TODO: Change stuff in the views in the tab bar.

## Challenge 6

### Video

That did it! All the tab titles and images appear correctly now. You may have noticed that we placed that initialization code in the `initWithNibName:bundle:` method but the method we actually called to created the object was the `init` method! That's because `init` will call `initWithNibName:bundle:` and pass in a `nil` NIB name (Remember, NIBs are files for creating interfaces). Good to know.

Now that you've gotten the basics of the `UITabBarController` we're going to introduce to you a view controller you'll be using even more: the `UINavigationController`. The `UINavigationController` is used when you want the user to progress through a heirarchy of views. The heirarchy could be completely linear or the user could make choices along the way and decide where to go. Check out the default Settings app for an example:

![image](http://developer.apple.com/library/ios/documentation/uikit/reference/UINavigationController_Class/Art/navigation_interface.jpg)

The vast majority of the time, the `UINavigationController` is paired with a `UITableViewController` to present the user with navigation options. You'll learn more about the `UITableViewController` in the next level.

Let's talk a little about how the `UINavigationController` works. Like the `UITabBarController`, the `UINavigationController` is a *Container View Controller*, that is, it contains and manages other views. You initialize a `UINavigationController` by giving it a root view controller using `initWithRootViewController:`:

```
UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:myViewController];
```

When the navigation controller is displayed it places a navigation bar (`UINavigationBar`) at the top of the screen and positions the view controller right below. The heirarchy of views looks like this:

![image from apple docs](http://developer.apple.com/library/ios/DOCUMENTATION/WindowsViews/Conceptual/ViewControllerCatalog/Art/NavigationViews.png)

Making the navigation controller proceed to a new screen is called *pushing* and making the navigation controller show the previous screen is called *popping*. This is common terminology when you are dealing with *stacks*. Going back to the Settings app example, if we were on the first view…

![image](https://dl.dropbox.com/s/24nhw4bwhu68kqr/nav_controller_example_initial.jpeg)

And wanted to *push* to the "General Settings" view, we would send the `pushViewController:animated:` message to the navigation controller:

```
[self.navigationController pushViewController:generalSettings animated:YES];
```

Which would *push* the "General Settings" view controller onto the stack and display the view we want.

![image](https://dl.dropbox.com/s/3va4q098y5rb7hq/nav_controller_example.jpeg)

Sending the `popViewControllerAnimated:` message from the "General Settings" would *pop* us back to the first view controller:

```
[navController popViewControllerAnimated:YES];
```

![image](https://dl.dropbox.com/s/24nhw4bwhu68kqr/nav_controller_example_initial.jpeg)

Normally, you'll want to pass `YES` for the parameter that asks if you want the push/pop to be animated. The `UINavigationController` provides some nice built in animation for us. As you may have noticed, it also provides a "Back" button for free that appears and disappears automatically depending on what view controller the user is on.

Now that you know a bit about the `UINavigationController` it's time to try it out.

### Challenge Instruction

Place each of our main view controllers inside a `UINavigationControler`. Then, give the navigation controllers to the tab bar instead of the previous view controllers.

### Answer

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    // Override point for customization after application launch.
    
    FeedViewController *feedViewController = [[FeedViewController alloc] init];
    UINavigationController *feedNavController = [[UINavigationController alloc] initWithRootViewController:feedViewController];
    
    FavoritesViewController *favoritesViewController = [[FavoritesViewController alloc] init];
    UINavigationController *favoritesNavController = [[UINavigationController alloc] initWithRootViewController:favoritesViewController];
    
    ProfileViewController *profileViewController = [[ProfileViewController alloc] init];
    UINavigationController *profileNavController = [[UINavigationController alloc] initWithRootViewController:profileViewController];

    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.viewControllers = @[feedNavController, favoritesNavController, profileNavController];
    
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window.rootViewController = tabBarController;
    [self.window makeKeyAndVisible];
    
    return YES;
}
```

## Challenge 6

### Video

Did you notice that the `UINavigationController` knew the names of our view controllers? That's because we set the `title` `@property` of our view controllers. It's used for numerous things.

Now, let's add a profile picture to the `ProfileViewController`. There is a special `UIView` that is used to display images called `UIImageView` but since we want our profile picture to be tappable (can you really "click" a touch screen?) we're going to use a `UIButton`.

A new `UIButton` method you'll need to know about is `- (void)setImage:(UIImage *)image forState:(UIControlState)state`. This sets an image to the button for a particular state. The only two states you need to know about right now are `UIControlStateNormal` and `UIControlStateHighlighted` which correspond to when a button is resting and when the button is being pressed, respectively.

Let's add the profile picture to the `ProfileViewController`. Once we've added it, we're going to make it so when the user taps the picture, a larger profile picture is *pushed* onto the screen.

### Challenge Instruction

In the `ProfileViewController`'s `viewDidLoad` method, create a new `UIButton` called `profilePicture` of the type `UIButtonTypeCustom`. Give it a frame of `CGRectMake(15, 15, 52, 60)` and have it display the image named "profile_picture" for both the `UIControlStateNormal` and `UIControlStateHighlighted` states. Finally, add the new button to the view controller's `view`.

(You may also want to change the `self.view`'s background color to make the image more visible)

> Hint:
> You should already know how to use these from the last level but just in case, here's a quick refresher:
>
> * `UIButton`s are initialized like this: `[UIButton buttonWithType:<UIButtonType>]`.
> * `UIButton`s are given actions to perform like this: `[myButton addTarget:<target> action:@selector(<selector-name>) > forControlEvents:<UIControlEvent>];`

### Answer

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    // Add the profile picture
    UIButton *profilePicture = [UIButton buttonWithType:UIButtonTypeCustom];
    [profilePicture setImage:[UIImage imageNamed:@"profile_picture"] forState:UIControlStateNormal];
    [profilePicture setImage:[UIImage imageNamed:@"profile_picture"] forState:UIControlStateHighlighted];
    [profilePicture setFrame:CGRectMake(15, 15, 52, 60)];
    
    [self.view addSubview:profilePicture];
}
```

## Challenge 7

### Challenge Instruction

Nice!

![image](https://dl.dropbox.com/s/577m7dduxxzqr4k/profile_pic_view.png)

Now add a target and action to the button for when a `UIControlEventTouchUpInside` event happens. Make the `target` equal to `self` and the `action` equal to `profilePicturePressed:`. Lastly, add the `profilePicturePressed:` method to the `ProfileViewController`.

Hint: Remember, the method you'll want to use to add an action to a `UIButton` is `- (void)addTarget:(id)target action:(SEL)action forControlEvents:(UIControlEvents)controlEvents`.

Hint: Also remember that action methods look like this: `- (void)actionMethodName:(id)sender.`

### Answer

```
- (void)viewDidLoad
{    
    ...
    [profilePicture addTarget:self action:@selector(profilePicturePressed:) forControlEvents:UIControlEventTouchUpInside];
    ...
}

- (void)profilePicturePressed:(id)sender
{

}
```

## Challenge 9

### Video

We're almost ready to push our first view controller. The last step is creating the view controller to push and adding the large image to it. To add the image we'll be adding a `UIImageView` to the new view controller. `UIImageView`s are easy to create - simply call the `initWithImage:` method after you `alloc` the `UIImageView`. Here's an example where we create an image view with the image `myImage`:

```
UIImageView *imageView = [[UIImageView alloc] initWithImage:myImage];
```

One last thing to note is that by default an `UIImageView` will stretch an image to fit the image view's frame. Many times, this is not what we want. We can tell the `UIImageView` to fit the image as closely as possible while maintaining the aspect ratio by calling `[myImageView setContentMode:UIViewContentModeScaleAspectFit]`.

### Challenge Instruction

Now, let's fill in that action and *push* a new view controller. This is the grand finale. There's a lot of steps but it's all things you've done before. 

Here's what you'll need to do:

* In the `- (void)profilePicturePressed:(id)sender` action method, create a new `UIViewController`.
* Set the new view controllers view's frame to equal `self.view.frame`.
* Create a new `UIImageView` with a `UIImage` whose image is named "profile_picture_large".
* Set the *content mode* of the `UIImageView` to `UIViewContentModeScaleAspectFit`.
* Set the `frame` of the `UIImageView` to equal `self.view.frame`.
* Add the image view to the new view controller using `addSubview:`.
* Push the new view controller using the `self.navigationController`'s `pushViewController:animated:` method.

### Answer

```
- (void)profilePicturePressed:(id)sender
{
    // Create new view controller
    UIViewController *profileImageViewController = [[UIViewController alloc] init];
    profileImageViewController.view.frame = self.view.frame;
    
    // Create and add image view
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"profile_picture_large"]];
    [imageView setContentMode:UIViewContentModeScaleAspectFit];
    imageView.frame = profileImageViewController.view.frame;
    [profileImageViewController.view addSubview:imageView];
    
    // Push new view controller
    [self.navigationController pushViewController:profileImageViewController animated:YES];
}
```

## Challenge 10

### Video

Congrats! You've done a great thing.

<table>
  <tr>
  	<td><img src="https://dl.dropbox.com/s/577m7dduxxzqr4k/profile_pic_view.png"/></td>
    <td><img src="https://dl.dropbox.com/s/wzpiszk1yl0sznl/profile_pic_view_large.png"/></td>
  </tr>
</table>

As you noticed, the `UINavigationController` made a back button appear for you automatically. It even named it using the `title` of the previous view controller.

For this final challenge, take some time to experiment with all you've learned so far. In the next level, we'll introduce `UITableViewControllers` so you'll need to make sure you are comfortable with what we've learned here.

Have fun!

### Challenge Instruction

Experiment with the `UINavigationController`.

What if you tried to push an instance of the same type of view controller the navigation controller is currently on onto the stack? What if you tried to push, literally, the same view controller that is being shown onto the stack?

### Answer

N/A