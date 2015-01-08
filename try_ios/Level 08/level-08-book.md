# Level 8

### Goals

* Understand modal view controllers.
* Exploring the "delegation" pattern a bit further.
* How to use UIImagePickerController.

### User Knowledge Assumptions

* Basic understanding of delegation.
* UIViewController
* How to create Objective-C protocols and classes.

There is a lot of material here. It's important to keep the student's attention and part of that means not making them write code they've already written before. Therefore, the videos and instructional material here will "write" a bit more boiler-plate code than usual so that when the user actually gets around to the challenge, they can do something new and see some results in the simulator.

## Challenge 1

### Video

Now, we are going to introduce a core navigation component called "Modal View Controllers".

Modal view controllers are special `UIViewControllers` that are presented temporarily to collect or show some information. Login screens, some sign-up screens, and the iOS Mail app's compose new message screen are all examples of modal view controllers.

It's important to understand that they are an *interruption* from what the user is currently doing. Iterruptions don't have to be bad but it means that eventually, you will get back to what you *were* doing. When modals are presented, they generally take up the full screen and when they are dismissed, the user is right back where they started.

In this level we are going to create a modal view controller that allows the user to select a profile picture. Remember, a *modal* is just a `UIViewController` so when we want to display a modal we can instantiate the view controller just like we normally would. What makes makes the view controller modal is how we *present* it. Modal view controllers are always presented from another view controller using the `- (void)presentViewController:(UIViewController *)viewControllerToPresent animated:(BOOL)flag completion:(void (^)(void))completion` method. When this message is passed to a `UIViewController` it presents the `viewControllerToPresent`, optionally animating it based on `flag` and optionally running a `block` once the modal view controller has been presented. Just ignore the last `block` parameter for now.

That's all you need to get something up and running. Let's try this out now. You'll notice we added a `UIButton` in the `UserProfileViewController` for this as well as a `UIImageView` for displaying the image we will eventually select. Check out the `UserProfileViewController` header for the new properties before you begin the first challenge. Good luck!

### Challenge Instruction

Did you see the new IBAction in the header we created for the button? Let's put some code in it now to display our modal view controller. 

In the `- (void)selectPictureButtonWasPressed:(id)sender` method of `UserProfileViewController`, present a modal view controller that has a `[UIColor redColor]` background. Remember, just pass `nil` in for the last parameter of the `presentViewController:animated:completion:` message.

Hints (if the user needs them):

1. Create a local `UIViewController` instance.
2. Give the local VC a `UIView`. Remember to set the frame of the `UIView`… using `[[UIScreen mainScreen] bounds]` is a good way to do that.
3. Most `[viewController.view setBackgroundColor:[UIColor someColor]];`.
4. Display the modal in the current view controller by sending the `presentViewController:animated:completion:` message to the `UserProfileViewController`.

> ##### Coding Tip
> If you want to change the modal's transition style you can use the `setModalTransitionStyle:` method of the *modal view controller* (not the one that is presenting it). Below are some of the styles you can use:

> ```
typedef enum {
    UIModalTransitionStyleCoverVertical = 0,
    UIModalTransitionStyleFlipHorizontal,
    UIModalTransitionStyleCrossDissolve,
    UIModalTransitionStylePartialCurl,
} UIModalTransitionStyle;
```

> The `UIModalTransitionStyleCrossDissolve` style is mostly used for displaying an alternate interface when the device changes orientation or for displaying some type of media.

### Answer

```
UIViewController *imagePickerViewController = [[UIViewController alloc] init];
imagePickerViewController.view = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
[imagePickerViewController.view setBackgroundColor:[UIColor lightGrayColor]]; // optional
[self presentViewController:imagePickerViewController animated:YES completion:nil];
```

All set? Run the code and click on our new button!

## Challenge 2

### Video

So we have a problem right? By default, there is no functionality to *close* the modal! 

