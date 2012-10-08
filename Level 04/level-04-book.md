# Level 4

### Goals

* Learn how to us `UITableView`s to display static data.
* See how `UITableView` uses both the *delegation* and *datasource* pattern.
* Learn how to overcome three common pitfalls: reusing cells correctly, changing a cell's backgound color, and displaying cells of variable height.
* See how interface build can aid in the creation of cells.

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

Nice! Now you've got a `UITableView` up and running but it's not displaying any data. When you think of a table it's easy imagine that you could just give the table an array of objects and POOF: it would display them. But that's not how `UITableView`s work. Instead, `UITableView`s follow a pattern called the *datasource pattern*. There are other classes in `UIKit` that follow this, most notably, iOS 6's new `UICollectionView`s.

In the *datasource pattern*...

```
@protocol UITableViewDataSource <NSObject>
@required

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath;

@optional

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView;

@end
```

### Challenge Instruction

### Answer

Yea! Now let's add data using datasource protocol.

## Challenge 3

### Video

### Challenge Instruction

### Answer

What about clicking rows? Add delegate.

Try pushing. Set title of view controller to push to cell text.

## Challenge 4

### Video

### Challenge Instruction

### Answer

How cells are reused. Show example of messed up images.

## Challenge 5

### Video

### Challenge Instruction

### Answer

Variable height cells. You will come across this at some point. Talk
about how that method us run for all cells at the beginning.

## Challenge 6

### Video

### Challenge Instruction

### Answer

Changing cell background color.

## Challenge 7

### Video

### Challenge Instruction

### Answer

Reloading data.

## Challenge 8

### Video

### Challenge Instruction

### Answer

Using interface builder to make cells. Easy right? Make instaphoto cells.

Nice! Play around a bit with this now. Make sure you understand how
everything is working. Next level: dynamic table cells.