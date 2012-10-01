# Level 11

Persistent Data

### Goals

* Why aren't we using Core Data?
* Revisiting the UIApplicationDelegate Lifecycle.
* Understand NSUserDefaults.
* Understand NSKeyedArchiver class.
* Understand the NSCoding protocol.

### User Knowledge Assumptions

* Delegation
* Understands the Singleton Pattern
* Blocks

## Challenge 1

### Video

**Explain why we ~~aren't~~ can't teach Core Data in this course.**

That said, we're going to introduce you to two classes and a `@protocol` that will allow you to store data quickly and easily. The classes are `NSKeyedArchiver` and `NSKeyedUnarchiver` for storing and retrieving data, respectively, and the complimentary `@protocol` is `NSCoding` which has methods your classes will need to implement in order to be used by the archivers.

### Challenge Instruction

### Answer