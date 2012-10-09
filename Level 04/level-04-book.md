# Level 4

### Goals

* Learn how to us `UITableView`s to display static data.
* See how `UITableView` uses both the *delegation* and *datasource* pattern.
* How the `autoresizingMask` works.
* Learn how to overcome a common pitfall: changing a cell's backgound color.
* How to use `NSString`'s `stringWithFormat:` method.


### User Knowledge Assumptions

* Basic Objective-C knowledge.
* Understands the basic idea behind delegation.
* Understands UIViews and UIViewControllers.
* Knows a little about `UILabel`, `UIImage`, and `UIImageView`.

## Challenge 1

### Video

In the last level you saw how `UINavigationControllers` can help users navigate an app. The `UINavigationController`, however, provides only a container to show new content in. In this level, we'll introduce to the driving force behind most iOS navigation: the `UITableView`:

![Table View](http://cl.ly/image/0f331T082L3o/try-ios-tableview.png)

The `UITableView` is known as the "work-horse" of iOS UIKit. `UITableViews` are used anytime data or information need to be displayed in a linear manner. 

<table>
  <tr>
    <td><img src="http://cl.ly/image/0j1y3y09220N/try-ios-phone-app.png"/></td>
    <td><img src="http://cl.ly/image/020k2k2I1j3G/try-ios-music-app.png"/></td>
    <td><img src="http://cl.ly/image/0r390k2y3m0f/try-ios-messages.png"/></td>
  </tr>
</table>

Contacts, music, and even the message bubbles in the messaging app are all `UITableViews`. You may have noticed all the screenshots above have the `UITableView` embedded in a `UINavigationController`. This is almost always the case: `UITableView` and `UINavigationController` go hand in hand.

Throughout this level, we'll be creating our "InstaPhoto Feed". A *feed* is usually a linear list of items so a `UITableView` is a great fit. You can instantiate a `UITableView` like you would any other `UIView`: just `alloc`, `init` and give it a frame:

```
UITableView *tableView = [[UITableView alloc] initWithFrame:self.view.frame];
```

Go ahead and try this out by creating the InstaPhoto feed.

### Challenge Instruction

Add a `UITableView` `@property` to the `FeedViewController` class called `tableView`. Remember to make it `weak` since the `FeedViewController`'s `view` will "own" it. Then, in the `viewDidLoad` of the `FeedViewController`, instantiate the `UITableView` using `initWithFrame:` passing in `self.view.frame`. Finally, add the table view to the main view.

### Answer

> FeedViewController.h

```
@property (nonatomic, strong) UITableView *tableView;
```

> FeedViewController.m

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:self.tableView];
}
```



## Challenge 2

### Video

Nice! Now you've got a `UITableView` up and running but it's not displaying any data. When you think of a table it's easy imagine that you could just give the table an array of objects and POOF, it would display them. However, that's not how `UITableView`s work. Instead, `UITableView`s follow a pattern called the *datasource pattern* which gives them greater flexibilty. There are other classes in `UIKit` that follow this, the most notable being iOS 6's new `UICollectionView` class (you'll learn a little about that later on).

##### Datasource Pattern

In the *datasource pattern*, an object needs to display data and uses another object, called it's *datasource*, to figure out how to display the data. The object that needs to display data will ask it's *datasource* things like

* "How many sections or groups of items are in the dataset?"
* "How many items are in each section?"
* "What should a cell look like that needs to display item X?"

##### UITableViewDataSource

The `UITableView` uses a special `@protocol` to define what it's datasource should look like: `UITableViewDataSource`. Take a look below at the methods we'll be using from the `UITableViewDataSource` class:

```
@protocol UITableViewDataSource <NSObject>
@required

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;

