# Try-iOS Level Outlines

### Level 0

Optional Objective-C Primer.

### Level 1

Creating a simple touch-responsive app.

* App Delegate
* Handling basic touches.

### Level 2

Creating a simple app with buttons.

* Introduction to Interface Builder
* Creating and using UIButtons.
* Using UIColors.

### Level 3

Laying the foundation for InstaPhoto: Container View Controllers.

* Introduction to UITabBarController.
	* Refactoring practice.
 	* Reviewing the view lifecycle.
* Brief introduction to UINavigationController.
* Using UIImage and UIImageView.

### Level 4

Creating the InstaPhoto Feed.

* Learn how to us `UITableView`s to display static data.
* See how `UITableView` uses both the *delegation* and *datasource* pattern.
* How the `autoresizingMask` works.
* Learn how to overcome a common pitfall: changing a cell's backgound color.
* How to use `NSString`'s `stringWithFormat:` method.

### Level 5

Making the InstaPhoto Feed pull real data. Networking with AFNetworking.

* Learn how to perform networking requests with AFNetworking.
* Understand Objective-C blocks and how they're used.
* Use a `UITableViewController` to display dynamic data.
* Get some more practice refactoring.

### Level 6

Improving the InstaPhoto Feed.

* Storyboard intro. How storyboards make creating cells easy. Let's make the posts pretty now.
* Over-coming a UITableView gotcha: resuable cells. Make sure you reset your UI!
* How to integrate Pull-To-Refresh.
* Variable height cells.
* Reloading Table data.

### Level 7

Editing the user's profile.

* Interacting with UITextFields.
* Keyboard considerations.
* Passing some data between view controllers.

### Level 8

Choosing a profile image (the hard way and the easy way)

* Understand modal view controllers.
* Exploring the "delegation" pattern a bit further.
* How to use UIImagePickerController.

### Level 9

Adding a "Slideshow" feature to the image feed.

* Learn some common ways data is passed around in iOS.
	* Global Variables
	* Singletons
* Understanding how `@protocols` can make passing data around safer and cleaner.
* How to use the `prepareForSegue:sender:` of `UIStoryboard` to pass data.
* NSTimer and alternatives.
	
### Level 10 

Creating the "Favorites" tab.

* See a better way to use the *Singleton Pattern*: user accounts.
* Store "Favorited" posts in user singleton.
* Display favorited posts in the "Favorites" tab using a UICollectionView.

### Level 11

Persistent Data

* Why aren't we using Core Data?
* Revisiting the UIApplicationDelegate Lifecycle.
* Understand NSUserDefaults.
* Understand NSKeyedArchiver class.
* Understand the NSCoding protocol.
	
### Level 12 

Tentative: Using Map Kit.

### Level 13

Tentative: Facebook & Twitter

* Learn how to use the new iOS 6 Facebook integration.
* Twitter integration.