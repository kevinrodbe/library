# Level 5

### Goals

* Learn how to perform networking requests with AFNetworking.
* Understand Objective-C `blocks` and how they're used.
* Use a `UITableViewController` to display dynamic data.
* Get some more practice refactoring.

### User Knowledge Assumptions

* Some `UITableView` knowledge.
* Understanding of how a `@property` works.

## Challenge 1

### Video

Before we make the table view dynamic we'll need to get some data. To do this we are going to be making some real network requests to the InstaPhoto backed. Historically, writing network code for iOS has not been fun. It required using the delegate pattern, writing lots of boiler plate code, and manual labor. Apple has recently made things a little nicer but most developers still choose to use 3rd-party networking libraries because they still offer many advantages. We are going to teach you how to use a 3rd party networking library that has become very popular recently: AFNetworking.

##### AFNetworking

AFNetworking effictively let's us write network requests in 1 or 2 lines of code. It also greatly simplifies the process of handling the responses we get from the network. If you think about it, there's a lot we need to consider when we make a network request:

* We need to make sure we don't hold up the rest of our app from running while we are waiting on a response.
* We need to think about what to do if we never get a response.
* We may need to make multiple requests at the same time.
* The list goes on...

To solve many of these problems, AFNetworking uses a feature of `Objective-C` called `blocks`. A `block` is simply some lines of code that are grouped together so they can be run at a later time. Sounds like a `method` right? Except, `blocks` don't have to have a name and can be created whereever and whenever. To show you a concrete example of how `blocks` are used, let's introduce a the HTTP workhorse of AFNetworking: `AFHTTPRequestOperation`. `AFHTTPRequestOperation` handles sending HTTP requests. We can create a request with `initWithRequest:` like this:

```
AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
```

We'll explain what the `request` parameter is later, just know that it contains the url. To start the request, we call `start`:

```
[operation start];
```

Now, to actually process the response from the server we'll add on more piece of code after we create the request but before we `start` it:

```
AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];

[operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        // process success
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        // process error
    }];
    
[operation start];
```

That looks like a lot but it's actually really simple. We are passing the `setCompletionBlockWithSuccess:failure:` message to our `operation` object. Easy enough. The part that looks confusing is what we are passing in as parameters. *These* are `blocks`. A `block` starts with a `^` then defines some parameters than can be passed to it in the `()` and finally has some code to be excuted in the `{}`. In other words, it looks like this:

```
^ (parameters) {
	// code to be executed
}
```

We can see that the success block passes in a reference to the `operation` itself and the `responseObject` (the response from the server):

```
^(AFHTTPRequestOperation *operation, id responseObject) {
        // process success
    }
```

Likewise, the failure block gets passed a reference to the `operation` but is given an `error` object instead of a response:

```
^(AFHTTPRequestOperation *operation, NSError *error) {
        // process error
    }
```

`NSError` objects just contain useful information about errors.

Now, there is something very important to understand about this code:

```
AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];

[operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        // process success
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        // process error
    }];
    
[operation start];
```

The success and failure `blocks` are not executed immediately, they are executed at some arbitrary time in the future when the server responds to us. Additionally, only one `block` is actually executed, the request either *succeeds* or *fails* right? We should take it into account that we don't know when these `blocks` will be executed or even what *thread* the `blocks` will be executed on. AFNetworking takes this into account by passing each block the `AFHTTPRequestOperation` that it was assigned to.

##### NSURLRequest

Now, let's talk about that `request` parameter back when we created the network request. 

```
AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
```

The only parameter above is a `NSURLRequest`. An `NSURLRequest` is responsible for defining a "url request". An `NSURLRequest` is created using the class method `requestWithURL:` like this:

```
NSURLRequest *request = [NSURLRequest requestWithURL:url];
```

To get a "url" object to create a `NSURLRequest` you'll need to TODO

```
// Create the request
NSURL *url = [NSURL URLWithString:@"http://apple.com"];
NSURLRequest *request = [NSURLRequest requestWithURL:url];

AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc] initWithRequest:request];
[operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
        // process success
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
        // process error
    }];
[operation start];
```

### Challenge Instruction

### Answer

## Challenge 2

### Video

Add ability to parse JSON.

### Challenge Instruction

### Answer

```
AFJSONRequestOperation *operation = [AFJSONRequestOperation JSONRequestOperationWithRequest:request
  success:^(NSURLRequest *request, NSHTTPURLResponse *response, id JSON) {
    NSLog(@"%@", JSON);
} failure:^(NSURLRequest *request, NSHTTPURLResponse *response, NSError *error, id JSON) {
    NSLog(@"Error: %@", error);
}];

[operation start];
```

## Challenge 3

### Video

Store the JSON in an array of dictionaries.

### Challenge Instruction

### Answer

## Challenge 4

### Video

Display the JSON we just stored in the arrays.

### Challenge Instruction

### Answer

## Challenge 5

### Video

Refactor to InstaPhotoPost data model. Talk about using properties and
dictionaries.

### Challenge Instruction

### Answer

## Challenge 6

### Video

Refactor to InstaPhotoPost data model. Talk about using properties and
dictionaries.

### Challenge Instruction

### Answer