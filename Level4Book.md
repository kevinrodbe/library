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

### UITableViewDataSource