@end
```

There are many more methods of the `UITableViewDataSource` `@protocol` but these are the only required ones. 

The first method, `tableView:numberOfRowsInSection:`, simply asks for how many rows are in a particular section. In the default "Contacts" app, rows would be contacts and the sections would be the letters their names start with (e.g. "A", "B", etc).

The second method, `tableView:cellForRowAtIndexPath:`, actually creates the cell and returns it. It is important that an actual cell is actually returned from this method - if something else or a `nil` value is returned an exception will be thrown (i.e. your app will crash)! From the `@protocol`, you'll notice this method is passed this parameter: `(NSIndexPath *)indexPath`. An `NSIndexPath` is just a fancy way of giving directions. With an `NSIndexPath` we can get the `section` number and relative`row` number of the cell by calling those two `@properties`: `section` and `row`.

##### Creating UITableViewCells

To create a cell you will call the usual `alloc` on the `UITableViewCell` class and a special `init` method called `initWithStyle:reuseIdentifier:`. This special init method takes in a style for the view and a *reuse identifier* which we'll talk about later. For now, just table cells like this using the `UITableViewCellStyleDefault` style:

```
UITableViewCell *myCell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"myCellType"];
```

##### Setting the dataSource

To give the table view a data source you'll need to set it's `dataSource` `@property` to an object that conforms to the `UITableViewDataSource` `@protocol`. Let's try doing this using the `FeedViewController`.

### Challenge Instruction

Have the `FeedViewController` conform to the `UITableViewDataSource` `@protocol`. Then implement the two required `UITableViewDataSource` methods:

```
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;
```

Return a bigger number for `tableView:numberOfRowsInSection:` like 20 or 30.

For `tableView:cellForRowAtIndexPath:`, return a cell using `initWithStyle:reuseIdentifier:`.

### Answer

> FeedViewController.h

```
@interface FeedViewController : UIViewController <UITableViewDataSource>
```

> FeedViewController.m

```
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
	return 20;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
	UITableViewCell *postCell = 
	return nil;
}
```

## Challenge 3

### Challenge Instruction

Before we can run and see our cells we'll need to set the `dataSource` `@property` of our table view. Do this in the `viewDidLoad`.

### Answer

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds];
    self.tableView.dataSource = self;
    [self.view addSubview:self.tableView];
}
```

Run the app! Make sure to scroll all the way down to the bottom. See if you notice anything...

## Challenge 4

### Video

Now we've got a bunch of table view cells being shown but if you scrolled all the way down to the bottom of the table view you probably noticed an issue: some of the cells are covered up by the tab bar! 

