# Level 0

### An Objective-C Primer

This primer assumes a basic knowledge of object-oriented programming.

## What is Objective-C

Quick Facts

* **Objective-C is the primary language for developmening Mac and iOS applications**.
* Objective-C is a super-set of C. It's literally "C Objectified" or "Object Oriented C".
* Any C program can be compiled using an Objective-C compiler.
* Objective-C lends itself to being **verbose**. Clarity and consistency are important.

## File Structure

Like many other languages Objective-C has header (interface) files and implementation files postfixed with a .h and .m respectively. The class definition, method definitions and constants usually go in the header file while the actual implementation of those things go in the implementation file.

Crack open nearly any Objective-C implemenation file (.m) and one of the first lines you'll see will look something like this:

```
#import "AppDelegate.h"
```

That simply tells the compiler to "take everything in the *AppDelegate.h* file and make it available here". In other languages this is sometimes done by using the keyword `include`.

## Anatomy Of A File

We could talk a lot about the characterstics of the language but there's already enough material on that already - let's just jump into some code.

If we were to start a brand new iOS Xcode project here is what we would see in the `AppDelegate.h` file (don't worry, you'll learn much more about what App Delegates are in Level 1):

### Importing Files

> AppDelegate.h

```
#import <UIKit/UIKit.h>

@class ViewController;

@interface AppDelegate : UIResponder <UIApplicationDelegate>

@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) ViewController *viewController;

@end
```

First, we are importing a very important framework we need to make an iOS app: `UIKit`. You will always need this and you will use many classes from this framework. It's where all the buttons, textfields, and things you are used to seeing in an iOS app reside.

```
#import <UIKit/UIKit.h>
```

### Defining A Class

Next, we are defining our `AppDelegate` class by using some special keywords: the `@interface` starts the definition and the `@end` completes it.

```
@interface AppDelegate : UIResponder <UIApplicationDelegate>
...
...
...
@end
```

If we were to translate this into english it would read: "Below lies the definition of the `AppDelegate` class which is a *subclass* of the `UIResponder` *class* and which adheres to the `UIApplicationDelegate` *protocol*." Don't worry about what the `UIResponder` is right now. "Adhering to the `UIApplicationDelegate` *protocol*" just means the `AppDelegate` is saying "I'm going to act like a `UIApplicationDelegate`".

### Variables and Properties

Next, we see some instance variables:

```
@property (strong, nonatomic) UIWindow *window;
@property (strong, nonatomic) ViewController *viewController;
```

There's a few ways to define variables but what we see being used here is "properties". Properties are denoted by using the `@property` keyword. Next, they're given a couple other atributes: `strong` has to do with how memory is handled and `nonatomic` has to do with threading. Just declare everything like that for now, you'll learn more about it later. 

Properties help us write less code. Here's what the first property above is doing:

1. Creates a private instance variable called `_window` (notice the underscore).
2. Creates a public instance method called `window`.
3. Creates a public instance method called `setWindow:` (the colon just means there is a parameter - more on this later).

Got that? The `@property` made a getter and setter method for us as well as the private instance variable. What's also nice is that in Objective-C you can call a property's getter like this: `myObject.myVariable` and you can use a property's setter like this: `myObject.myVariable = someNewValue;`. It looks like how you would normally get/set instance variables in other languages.

It's a good idea to use properties because you can override behavior later if you need to. If that doesn't make sense don't worry, you'll be doing it later in the course.

### The Implementation File

Next, let's check out the `AppDelegate.m` file:

> AppDelegate.m

```
#import "AppDelegate.h"
#import "ViewController.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.viewController = [[ViewController alloc] initWithNibName:@"ViewController" bundle:nil];
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
```

Looks pretty daunting but we'll take it step by step:

```
#import "AppDelegate.h"
#import "ViewController.h"
```

You know what that means already: we're important files that we need. In this case it's the code for the `AppDelegate` class and the `ViewController` class.

Next, we have a special keyword, `@implementation`, that denotes we are going to begin implementing our class, `AppDelegate`.

```
@implementation AppDelegate
...
...
...
@end
```

### Implementing Methods

Next we have our first method implementation. This method was defined in that `UIApplicationDelegate` protocol you saw in the header so that's why we didn't see the actual method definition there. You will see this method in *every* iOS app:

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
...
...
...
}
```

The most noticable difference in Objective-C to other languages is how methods signatures look and how methods are called. Before we go any further just know that I'll be using the words "calling a method" and "passing a message" interchangably for this material. We'll talk about this later.

The method begins with a `-` which means it's an instance method. Conversely, a `+` would denote a class method. Next is the return type in parentheses which is a `BOOL` value. Next is the method signature. It reads like this: "Application <> did finish launching with options <>." Where I put the "<>" is where a parameter is. You might have noticed that the parameters are interspersed throughout the name (or *signature*) of the method. Parameters immediately follow the colon `:` and must be given a type and a name. The two parameters in the method above are `application` of type `UIApplication` and `launchOptions` of type `NSDictionary`. The `*` just means that the variable/parameter is an object.

### "Calling" Methods

Next, lets look at the guts of the `application:didFinishLaunchingWithOptions:`. Did you get that? That's how you would write the name of the method we just looked at shorthand. This kind of notation will appear frequently.

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.viewController = [[ViewController alloc] initWithNibName:@"ViewController" bundle:nil];
    self.window.rootViewController = self.viewController;
    [self.window makeKeyAndVisible];
    
    return YES;
}
```