There is only one method that closes a modal and it's called `dismissViewControllerAnimated:completion:`. The most simple solution (and one that you will commonly see) is to have the modal dismiss itself. However, this can lead to confusing code and may present issues down the road. In general, it's best to *dismiss* a modal view controller from the same view controller that *presented* it. This is the Apple way: the modal view controller will communicate back to it's presenting view controller when an imporant event occurs (e.g. the user clicks "done" and the modal should be *dismissed*). This communication between objects means we are going to be using a design pattern we've talked about often… (hint: it starts with a "D")

### Answer

```
delegation
```

### Video

We're mentioning *delegation* a lot because it's really important! It's critical that you try think in terms of "delegates" and "interfaces" when designing your code.

Since we are designing a modal that will allow the user to pick a profile picture, there is going to be some communication going on between the view controllers. Let's look at what we'll need to do:

1. Create a custom `UIViewController` to act as our modal view controller.
2. Create a protocol that defines how the *delegate* of our custom `UIViewController` should behave.

Let's do that first part now.

### Challenge Instruction

In this empty header file, create a subclass of `UIViewController` and name it `ImagePickerViewController`. Give it a `@property` of type `id` and name the `@property` "delegate". Make sure the property is `weak` (remember: we don't "own" the delegate). Don't worry about writing the `@implemenation` for the class yet.

### Answer

```
@interface ImagePickerViewController : UIViewController
@property (weak, nonatomic) id delegate;
@end
```

## Challenge 3

### Video

Giving a class a *delegate* is pretty simple huh? It's really just a `property`. For step two, we'll need to create the delegate `@protocol`. In other words, create a `@protocol` that defines messages the `ImagePickerViewController` will want to send to it's delegate. In our case, we only need to send two messages to our delegate:

1. "the user selected a profile image"
2. "the user cancelled and wants to return" 

> For this next part, displaying some diagrams would help a lot!

Here's how all of this will work from a high-level view: the `UserProfileViewController` will create a `ImagePickerViewController`. Then we will make the `UserProfileViewController` the `delegate` of the `ImagePickerViewController`. Then the `UserProfileViewController` will present the `ImagePickerViewController` and depending on what the user does the `ImagePickerViewController` will send a message back to it's delegate: the `UserProfileViewController`.

Got that? Listen to that part again if you are still unclear. If you feel like you understand that let's go ahead and create that delegate `@protocol`.

### Challenge Instruction

Head over to the `ImagePickerViewController` header that we made. In here, you'll want to create the delegate `@protocol`. 

Create a `@protocol` called `ImagePickerDelegate` and give it two methods: 

1. `- (void)imagePicker:(ImagePickerViewController *)imagePicker didSelectImage:(UIImage *)image;`
2. `- (void)imagePickerWasCancelled:(ImagePickerViewController *)imagePicker;`

Remember, `@protocols` are created similarly to classes:

```
@protocol <protocol-name> 
@end
```

> ##### Coding Tip
>Be sure to make use of the `@required` and `@optional` keywords in your `@protocol` definitions. `@required` means that any object conforming to your protocol *must* implement the `@required` methods or the compiler will throw you a warning and/or very bad things will happen. If you do not specify any keyword, the default is @required.

> Also, despite the fact that you may flag some `@protocol` methods as `@required`, the code of a class conforming to your `@protocol` will still compile even if some `@required` methods are missing. Pay attention to any warnings you may get while your app is compiling!

### Answer

```
@protocol ImagePickerDelegate
- (void)imagePicker:(ImagePickerViewController *)imagePicker didSelectImage:(UIImage *)image;
- (void)imagePickerWasCancelled:(ImagePickerViewController *)imagePicker;
@end
```

## Challenge 4

### Video

Alright, we've got the delegate `@property` and our `@protocol` in our `ImagePickerViewController` but we've got a few more things we need to do before we can test this out.

First, even though we've defined our delegate property as a generic `id`…

```
@property (weak, nonatomic) id delegate;
```

… we know that it is always going to conform to our `ImagePickerDelegate` `@protocol`. Let's change change our `delegate` variable's type to a generic object that *conforms* to the `ImagePickerDelegate` protocol:

```
@interface ImagePickerViewController : UIViewController
@property (weak, nonatomic) id<ImagePickerDelegate> delegate;
@end
```

Much better. In Objective-C, putting a `@protocol` name in `< >` tags after a object type denotes that the object should conform to that `@protocol`.  Now the compiler will throw a warning if an object that doesn't conform to the `ImagePickerDelegate` protocol is assigned to the `delegate` `@property`. Now we'll have the `UserProfileViewController` class conform to our new `@protocol`:

```
@interface UserProfileViewController : UIViewController <ImagePickerDelegate>
```

Next, we'll jump over to the implementation file and add the methods required of an `ImagePickerDelegate`. For now we'll just add the code to dismiss the modal using the `dismissViewControllerAnimated:completion:` method we talked about earlier:

```
- (void)imagePicker:(ImagePickerViewController *)imagePicker didSelectImage:(UIImage *)image
{
	[self dismissViewControllerAnimated:YES completion:nil];
}

- (void)imagePickerWasCancelled:(ImagePickerViewController *)imagePicker
{
	[self dismissViewControllerAnimated:YES completion:nil];
}
```

Next, we'll need to setup the `ImagePickerViewController` view. We'll also need to add the buttons that allow the user to dismiss the modal. For now, let's just add the cancel button. We'll put our code in the `ImagePickerViewController's` `- (void)loadView` method since we are manually creating the `UIView`. You should already know how to do most of this:

```
- (void)loadView
{
    // Create the view
    self.view = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    // Create the cancel button
    UIButton *cancelButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    cancelButton.frame = CGRectMake(15, 15, 72, 37);
    [cancelButton addTarget:self action:@selector(cancelButtonWasPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:cancelButton];
}
```

And finally, we'll implement our cancel button's action in the same file. Here, we'll let the `delegate` know the user wants to cancel:

```
- (void)cancelButtonWasPressed:(id)sender
{
    [self.delegate imagePickerWasCancelled:self];
}
```

Alright, that was a lot of work so let's write some code now. In the next challenge you'll instantiate our new modal view controller and display it. Be sure to check out the new additions we made in all the source files!

### Challenge Instruction

Change the code in the `- (void)selectPictureButtonWasPressed:(id)sender` method of `UserProfileViewController` to instantiate our new `ImagePickerViewController` and set the `delegate` property.

### Answer

```
ImagePickerViewController *imagePickerViewController = [[ImagePickerViewController alloc] init];
imagePickerViewController.delegate = self;
[self presentViewController:imagePickerViewController animated:YES completion:nil];
```

Let's test out our working modal!

## Challenge 5

### Video

Before we move on there is one more thing you should know about using `@protocols` for delegation. As mentioned in an earlier tip, it's a good idea to use the `@required` and `@optional` keywords when defining `@protocols`. However, be sure to check whether or not a delegate has actually implemented your `@optional` methods! Since most `delegate's` are of the generic `id` type you could pontentially call any method on the `delegate` object… even one that it doesn't have. To make sure this doesn't happen you can use a `NSObject` method called `- (BOOL)respondsToSelector:(SEL)aSelector`. This simply tells you whether or not the object implements a certain method (or "responds to a certain message or selector"). If we added it to our `- (void)cancelButtonWasPressed:(id)sender` method it would look like this:

```
- (void)cancelButtonWasPressed:(id)sender
{
    if ([self.delegate respondsToSelector:@selector(imagePickerWasCancelled:)]) {
        [self.delegate imagePickerWasCancelled:self];
    }
}
```

Now, creating that modal ourselves was a lot of work and it's going to be even more work writing the code that actually allows the user to select the images. It's good that you got some experience doing that because you will inevitably be creating your own custom modals. However, there is a much easier way to accomplish the task of allowing the user to choose a profile picture. Let's talk a little about this class which is called `UIImagePickerController`.

The `UIImagePickerController` is a modal view controller that allows the user to choose a photo saved on their device. Once they have chosen a photo, the `UIImagePickerController` tells it's delegate and gives it the photo.

We can instantiate a `UIImagePickerController` just like any other view controller:

```
UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
imagePicker.delegate = self;
imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
```

Next, we'll give it the delegate:

```
UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
imagePicker.delegate = self;
imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
```

And lastly, we'll tell it to give the user a selection of photos from their devices photo library:

```
UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
imagePicker.delegate = self;
imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
```

The `UIImagePickerControllerSourceTypePhotoLibrary` type can be replaced by `UIImagePickerControllerSourceTypeCamera` to allow the user to take a photo instead of choosing one.

In addition to the `UIImagePickerController` there are also modals for sending text messages, emails, choosing contacts and playing media.

![address/contact modals](https://dl.dropbox.com/s/ka0d7l6lyj9u94o/address-contact-modals.png)

What is nice about using these classes is that we keep the user working in a UI they are familiar with. Following UI design patterns is especially important when creating mobile apps. Just keep this in mind when creating custom controls, modals, or navigations.

In the next 2 challenges we'll implement `UIImagePickerController` and set the profile image.

## Challenge 6

### Challenge Instruction

Here's the definition of the `UIImagePickerDelegate` `@protocol`:

```
@optional
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info;
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker;
```

Have the `UserProfileViewController` conform to this protocol, replacing the old `ImagePickerDelegate` and implement all the delegate methods listed above. Inside each method, call the `UIViewController` method to dimiss the modal.

### Answer

> UserProfileViewController.h

```
@interface UserProfileViewController : UIViewController <UIImagePickerDelegate>
```

> UserProfileViewController.m

```
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
	[self dismissViewControllerAnimated:YES completion:nil];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
	[self dismissViewControllerAnimated:YES completion:nil];
}
```

## Challenge 7

### Challenge Instruction

Change the code in the `- (void)selectPictureButtonWasPressed:(id)sender` method of `UserProfileViewController` to instantiate a `UIImagePickerController` object. Remember to set the delegate and sourceType.

### Answer

```
- (void)selectPictureButtonWasPressed:(id)sender
{
	UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
	imagePicker.delegate = self;
	imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
	[self presentViewController:imagePicker animated:YES completion:nil];
}
```

Check out the new image picker!

## Challenge 8

### Video

That was pretty easy right? Before recreating basic functionalities be sure to search around to make sure someone didn't already do it for you.

In this final challenge, we'll set the profile image to the `UIImageView` we put earlier in the `UserProfileViewController` view. Many times, when many values need to be passed through a method, the values are placed in a `NSDictionary`. This is the case with the `UIImagePickerDelegate's` `imagePickerController:didFinishPickingMediaWithInfo:` method.

### Challenge Instruction

In the `- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info` method, set the image of `profileImageView` to be the be the `UIImage` the user selected. Get the image using the `UIImagePickerControllerOriginalImage` key.

```
// Keys for dictionary passed to the UIImagePickerDelegate.
NSString *const UIImagePickerControllerMediaType;
NSString *const UIImagePickerControllerOriginalImage;
NSString *const UIImagePickerControllerEditedImage;
NSString *const UIImagePickerControllerCropRect;
NSString *const UIImagePickerControllerMediaURL;
NSString *const UIImagePickerControllerReferenceURL;
NSString *const UIImagePickerControllerMediaMetadata;
```

### Answer

```
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
	[self.profileImageView setImage:[info objectForKey:UIImagePickerControllerOriginalImage]];
	[self dismissViewControllerAnimated:YES completion:nil];
}
```

Try it out!