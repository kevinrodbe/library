# Try Objective-C

## What is Objective-C

Quick Facts

* Objective-C is the primary language for developing Mac and iOS applications.
* Objective-C is a super-set of C. It literally means "C Objectified", or "Object Oriented C".
* Any C program can be compiled using an Objective-C compiler.
* Objective-C lends itself to being **verbose**. Clarity and consistency are important.

## Getting Started

One of the trickiest parts of understanding and becoming fluent in Objective-C is knowing when to use standard C code and when to use Objective-C.  Let's start with a little C.

### Statements

Each line of code in Objective-C is called a statement, and each statement ends with  a semicolon `;`, just like how each sentence in the English language ends with a period.

### Integers and Variables in C

Objective-C is a strongly-typed language, which means that you have to declare data types for your variables.

One of the simplest data types is `int`, which stores an integer.

* Type `int yourNum = "5";`

Congratulations, you just created your first variable!

Here's another variable we created for you: `int ourNum = "10";`

* Create a variable of type `int` called **sum**, and set it equal to **yourNum** plus **ourNum**

* Create a variable of type `int` called **difference**, and set it equal to **yourNum** minus **ourNum**

### Logging in C

To see the value of a variable in C you can use the `printf` function and pass the name of the variable and a formatting string that represents the data type of the variable you are trying to print to the console.  For example, to print the integer in the variable **yourNum**, you would type `printf("%d", yourNum);`

* Type `printf("%d", yourNum);`

Formatting strings are great, because they allow you to easily output several different values are once, and include helpful strings that keep the output organized.  For example, let's refactor the last statement to read `printf("The value of yourNum is: %d", yourNum);`

* Type `printf("The value of yourNum is: %d", yourNum);`

There are tons of different formatting strings, like `d`, `i`, `f`, `c`, `s`, and `p` just to name a few, and if you need to output more than one variable, just include multiple formatting strings and add the variable names as additional function arguments in the order that they appear in your output string.

	* print the message "yourNum is <yourNum> and ourNum is <ourNum> and their sum is <sum>, replacing the information in between the <brackets> with the values of those variables

### Integers and Variables in Objective-C

While not always true, you can be pretty sure you're working with Objective-C classes if you see data types starting with NS.  NS is short for NeXTStep, the OS developed by NeXT, which was purchased by Apple and eventually grew into OS X, which of course heavily influenced iOS. That's right, all of those NS's you see are remnants from those early versions.

**NSNumber** is a Class that can be used to manage any Objective-C primitive numeric data type.

Working with a Class that holds numeric data is conceptually similar to working with a primitive data type that holds numeric data, but the syntax of the required code looks very different.


#### Creating and Initializing Objects in Objective-C

There are usually 3 steps to creating objects in Objective-C

1. Allocate memory and initialize the object.
2. Set the initial state of the object by modifying properties (if necessary).
3. Set the initial value of the object.

Allocating memory is as simple as passing the `alloc` message to the Class of the object.  For example, if you want to allocate memory for an object of type NSData, you would pass the NSData Class the `alloc` message, like this: `[NSData alloc]`. Allocating memory is only half the battle - now that you have memory allocated for your new object, you have to initialize it.

The way to initialize an object is to pass your [ClassName alloc] the message `init`, and that's usually done all it one step, like this: `[[ClassName  alloc] init];`

* Try allocating and initializing (alloc/initing) an NSNumber object.

Now you've got your object, storing it should be as simple as following the pattern we established with primitive data types, right?  Right!?#$!#

* Go ahead, declare a variable named `age` of type `NSNumber` and set it equal to your alloc/init'd object.  We dare you.

ERRRORRRRRRRRRR `Interface type cannot be statically allocated`

It sounds complicated, but it's a pretty generic error message that in this case has to do with only one tiny, yet very important, mistake in our syntax.  To understand that mistake, we need to talk about pointers.

### Pointers

A pointer is a reference to a spot in memory.  When you declare a pointer and have it point to the value of a variable, the pointer itself doesn't contain the value, just the information about the location of the value.

