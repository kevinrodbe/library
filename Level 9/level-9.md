# Level 9

### Goals

* Learn some common ways data is passed around in iOS (globals vs singletons).
* Understanding how `@protocols` can make passing data around safer and cleaner.
* How to use the `prepareForSegue:sender:` of `UIStoryboard` to pass data.
* NSTimer and alternatives.

### User Knowledge Assumptions

* They know what modal view controllers are and how to present them.
* Basic understanding of storyboards.
* They know a what `dispatch_once` does.
* They understand `@protocols`.
* Basic understanding of threading in iOS.
* They know what a `UIColor` is.

## Challenge 1

### Video

In this level we're going use what we learned in the last level to build a "Slideshow" feature for the images. As you may have guessed, we'll be using a modal to show this screen. To allow the user to initiate the slideshow we're going to use a new control called `UIBarButtonItem`. Don't be fooled into thinking this is `UIButton` subclass or even a `UIControl` or `UIView`. It's actually a `UIBarItem`. For now, just think of it as the buttons your used to using. We'll go ahead and drag a `UIBarButtonItem` out and put that in our navigation item.

![image](https://dl.dropbox.com/s/r2ofq0nyev7m8os/add-barbutton-01.png)

Then we'll change the identifier to "Play" so it looks like a little play button. There's a lot of other identifiers here that will change the look and feel of the buttons so check them out.

![image](https://dl.dropbox.com/s/4g5y01gpk0sy06m/add-barbutton-02.png)

Here's what we get:

![image](https://dl.dropbox.com/s/6u42825sn4ad5u2/add-barbutton-03.png)

Normally, to display the modal when the Slideshow button is pressed, we would create a `IBAction` for the button press and add some code like this:

```
- (IBAction)slideshowButtonWasPressed:(id)sender {
    SlideshowViewController *slideshowVC = [[SlideshowViewController alloc] init];
    [slideshowVC setModalTransitionStyle:UIModalTransitionStyleCrossDissolve];
    slideshowVC.delegate = self;
    
    [self presentViewController:slideshowVC animated:YES completion:nil];
}
```

You've seen this before so it shouldn't look surprising. However, we're going to use a feature in Interface Builder to write this code for us.

First, let's take a look at our storyboard again. We see that we have the `FeedViewController`:

![image](https://dl.dropbox.com/s/3skghh85brpb4q1/storyboard-modal-01.png)

Let's grab a UIViewController from the and place it on the storyboard.

![image](https://dl.dropbox.com/s/yw2boh04l2x1z7w/storyboard-modal-02.png)

Next, we'll select the new UIViewController and change it's class to `SlideshowViewController`.

![image](https://dl.dropbox.com/s/f19zyexy12vdjsz/storyboard-modal-03.png)

![image](https://dl.dropbox.com/s/z694pd2hl18a5bf/storyboard-modal-04.png)

Then, we'll `CTRL` drag from the button to the `SlideshowViewController`.

![image](https://dl.dropbox.com/s/g1wuezv0e83pzyf/storyboard-modal-05.png)

and select "Modal" from the popup.

![image](https://dl.dropbox.com/s/09mnmh6s57bxv2x/storyboard-modal-06.png)

That's it! Now whenever the play button is tapped the `SlideshowViewController` will be presented as a modal. If you check the code you'll notice that the storyboard didn't add any code when we connected these two view controllers. These connections, or *segues*, are managed from within the storyboard. This is convenient because we can avoid adding unnecessary UI code to our view controllers and we can visually see the flow of our app in the storyboard.

The last thing we'll want to do is change the transition style. We can do that by clicking on the segue that was just created:

![image](https://dl.dropbox.com/s/kzvgekbhqpyymnt/storyboard-modal-07.png)

And then selecting "Cross Disolve" for the "Transition Style" in the right pane.

![image](https://dl.dropbox.com/s/401fcsnvbkekjlq/storyboard-modal-08.png)

Now that our new modal view controller is all setup, let's introduce the first new class we'll be using in this level: `NSTimer`. `NSTimer` allows us to easily schedule a message to be sent to an object every at some interval we define. Be aware that there are many ways to perform an `NSTimer's` task that are more robust and efficient, however, `NSTimer` is very easy to implement and suits our needs.

To create an `NSTimer` you'll only need to pass one message to the `NSTimer` class: `scheduledTimerWithTimeInterval:target:selector:userInfo:repeats:`. Let's see an example and go through it step by step:

```
[NSTimer scheduledTimerWithTimeInterval:15.0 target:someObject selector:@selector(performTask:) userInfo:@"good job!" repeats:NO];
```

This reads: "schedule a timer that will run in 15 seconds that will pass the performTask: message to someObject. Pass in some additional data to that method and make sure it only runs once (doesn't repeat)." Pretty simple. You don't even need to get a reference to the timer to start it - it starts right after you pass the `scheduledTimerWithTimeInterval…` message.

If you want to create a timer once when the view is loaded you'll want to add the initialization code to your `UIViewController's` `viewDidLoad:` method.

Let's try using `NSTimer`.

### Challenge Instruction

In the `SlideshowViewController` implementation, schedule a timer that will run every few seconds. Have it send the `updateSlideshowImage:` message to the `SlideshowViewController`. In the `- (void)updateSlideshowImage:(id)sender` method get creative with the tools you've acquired and make something happen in the UI (e.g. change the background color).

### Answer

> Need a suggestion? Try playing around with this:
> 
> ```
> UIColor *randomColor = [UIColor colorWithRed:arc4random()%255 / 255.0
                                           green:arc4random()%255 / 255.0
                                            blue:arc4random()%255 / 255.0
                                           alpha:1.0];
[self.view setBackgroundColor:randomColor];
> ```

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    // User will add this line:
    [NSTimer scheduledTimerWithTimeInterval:3.0 target:self selector:@selector(updateSlideshowImage:) userInfo:nil repeats:YES];
}

// User will add this method:
- (void)updateSlideshowImage:(id)sender
{   
    // The code below is optional.
    // The user could put anything here.
    NSLog(@"Timer did fire.");
    UIColor *randomColor = [UIColor colorWithRed:arc4random()%255 / 255.0
                                           green:arc4random()%255 / 255.0
                                            blue:arc4random()%255 / 255.0
                                           alpha:1.0];
    [self.view setBackgroundColor:randomColor];
}
```

> Development note: We can override the `NSTimer's` factory method to give us a reference to the `NSTimer` that the user creates. This way we can check to make sure they've done everything correctly.

## Challenge 2

### Video

Now that we know how to schedule a timer, let's get our post data into the `SlideshowViewController` so that we can start displaying the images.

Passing data between view controllers is a challenging problem for many newcomers to iOS. Fortunately, there are many ways to do this in iOS. Unfortunately, there are many ways to do this in iOS.

Let's start sharing data by using a pattern we see commonly through-out iOS. I'm going to intentionally avoid associating a name with this pattern for now. See if you can pick it up as we go.

In this pattern, a class is created that manages or represents some data . Maybe it helps add new items to the datastore, provides a way to search for items, or writes the datastore to the disk. A class level method is then added that returns a shared singleton instance of the class. This class level method is usually prefixed with "shared". Thus, when a class needs to store some data, it simply:

1. Imports the data manager class.
2. Asks for the shared instance.
3. Stores/retrieves data.

Here are some built-in examples of this:

```
// Current user's address book.
[ABAddressBook sharedAddressBook];

// Returns the shared NSUserDefaults instance.
[NSUserDefaults standardUserDefaults];

// Returns the UIApplication that represents our app.
[UIApplication sharedApplication];

// Returns the UIScreen for the current device.
[UIScreen mainScreen];
```

Let's try using this pattern to create a class called `InstaPhotoPostData`. We'll go ahead and setup the `InstaPhotoPostData` class and files. You'll need to do the refactoring.

### Challenge Instruction

First, head over to the `InstaPhotoPostData` and check out what we did.

Now head over to the `FeedViewController` class. Notice that we moved the `posts` array out of the `FeedViewController` and into the `InstaPhotoPostData` class. Refactor the `FeedViewController` to use `InstaPhotoPostData's` `sharedPostData` method to get access to the `posts` array.

### Answer

> FeedViewController.m

```
// TBD
// We'll need to know a little more about what the FeedViewController class
// looks like. Most likely, the user will make changes to the method where the
// feed posts are rquested and the method where the table cell is created to
// display the post.
```

## Challenge 3

### Video

Now we'll use the `InstaPhotoPostData` class to show the actual feed images in the `SlideshowViewController`. Let's import the `InstaPhotoPostData` class:

`#import "InstaPhotoPostData.h"`

and modify the `updateSlideshowImage:` method to pull images from here. You'll want to do a few things to make this work:

1. First you'll want to create a variable `static int currentPostIndex` variable. The `static` keyword just means that this variable will only be created once and will retain it's value throughout all the calls to this method.
2. Next, you'll want to get the next post `InstaPhotoPostData` class using the `objectAtIndex:` method of the `posts` array.
3. Next, you'll need to increment the `currentPostIndex` value by `1`. This will give you the next image the next time the method is called.
3. Lastly, you'll want to add a check *before* you access the array to make sure you are not accessing an index that is out of bounds (i.e. an index that doesn't exist). To this you can use the `count` method of the `posts` array. If the `currentPostIndex` equals the total count of the `posts` array set the `currentPostIndex` back to `0`.

We'll import the `InstaPhotoPostData` class for you and you can fill in the `updateSlideshowImage:` method.

### Challenge Instruction

Update the `- (void)updateSlideshowImage:(id)sender` method to display actual image from the the `InstaPhotoPostData` class by creating a `static int` to store the current post index. Remember increment the index and check to make sure it is in the bounds of the array!

### Answer

```
- (void)updateSlideshowImage:(id)sender
{
 	static int currentPostIndex = 0;
    if (currentPostIndex == [[InstaPhotoPostData posts] count]) {
        currentPostIndex = 0;
    }
    self.imageView.image = [[[InstaPhotoPostData posts] objectAtIndex:currentPostIndex] image];
    currentPostIndex++;
}
```

## Challenge 4

### Video

> Global variables, singletons, how to pass data the right way

Good job on getting that slideshow up and running.

However, did you notice anything… [awry](https://dl.dropbox.com/s/hxzcogiezquuwek/moth_monster_man.png)?

Our `InstaPhotoPostData` is looking pretty similar to a [global variable](http://en.wikipedia.org/wiki/Global_variable). 

That should scare you.

Global variables, as their name implies, are accessable globally. That means any file can have access to the variable. Traditionally, they are avoided for these reasons:

1. **Too many variables in the same space (i.e. "namespace") or file can turn things into a confusing mess very quickly.**
2. **Using globals can significantly reduces the amount of thought a programmer needs to put into the design of his classes and how they communicate with each other** leading to programs that are inefficient and do not scale well.
3. **They break Encapsulation (an Object-Oriented programming principal).** Those global variables need to be defined somewhere and more often than not, in iOS apps, they're placed in the same file: the App Delegate. If those variables have nothing to do with peforming the tasks of an "App Delegate" then their placement is not only wrong but *offensive*.

That being said, you should try to *avoid* using global variables as much as possible. However, you've already seen a lot of iOS classes that have this global variable feel to them:

```
// Current user's address book.
[ABAddressBook sharedAddressBook];

// Returns the shared NSUserDefaults instance.
[NSUserDefaults standardUserDefaults];

// Returns the UIApplication that represents our app.
[UIApplication sharedApplication];

// Returns the UIScreen for the current device.
[UIScreen mainScreen];
```

inlcuding the class that we made.

```
// Gets the shared app data.
[InstaPhotoPostData sharedPostData];
```

What all these examples are and what we have created *is not* a global variable but a *singleton*. The *singleton* pattern is used extensively throughout iOS because it retains the usefulness of the a global variable but has these advantages:

1. **You must request the singleton instance using an method.** This provides some layer of abstraction meaning you could choose not to return the instance or you could perform some additional opertations before returning it.
2. **We are dealing with dynamic objects, not static primitives.** Since these "globals" are objects you can encapsulate all their behaviors and attributes in the class. They can have state.

To sum this up, **if your app contains data or functionality that no particular part of your app "owns" then that may be a good candidate for the *singleton* pattern**. 

Looking back, making the `InstaPhotoPostData` a singleton was convenient for passing that data around but the `InstaPhotoPostData` is not a good candidate for a singleton since the `FeedViewController` creates and *owns* all it's data.

What would be better is to have the `FeedViewController` pass it's local InstaPhoto posts to the `SlideshowViewController`. 

> TODO: (diagram here)

We'll go ahead and revert all the singleton code we added to what we had before: just a `posts` `@property` in the `FeedViewController`. Nobody likes to throw away code they just wrote but hopefully you learned that even though the `InstaPhotoPostData` singleton looked tempting and actually solved our problem it was not a good solution. Besides the fact that it was an improper use of the `singleton` pattern, we would run into trouble when we wanted to do things like show a slideshow of a subset of posts in the feed.

Back to passing the InstaPhoto data…

If we were displaying the `SlideshowViewController` manually, you'd know how to how to pass this data.

```
- (IBAction)slideshowButtonWasPressed:(id)sender {
    SlideshowViewController *slideshowVC = [[SlideshowViewController alloc] init];
    [slideshowVC setModalTransitionStyle:UIModalTransitionStyleCrossDissolve];
    
    // Pass data to slideshowVC here!
    
    [self presentViewController:slideshowVC animated:YES completion:nil];
}
```

However, we used a storyboard to present this modal and there's no trace of that in the code. Thankfully, storyboards do provide an easy way for us to pass data between view controllers with the `- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender` method.

This `UIViewController` method is called right before a `UIViewController` is about to *segue* into another view controller. Notice the `segue` parameter. There are two `@properties` of the `segue` parameter that are of interest to us. The first is `segue.sourceViewController`. This returns to us the `UIViewController` initiating the segue. In our case and almost every other case, this will be equal to `self`. The second `@property` is `segue.destinationViewController`. This returns the `UIViewController` that we are seguing to.

Both of these properties return a type of `id` so you will need to cast the `@property` to access any data:

```
// Can't access properties or methods :(
self.destinationViewController

// Casted. Now I can access them!
((MyUIViewController *)self.destinationViewController)
```

Using that knowledge let's update our code.

### Challenge Instruction

Add `- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender` to `FeedViewController.m` and give the `SlideshowViewController` the posts using the segue parameter. Remember, both view controllers posts are stored in the `posts` `property`. You will need to cast appropriately.

### Answer

```
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    [super prepareForSegue:segue sender:sender];
    ((SlideshowViewController *)segue.destinationViewController).posts = self.posts;
}
```

## Challenge 5

### Challenge Instruction

What we wrote in the last challenge is kind of dangerous. We assumed our `destinationViewController` was a `UserProfileViewController` but that may not always be the case. Let's set this right by using an `NSObject` method called`isKindOfClass:`. This simply returns a `BOOL` `YES` or `NO` allowing us to test whether or not an object is of a certain type of class. We can get the class of an object by sending the `class` message to it's class (e.g. `[UIViewController class]`).

Add a check to make sure the `destinationViewController` is equal to the `UserProfileViewController` class before doing the casting.

### Answer

```
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    [super prepareForSegue:segue sender:sender];
    if ([segue.destinationViewController isKindOfClass:[SlideshowViewController class]]) {
        ((SlideshowViewController *)segue.destinationViewController).posts = self.posts;
    }
}
```

## Challenge 6

### Video

We've come a long way since the first challenge:

1. We discovered the singleton pattern wasn't appropriate for the data we were trying to pass,
2. so we modified our code to use a storyboard method to pass the data.
3. Then lastly, we checked to make sure data would only get passed if the view controller could receive it.

However, what would happen if we needed to add a segue from the `FeedViewController` to another type of modal that needed the posts? You would probably add something like this:

```
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    [super prepareForSegue:segue sender:sender];
    if ([segue.destinationViewController isKindOfClass:[SlideshowViewController class]]) {
        ((SlideshowViewController *)segue.destinationViewController).posts = self.posts;
    }  
    else if ([segue.destinationViewController isKindOfClass:[OtherViewController class]]) {
        // set data here...
    }   
    else if ([segue.destinationViewController isKindOfClass:[OtherViewController class]]) {
        // set more data here...
    } 
    else if ([segue.destinationViewController isKindOfClass:[OtherViewController class]]) {
        // set other data here...
    } 
    else if ([segue.destinationViewController isKindOfClass:[OtherViewController class]]) {
        // set even more data here...
    } 
}
```

That's not very scalable. There's other issues besides scalability that we could run into here as well. To solve this, let's use `@protocols`.

Before passing data around your app try to think in terms of `@protocols`… 

* Can the data be grouped into logical categories?
* Which view controllers can handle post data? 
* Which view controllers can handle user data?

Once you've figured out who can handle what, you can create `@protocols` that can be used to denote that a certain class can handle a certain type of data. To see this, we'll create a `InstaPhotoPostDataHandler` `@protocol`:

```
@protocol InstaPhotoPostDataHandler <NSObject>
@property (nonatomic, strong) NSArray *posts;
@end
```

Now, any class that conforms to this `@protocol` will need to have a posts `@property`. A caveat here is that you must manually `@synthesize` any `@properties` in a `@protocol`.

Let's refactor the code in the `- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender` method of the `FeedViewController` to check to see if the `segue.destinationViewController` conforms to the `InstaPhotoPostDataHandler` `@protocol`. We can perform this check by using anothe `NSObject` method called `conformsToProtocol:`. The `conformsToProtocol:` method takes in a `@protocol` parameter which is created like this: `@protocol(<protocol-name>)`.

Let's try this out now.

### Challenge Instruction

Using `conformsToProtocol:` refactor the `prepareForSegue:sender:` method to perform only one check to see if the `segue.destinationViewController` conforms to the `InstaPhotoPostDataHandler` `@protocol`. If it does, pass the post data.

Remember to cast the `segue` correctly as an `id<protocol-name>`!

### Answer

```
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    [super prepareForSegue:segue sender:sender];
    if ([segue.destinationViewController conformsToProtocol:@protocol(InstaPhotoPostDataHandler)]) {
        ((id<InstaPhotoPostDataHandler>)segue.destinationViewController).posts = self.posts;
    }
}
```

## Closing Remarks

We've spent a lot of time this level talking about passing data around so that we can actually use it. Don't let that discourage you. It's tricky business. Almost every developer you talk to will have a different preferred way of shuffling data about. What's important is to use best practices (e.g. using interfaces, typechecking, singletons, ect.) and stay consistent throughout your app. 

