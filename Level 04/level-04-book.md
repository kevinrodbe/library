# Level 4

### Goals

* Learn how to us `UITableView`s to display static data.
* See how `UITableView` uses both the *delegation* and *datasource* pattern.
* How the `autoresizingMask` works.
* Learn how to overcome two common pitfalls: changing a cell's backgound color and displaying cells of variable height.
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

The second method, `tableView:cellForRowAtIndexPath:`, actually creates the cell and returns it. It is important that an actual cell is actually returned from this method - if something else or a `nil` value is returned an exception will be thrown (i.e. your app will crash)!

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

##### NSString stringWithFormat

Let's try displaying the row number of the cell. Up to this point, you've used `NSString`s but you've never created string *dynamically*. To create a string with variable data, you'll want to use the `stringWithFormat:` method of `NSString`. This method lets you create a string with placeholders that get filled in by variables. If you're familar with C's `printf()` method, you'll catch on to this right away. Let's see an example:

```
[NSString stringWithFormat:@"You have %d unread notifications.", numberOfUnreadNotifications];
```

The code above would return something like: "You have 3 unread notifications." or "You have 12 unread notifications.". The `%d` is a special placeholder that is replaced with a variable of type `int`. You'll see that after we write what we want the string to look like we place a comma followed by all the variables in the order we want them to appear in our string. In that example there was only one but we could have as many as we like:

```
[NSString stringWithFormat:@"The time is %d:%d:%d", hours, minutes, seconds];
```

There are many different types of placeholders that represent different types of variables. For instance, a `%@` represents an object. So,

```
[NSString stringWithFormat:@"Object: %@", someViewController];
```

Would print something like this: "Object: <UIViewController: 0x917e0a0>".

Let's try this out. Check out [this doc](https://developer.apple.com/library/ios/#documentation/Cocoa/Conceptual/Strings/Articles/formatSpecifiers.html) for all the special format placeholder (or "specifiers").

### Challenge Instruction

### Answer


## Challenge 5

### Video

What about clicking rows? Add delegate.

Try pushing. Set title of view controller to push to cell text.

### Challenge Instruction

### Answer

## Challenge 6

### Video

Variable height cells. You will come across this at some point. Talk
about how that method us run for all cells at the beginning.

### Challenge Instruction

### Answer

## Challenge 7

### Video

Changing cell background color.

### Challenge Instruction

### Answer

## Challenge 8

### Video

Reloading data.

### Challenge Instruction

### Answer

## Challenge 9

### Video

Nice! Play around a bit with this now. Make sure you understand how
everything we covered works before continuing.

