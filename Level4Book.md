Level 4 - UITableView
---------------------

## Notes

### Concepts Covered

* What a table view is
* Creating a table view in code
  * Setting `self.view` in `-loadView`
  * Setting `dataSource`
* Implementing `UITableViewDataSource`
  * `-tableView:numberOfRowsInSection:` & `-tableView:cellForRowAtIndexPath:` with constant values
* Adding an `NSArray` property for the view controller
* Populating a table view using values in the array

---

## Content

### Video 1

Up until this point, we've created apps for a fixed screen size. Each UI component has been added and positioned individually, either with Interface Builder or in code by adding a subview and setting its `frame`. But what if we want to show more than what can fit on the screen at once? How can we configure our view to accomodate both small and large amounts of information. 

In this level, we're going to dive into one of the most important aspects of iOS development: table views.

![Table View](http://cl.ly/image/0f331T082L3o/try-ios-tableview.png)

Almost every app on your phone uses table views in some way. They're the way contacts are listed in the Phone app, and how albums, artists, and playlists are shown in the Music app. Even the conversation view in Messages secretly use table views under the covers.

<table>
  <tr>
    <td><img src="http://cl.ly/image/0j1y3y09220N/try-ios-phone-app.png"/></td>
    <td><img src="http://cl.ly/image/020k2k2I1j3G/try-ios-music-app.png"/></td>
    <td><img src="http://cl.ly/image/0r390k2y3m0f/try-ios-messages.png"/></td>
  </tr>
</table>

It's no surprise that table views are the foundation for so many apps: they provide a convenient and efficient way of systematically presenting information to the user.

Let's add a `UITableView` to our view controller's view:

```objective-c
- (void)viewDidLoad {
  [super viewDidLoad];

  UITableView *tableView = [[UITableView alloc] initWithStyle:UITableViewPlainStyle];
  tableView.frame = self.view.bounds;
  [self.view addSubview:tableView];
}
```

A lot of this should look familiar to you from Level 2. After we call `[super viewDidLoad]`, we create a `UITableView` object. `initWithStyle:` specifies the _style_ of the table view. There are two options: `UITableViewPlainStyle`, with rows and section headers and cells that span the entire width, and `UITableViewGroupedStyle`, with sections grouped into rounded rectangles.

<table>
  <tr>
    <th><tt>UITableViewPlainStyle</tt></th>
    <th><tt>UITableViewGroupedStyle</tt></th>
  </tr>
  <tr>
    <td><img src="http://cl.ly/image/0h0q3y3l0n0p/try-ios-tableview-plain.png"/></td>
    <td><img src="http://cl.ly/image/3U4009452U2s/try-ios-tableview-grouped.png"/></td>
  </tr>
</table>

Next, we'll set the frame of the table view to the `bounds` of `self.view` and add it as a `subview`. Remember that `bounds` is the `frame` of a view, but positioned at the origin, `(0,0)`, so by setting the `frame` to the `bounds` of its superview, it will completely overlap the superview.

**Build and Run**

If we build and run, we see our view, with an empty table view on top of it. Great! Now how do we get it to show information?

Rather than configure the table view directly, we'll have the table view ask the controller what it should show. This is an example of something known as the "Delegate Pattern", and is a something that is used throughout UIKit.

`UITableView` has a `dataSource` property, and it's up to the `dataSource` to determine how many rows are in the table view, and how each row's cell should be displayed. Our view controller would make a great `dataSource`, but in order for it to act as the table view `dataSource`, the view controller needs to implement a couple methods. 

The required and optional `dataSource` methods are specified in the `UITableViewDataSource` protocol. A protocol is just a list of methods, defined in the same way they would be in a class interface. When a class is said to _conform_ to an interface, (by adding the name of the protocol in `< >` after the subclass), that just means that the class is expected to implement those methods.

To go into a little bit more details, classes generally represent nouns, whereas protocols are more like adjectives. Consider an `Airplane` class with properties like `modelName` or `numberOfSeats`. `Airplane` could conform to the `Flyer` protocol, which has methods like `-flyFromLocation:toLocation:`. Other classes, like `Bird` could also conform to the `Flyer` protocol, while not being related to `Airplane` in any other way. Protocols allow objects to be passed around for what they can do, not what they are.

In the case of our `dataSource`, it doesn't matter what is telling what the table view should display--just so long as it is capable of doing that. The two required methods for a `dataSource` are `-tableView:numberOfRowsInSection:` and `-tableView:cellForRowAtIndexPath:`. 

Let's implement those now:

```objective-c
- (NSUInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSUInteger)section {
  return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  UITableViewCell *cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:nil];
  cell.textLabel.text = @"Hello!";

  return cell;
}
```

![Hello! Table View](http://cl.ly/image/262Q3x2c2K2c/try-ios-tableview-hello.png)

### Challenge 1

Take our existing table view data source, and change it so that instead of 1 row, it shows 10. And instead of showing "Hello!", have the cell display its row index in the label. (Hint: try using `NSString +stringWithFormat`.)

#### Solution

```objective-c
- (NSUInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSUInteger)section {
  return 10;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
  UITableViewCell *cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:nil];
  cell.textLabel.text = [NSString stringWithFormat:@"Row %d", indexPath.row];

  return cell;
}
```

### Video 2