Let's just focus on the second to last line:

```
[self.window makeKeyAndVisible];
```

Here, we are passing a message to the `window` object (i.e. "calling a method on the `window` object"). A method call is always wrapped in brackets `[]`. The first part is the object receiving the message/method and the second part is the message/method. If we want to pass some parameters in we just add a colon and the parameter like this:

```
[self.window makeKeyAndVisible:5];
```

Here I passed in the integer "5" (this method doesn't actually exist). You can easily nest methods like this:

```
[[UIScreen mainScreen] bounds]
```

Here, the `bounds` message is being passed to the object returned by `[UIScreen mainScreen]`. As an exercise, go back and see if you can figure out what the rest of the `application:didFinishLaunchingWithOptions:` method is doing. Hint: `alloc` stands for "allocate" - it grabs some memory for the object to use.

### Use Your Words

The scattering of parameters throughout the method name is something not many languages do, however, it has a nice benefit: it forces developers to write descriptive text for each parameter of the method.

For instance, a method in another language that displays a message might look like this:

```
self.displayMessage(view, "Something went wrong.", 1, 3, true);
```

By looking at that, we aren't quite sure exactly what it does or how to use it. Now, try to figure out what the Objective-C implementation does:

```
[self [displayMessageInView]:view withMessage:@"Something went wrong." withBeeps:1 forDuration:3 andDisableUserInteraction:YES];
```

It's pretty easy to understand how to use that method because it reads like a sentence. 

Objective-C tends to be verbose. **Don't fight it.** 

There is a wonderful write-up [here](http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/CodingGuidelines/Articles/NamingBasics.html) on code naming conventions. *Please* read it. It's short and you will be very glad you did!

### Passing Messages

One very confusing concept to new-comers of Objective-C is how methods are called on objects… or should I say: how methods *aren't* called on objects. Methods do exist in Objective-C but you don't "call" them, instead, you send an object a *message* that has a *selector* attached to it. A *selector* is basically a reference to a method. For now, just think of *selectors* as Objective-C function pointers.

To visualize this, pretend a person is browsing an online clothing store. They find some things they like and they place an order. One of the store employees then receives an email with the order.

There's a lot of good similarities in this example. First, the person shopping would be an object sending a message (the order) to another object (one of the store employees). The shopper didn't know which store employee would get the message specifically, just that one of them would. Likewise, in Objective-C, the target object of a message is resolved at runtime. This means that you could possible send a message to an object that doesn't "respond" to it. You'll inevitably come across that terminology.

Similarily to the customer's order, a message itself doesn't explicitly tell the object what to do. The employee could be really lazy and just toss out the order because they don't feel like doing it. Likewise, when a *selector* is passed to an object it's up to the object to act on it (i.e. the caller doesn't know exactly what course of action the callee will take). Let that sit for a moment.

It's helpful to think of objects as people in Objective-C and define their methods as "messages" that people would pass to each other. Just like people objects can…

1. Have many messages sent to them at the same time.
2. Not "respond" to certain messages.
3. Behave differently depending on whose talking (sending the messages).


## Making Your Own Class

Back to some code. Let's make our own simple class called `MyClass`. Here's the interface file (.h):

> MyClass.h

```
@interface MyClass : NSObject

@end
```

Let's add a *initializer*. An initializer is how we initialize objects. Initializers always start with "init". Let's have our initializer take in an object as a parameter:

```
@interface MyClass : NSObject

- (id)initWithObject:(id)someObject;

@end
```

You'll notice right off the bat that we are subclassing `NSObject`. This is the root object of most Objective-C objects you'll be using. Think of it has your foundational object.

Next you'll see that we are returning an `id`. The `id` parameter is a generic type… It could point to any type of object. It's like a `void *` but for Objective-C objects. *Initializers* almost always should return an `id`.

Now let's create the implementation file:

> MyClass.m

```
#import "MyClass.h"

@implementation MyClass

- (id)initWithObject:(id)someObject
{
    self = [super init];
    if (self) {
        // Do initialization here...
    }
    
    return self;
}

@end
```

As you can see, we've implemented our initializer. There are three thigns you will want to make sure you always do in an initializer:

1. Call the `super` init if possible. This calls your parent class's `init` method.
2. Check to make sure you actually got a valid object back before doing anything.
3. Always return `self`.

That's pretty much it!


## A Few More Things You Should Know

### Memory Management

Don't worry about it.

At least for now. You might see some `retain` and `release` statements in older code. That is how the program knows whether to keep objects around or free their memory. Nowadays the compiler adds these statements for use thanks to a technology called Automatic Reference Counting (or ARC). If you really need to know how this works [read this.](https://developer.apple.com/library/mac/#documentation/General/Conceptual/DevPedia-CocoaCore/MemoryManagement.html)

### BOOLs and bools and booleans

There's a lot of them. Stick to using `BOOL` which has two values: `YES` and `NO`. Just be aware that a `BOOL` might not equal a `bool` in every case.

### Categories

You should be aware of the existence of *Categories*. Categories look like class definitions but don't actually define a new class. Instead, they *add* functionality to an existing class. It's a neat way of adding methods and properties to existing classes and is used quite often in iOS development.

```
@interface UIView (CategoryName)

@end
```

```
@implementation UIView (CategoryName)

@end
```