![image](https://dl.dropbox.com/s/kqaqa6wrraz28eg/tabbar_obstructed_cells.png)

That's not good. If we use some `NSLog` statements in the `viewDidLoad` and `viewDidAppear` methods we can see what's going on:

```
Level-04[2357:c07] viewDidLoad   -  self.view.frame {{0, 20}, {320, 460}}
Level-04[2357:c07] viewDidAppear -  self.view.frame {{0, 0}, {320, 367}}

Level-04[2357:c07] viewDidAppear -  self.tableView.frame {{0, 0}, {320, 460}}
Level-04[2357:c07] viewDidLoad   -  self.tableView.frame {{0, 0}, {320, 460}}
```

The `view` seems to be changing it's frame but the `tableView` is staying the same! To see why this is happening let's look at how container views work again.

(TODO: see [this keynote](https://www.dropbox.com/s/21hmgbq8i4olbc9/container-controller-autoresize-example.key))

The `FeedViewController`'s `view` is being created automatically so it's `autoresizingMask` is setup. Thus, when the view controller is added it's container view controllers, the `view` adjusts accordingly. The table view stays the same size regardless of what happens to it's superview since it's `autoresizingMask` is not set.

Let's fix this.

### Challenge Instruction

Add a statement to set the `FeedViewController`'s `tableView` `autoresizingMask` so that it adjusts itself to fit the screen correctly.

### Answer

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds];
    self.tableView.autoresizingMask = UIViewAutoresizingFlexibleHeight;
    self.tableView.dataSource = self;
    [self.view addSubview:self.tableView];
}
```

Run it!

## Challenge 5

### Video

Here's the log output after we set the `self.tableView.autoresizingMask`:

```
Level-04[2357:c07] viewDidLoad   -  self.view.frame {{0, 20}, {320, 460}}
Level-04[2357:c07] viewDidAppear -  self.view.frame {{0, 0}, {320, 367}}

Level-04[2357:c07] viewDidAppear -  self.tableView.frame {{0, 0}, {320, 460}}
Level-04[2357:c07] viewDidLoad   -  self.tableView.frame {{0, 0}, {320, 367}}
```

Now that the table view is being correctly sized, let's add some text by using the a `@property` of the `UITableViewCell` called `textLabel`. The `textLabel` is a `UILabel` that is used to display a single line of text in a table view cell:

![Table View](http://cl.ly/image/0f331T082L3o/try-ios-tableview.png)

All the city names above are set using the `textLabel` `@property` of the `UITableViewCell`.

##### NSString stringWithFormat

Let's try displaying the row number of the cell. Up to this point, you've used `NSString`s but you've never created a string *dynamically*. To create a string with variable data, you'll want to use the `stringWithFormat:` method of `NSString`. This method lets you create a string with placeholders that get filled in by variables. If you're familar with C's `printf()` method, you'll catch on to this right away. Let's see an example:

```
[NSString stringWithFormat:@"You have %d unread notifications.", numberOfUnreadNotifications];
```

The code above would return something like: "You have 3 unread notifications." or "You have 12 unread notifications.". The `%d` is a special placeholder that is replaced with a variable of type `int`. You'll see that after we write what we want the string to look like, we place a comma followed by all the variables in the order we want them to appear in our string. In that example there was only one variable but we could have as many as we like:

```
[NSString stringWithFormat:@"The time is %d:%d:%d", hours, minutes, seconds];
```

There are many different types of placeholders that represent different types of variables. For instance, a `%@` represents an object. So,

```
[NSString stringWithFormat:@"Object: %@", someViewController];
```

Would print something like this: "Object: <UIViewController: 0x917e0a0>".

Let's try this out. Check out [this doc](https://developer.apple.com/library/ios/#documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html) if you want to know all the special format placeholder (or "specifiers").

### Challenge Instruction

In the `UITableViewDataSource` method where we create the cell, set the cell's `textLabel` to show the cell's row number using `indexPath.row`. 

### Answer

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *postCell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"postCell"];
    [postCell.textLabel setText:[NSString stringWithFormat:@"Row %d", indexPath.row]];
    return postCell;
}
```

## Challenge 5

### Video

Now, we've displayed rows which is great but something equally important is being able to trigger an event when a row is tapped. To do this we're going to use the *delegate* pattern by introducing `UITableViewDelegate`. A `UITableViewDelegate` is a class that acts on behalf of the table view. For instance, if a row of the table is tapped the `UITableViewDelegate` responds to it. 

Here are some `UITableViewDelegate` methods we will be using in this course:

```
@protocol UITableViewDelegate<NSObject, UIScrollViewDelegate>
@optional
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath;
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath;
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
@end
```

There's a lot more of them so be sure to read up on them in the Apple Docs. For now, let's focus on this one:

```
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
```

This delegate method is called whenever a user taps a cell of the table view. As you can see, it passes in the `indexPath` of the cell that was tapped.

Lastly, a `UITableView` can be given a delegate by assigning an object conforming to `UITableViewDelegate` to the table view's `delegate` `@property`.

Let's try it out.

### Challenge Instruction

First, have the `FeedViewController` class conform to the `UITableViewDelegate` `@protocol`. Next, implement the following method in the `FeedViewController`:

```
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath;
```

Lastly, be sure to make the `FeedViewController` the `delegate` of the table view! 

### Answer

> FeedViewController.h

```
@interface FeedViewController : UIViewController <UITableViewDataSource, UITableViewDelegate>
```

> FeedViewController.m

```
- (void)viewDidLoad
{
    ...
    self.tableView.delegate = self;
    ...
}
```

```
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}
```

## Challenge 6

### Video

Often times, it's useful to get the actual `UITableViewCell` that was selected. `UITableView` provides for us a method for doing just that called `cellForRowAtIndexPath:`. This method takes in an `NSIndexPath` (like the one that is passed into `tableView:didSelectRowAtIndexPath:`) and returns the `UITableViewCell` for that path. Let's try using this.

### Challenge Instruction

In the `tableView:didSelectRowAtIndexPath:` method, create a new instance of the `FeedViewController` and push it onto the navigation controller!

Remember you can access the navigation controller through the `navigationController` `@property` and push view controllers to it using `pushViewController:animated:`.

Lastly, give the new view controller a title. Try setting the `title` of the new view controller to the currently selected cell's `textLabel`'s `text`. 

### Answer

```
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    FeedViewController *newFeedView = [[FeedViewController alloc] init];
    newFeedView.title = [[[tableView cellForRowAtIndexPath:indexPath] textLabel] text];
    [self.navigationController pushViewController:newFeedView animated:YES];
}
```

## Challenge 7

### Challenge Instruction

Did you notice that the cells stayed selected after we nagivate back from the pushed view controller? Let's fix this by adding this line to the `tableView:didSelectRowAtIndexPath:` method:

```
[tableView deselectRowAtIndexPath:indexPath animated:YES];
```

Self explanatory right?

### Answer

```
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    FeedViewController *newFeedView = [[FeedViewController alloc] init];
    newFeedView.title = [[[tableView cellForRowAtIndexPath:indexPath] textLabel] text]; // optional
    [self.navigationController pushViewController:newFeedView animated:YES];
}
```

## Challenge 8

### Video

Often times, you'll want to change the background color of a cell. We would expect to add something like this to the `tableView:cellForRowAtIndexPath:` method:

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    ...
    postCell.backgroundColor = [UIColor lightGrayColor];
    ...
}
```

However, if we run that code, this is what we'll see:

![no color :(](https://dl.dropbox.com/s/3gahw9iz0sovya8/tableview.png)

Not what we expected. Let's check the [UITableViewCell Apple Documentation](http://developer.apple.com/library/ios/#documentation/uikit/reference/UITableViewCell_Class/Reference/Reference.html):

> Note: If you want to change the background color of a cell (by setting the background color of a cell via the backgroundColor property declared by UIView) you must do it in the tableView:willDisplayCell:forRowAtIndexPath: method of the delegate and not in tableView:cellForRowAtIndexPath: of the data source. 

Looking at the `tableView:willDisplayCell:forRowAtIndexPath:` notes we see why:

> This method gives the delegate a chance to override state-based properties set earlier by the table view, such as selection and background color.

So basically, after the cell is created, the table view sets some state-based properties which includes background color and that will override whatever background color you have already set on the cell. Looks like we'll need to implement `tableView:willDisplayCell:forRowAtIndexPath:` in order to change a cells background color. Notice that this method passes in a `UITableViewCell` for you to modify. Make sure you use that cell!

Knowing that, let's try setting the background color of a cell the correct way.

### Challenge Instruction

Implement the `UITableViewDelegate` method `tableView:willDisplayCell:forRowAtIndexPath:`. Add the Change the background color of the cells in the `FeedViewController` to anything other than `[UIColor whiteColor]`.

### Answer

```
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    cell.backgroundColor = [UIColor lightGrayColor];
}
```

## Challenge 9

### Challenge Instruction

Nice! Take some time to play around with the table view. Change the number of rows, change the text, or make every other row blue. Make sure you understand how everything we covered works before continuing.

If you want a fun challenge try to recreate the look of the "Clear" app:

![image](https://dl.dropbox.com/s/v8kh1s0rkdoyb38/tableview-clear.png)

**Hint:** Try to figure out what `[UIColor colorWithHue: saturation: brightness: alpha:]` and `self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone` do. They will help you out!

### Answer

```
- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds];
    self.tableView.autoresizingMask = UIViewAutoresizingFlexibleHeight;
    self.tableView.dataSource = self;
    self.tableView.delegate = self;
    self.tableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    [self.view addSubview:self.tableView];
}
```

```
- (void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    UIColor *newColor = [UIColor colorWithHue:359.0 saturation:(((CGFloat)indexPath.row / 15.0) * 0.9) + 0.1 brightness:1.0 alpha:1.0];
    cell.backgroundColor = newColor;
}
```