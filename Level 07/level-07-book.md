# Level 7

### Goals

* Creating the user profile page
* Understanding UITextFields and the UITextField delegate
* Using UITapGestureRecognizer.

### User Knowledge Assumptions

* We have built our app using a storyboard.
* The main view controller is a tab view controller.
* The user already has some experience with `@selectors`.
* The user has a basic understanding of how delegation works.

## Challenge 1

### Video 

In this level, we're going to create the *User Profile* page for the InstaPhoto user. Usually you'll want to create separate views for viewing and editing the profile but we're going to just focus on building the "editing" view.

The first thing we're going to do is get familar with a very useful `UIKit` control: the `UITextField`. The vast majority of all text input in iOS is done through `UITextFields`. It's very easy to customize their appearance as well as their behavior thanks to *delegation*. Most of the time you'll be changing the appearance of your `UITextFields` in the interface builder but you will find cases where you'll need to do this by hand. We'll guide you through some of this in the first few challenges.

We'll also go ahead and add some `UITextFields` to the story board for you so you can jump right into the code. Be sure to check out the new `UITextFields` properties in `UserProfileViewController` header because you'll need them for the these challenges.

### Challenge Instruction Pt 1

In this first challenge, let's stylize our `UITextFields`. In the `viewDidLoad`. Let's add a little "clear the text" button to right hand side of the text field by using the `UITextField` method `setClearButtonMode:`. The default value for this property is `UITextFieldViewModeNever`. Try changing it to: `UITextFieldViewModeWhileEditing`.

### Answer 1

```
[self.nameFirstTextField setClearButtonMode:UITextFieldViewModeWhileEditing];
[self.nameLastTextField setClearButtonMode:UITextFieldViewModeWhileEditing];
[self.emailTextField setClearButtonMode:UITextFieldViewModeWhileEditing];
```

### Challenge Instruction Pt 2

Next, let's change the actual appearance of the `UITextField`. Use the `setBorderStyle:` method to change the border style. Here are the valid styles:

```
typedef enum {
    UITextBorderStyleNone,
    UITextBorderStyleLine,
    UITextBorderStyleBezel,
    UITextBorderStyleRoundedRect
} UITextBorderStyle;
```

### Answer 2

```
[self.nameFirstTextField setBorderStyle:UITextBorderStyleLine];
[self.nameLastTextField setBorderStyle:UITextBorderStyleLine];
[self.emailTextField setBorderStyle:UITextBorderStyleLine];
```

## Challenge 2

Next, let's change the keyboard type for the `UITextFields`. The keyboard type determines what type of keyboard appears when the `UITextField` has focus. We can leave the name fields on the default keyboard but let's change the `emailTextField` to use `UIKeyboardTypeEmailAddress` via the `setKeyboardType:` method.

### Answer

```
[self.emailTextField setKeyboardType:UIKeyboardTypeEmailAddress];
```

Nice! Below are some additional keyboard to try out.

```
typedef enum {
    UIKeyboardTypeDefault,                // Default type for the current input method.
    UIKeyboardTypeASCIICapable,           // Displays a keyboard which can enter ASCII characters, non-ASCII keyboards remain active
    UIKeyboardTypeNumbersAndPunctuation,  // Numbers and assorted punctuation.
    UIKeyboardTypeURL,                    // A type optimized for URL entry (shows . / .com prominently).
    UIKeyboardTypeNumberPad,              // A number pad (0-9). Suitable for PIN entry.
    UIKeyboardTypePhonePad,               // A phone pad (1-9, *, 0, #, with letters under the numbers).
    UIKeyboardTypeNamePhonePad,           // A type optimized for entering a person's name or phone number.
    UIKeyboardTypeEmailAddress,           // A type optimized for multiple email address entry (shows space @ . prominently).
    UIKeyboardTypeDecimalPad,             // A number pad with a decimal point.
    UIKeyboardTypeTwitter,                // A type optimized for twitter text entry (easy access to @ #)
} UIKeyboardType;
```

Interface Builder makes it easy to switch keyboards as well:

![Additional Keyboards](https://dl.dropbox.com/s/0cutdmoyok9gyqc/keyboard_types.png)

Before you continue to the next challenge try setting some other properties like `setTextColor:` or `setBackgroundColor:`. Additionally, you can set set placeholder text by using the `setPlaceholder:` method. Click the [more info icon] over there to learn a little more about `UIColors`.

> ##### Coding Tip
> The `UIColor` class offers many preset colors. To use a preset color, simply call one of these class level methods:

> ```
// Usage: [UIColor lightGrayColor]
+ (UIColor *)blackColor;      // 0.0 white 
+ (UIColor *)darkGrayColor;   // 0.333 white 
+ (UIColor *)lightGrayColor;  // 0.667 white 
+ (UIColor *)whiteColor;      // 1.0 white 
+ (UIColor *)grayColor;       // 0.5 white 
+ (UIColor *)redColor;        // 1.0, 0.0, 0.0 RGB 
+ (UIColor *)greenColor;      // 0.0, 1.0, 0.0 RGB 
+ (UIColor *)blueColor;       // 0.0, 0.0, 1.0 RGB 
+ (UIColor *)cyanColor;       // 0.0, 1.0, 1.0 RGB 
+ (UIColor *)yellowColor;     // 1.0, 1.0, 0.0 RGB 
+ (UIColor *)magentaColor;    // 1.0, 0.0, 1.0 RGB 
+ (UIColor *)orangeColor;     // 1.0, 0.5, 0.0 RGB 
+ (UIColor *)purpleColor;     // 0.5, 0.0, 0.5 RGB 
+ (UIColor *)brownColor;      // 0.6, 0.4, 0.2 RGB 
+ (UIColor *)clearColor;      // 0.0 white, 0.0 alpha 
```

Additionally, check out these docs for additional `UITextField` properties: http://developer.apple.com/library/ios/#documentation/uikit/reference/UITextField_Class/Reference/UITextField.html

## Challenge 3

### Video

You might have noticed in the simulator that the "next" or "return" button on the keyboard did not actually do anything (unless you used the tab key - nice try, but iPhone users don't have!). This is the default behaviour. What's going on is the `UITextField`, when tapped, becomes the *first responder* (we'll explain this soon) and the keyboard is shown. When the return button is tapped on the keyboard, the `UITextField` notifies it's *delegate* of the event. Normally, the delegate would say "OK, you are done with getting text so let's make this other `UITextField` the *first responder*" but in our case we don't have a *delegate* so nothing happens. So, in this challenge we'll be making the *UserProfileViewController* the delegate of our *UITextFields*.

### Challenge Instruction

Open up the `UserProfileViewController` header and have the class conform to the `UITextFieldDelegate` protocol.

### Answer

```
@interface UserProfileViewController : UIViewController <UITextFieldDelegate>
```
## Challenge 4

### Challenge Instruction

Next, set the `delegate` properties of the `UITextFields` to the view controller. Try to think of where this code should go (hint: the delegate only needs to be set once when the main view is loaded).

### Answer

```
- (void)viewDidLoad
{
. . .
[self.nameFirstTextField setDelegate:self];
[self.nameLastTextField setDelegate:self];
[self.emailTextField setDelegate:self];
. . .
}
```

## Challenge 5

### Challenge Instruction

Now implement the `textFieldShouldReturn:` method of the `UITextFieldDelegate` protocol. There are many other methods in the `UITextFieldDelegate` protocol but this is the only one we are interested in right now. The `textFieldShouldReturn:` method will be called everytime a user presses the *return* button on the keyboard. Here, you'll want to check to see what `UITextField` has just returned and then give *focus* to the next `UITextField`. To give *focus* to the next `UITextField` you will want send the `becomeFirstResponder` message to that object (i.e. call the `becomeFirstResponder` method).

Tip: You can used the `==` operator to compare the `UITextField` properties of the class with the `UITextField` that is passed in by the `textFieldShouldReturn:` method.

### Answer

```
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    if (textField == self.nameFirstTextField) {
        [self.nameLastTextField becomeFirstResponder];
    }
    else if (textField == self.nameLastTextField) {
        [self.emailTextField becomeFirstResponder];
    }
    return YES;
}
```
Run the app and bask at how efficient you've made text input!

> ##### Coding Tip
> The `becomeFirstResponder` method comes from the `UIResponder` class. Every `UIView` is a `UIResponder` and every `UIControl` is a `UIView`. It's important to understand how events are handled in iOS so check out these Apple docs: http://developer.apple.com/library/ios/#documentation/general/conceptual/Devpedia-CocoaApp/Responder.html

<tip breaker />

> ##### Coding Tip
> By creating a category on a UITextField you can set up the "next text field" visually via a NIB/storyboard by ctrl+dragging. See https://gist.github.com/3708643 for more details.

## Challenge 6

### Video

One last thing you may have noticed in the previous challenge was that the keyboard didn't go away. You can imagine that if there were more text fields or other elements on the screen this would be problematic. Fortunately, *dismissing* the keyboard is pretty easy.

We'll start with a simple use case where a user just wants to "get out" of a `UITextField`. Naturally, people will often tap the background or some open space. Let's make tapping the background *dismiss* the keyboard. If you remember, you used the `- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event` method in the first level to handle touches. This time, we are going to introduce a new `UIKit` class specifically designed to handle gestures, like a "tap", called `UITapGestureRecognizer`. `GestureRecognizer` classes do all the heavy-lifting of recognizing gestures. All the basic gestures, tapping, double tapping, long press, swiping, pinching, and panning are built in so check them out.

![gestures](https://dl.dropbox.com/s/wrfr6bch0sk707g/gestures.png)

The vast majority of the time you'll want to use one of these classes before rolling your own gestures (trust me, gestures are more work than you think).

After you create a `GestureRecognizer` you'll need to pass it a `target` (i.e. any object) and an `action` (i.e. a method in the `target`). This is exactly the same to how you setup `IBActions` in the previous levels. Remember: to pass methods around we wrap the method name with `@selector()` so it looks like this: `@selector(<method-name>)`. That whole chunk of code is called a `selector`.

Lastly, you need to associate the `GestureRecognizer` with a `UIView`. You do this by calling `[myView addGestureRecognizer:myGestureRecognizer]`.

Let's try this out.

### Challenge Instruction

Instantiate a new `UITapGestureRecognizer` using `alloc` and `initWithTarget:andAction:`. Make the `target` equal to `self` and the `selector` equal to `@selector(dismissKeyboard:)`.

(Notice the colon at the end of the method name. This simply means that the selector has a single parameter. A selector with multiple parameters might look something like this: `@selector(createUserWithName:andPassword:)`)

### Answer

```
// This code should go in the viewDidLoad method.
UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissKeyboard:)];
[self.view addGestureRecognizer:tapGesture];
```

## Challenge 7

**(might skip this level and just make this a tip)**

### Challenge Instruction

By default `GestureRecognizers` cancel all other touches. Add a line right below where you instantiated the tap gesture and pass `setCancelsTouchesInView:NO` to the gesture. This will prevent the gesture from interefering with anything else that might be going on.

### Answer

```
// This code should go in the viewDidLoad method and replace the previous challenge's code.
UITapGestureRecognizer *tapGesture = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismissKeyboard:)];
[tapGesture setCancelsTouchesInView:NO];
[self.view addGestureRecognizer:tapGesture];
```

## Challenge 8

### Video

We can almost run our app. We just need to create the method we passed to the `GestureRecognizer`. Right now, the app would compile and build but tapping would cause a crash. In the next challenge we'll add that method and have it dismiss the keyboard. We can dimiss the keyboard by calling `[self.view endEditing:YES];`. What `endEditing:` does is recursively check all subviews of the caller (`self.view`) and when it finds the *first responder* it asks it to resign. Since we passed `YES` it actually *forces* the *first responder* to resign. Let's try this now.

### Challenge Instruction

At the end of the `UserProfileViewController` implementation file add the method: `- (void)dismissKeyboard:(id)sender` and have it dismiss the keyboard.

### Answer

```
- (void)dismissKeyboard:(id)sender
{
    [self.view endEditing:YES];
}
```

Run the app and check it out!

## Challenge 9

### Challenge Instruction

Now, let's handle the "return" of the last `UITextField`. Go back to the `textFieldShouldReturn:` method. If the `UITextField` we get from the method is `emailTextField`, let's call that method we made in the last challenge: `- (void)dismissKeyboard:(id)sender`. You can pass `self` in as the `sender` parameter since the view controller is the "sender" of the message (Got that? That pattern is used a lot in `UIKit`).

### Answer

```
else if (textField == self.emailTextField) {
	[self dismissKeyboard:self];
}
```

> ##### Coding Tip
> If you're wondering why we called the method we made as opposed to just calling `[self.view endEditing:YES]` again… it's because doing so is good practice. A few weeks into development you may want to also have something else happen when the keyboard is dismissed. Writing your code this way will save you time later!