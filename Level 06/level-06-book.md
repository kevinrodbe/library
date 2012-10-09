# Level 6

Improving the Feed

### Goals

* Storyboard intro. How storyboards make creating cells easy. Let's make the posts pretty now.
* Over-coming a UITableView gotcha: resuable cells. Make sure you reset your UI!
* How to integrate Pull-To-Refresh.
* Variable height cells.
* Reloading Table data.

### User Knowledge Assumptions

* Basic UITableView knowledge.
* Understands container view controllers.

## Challenge 1

### Video

Intro to storyboards.

### Challenge Instruction

Check out all the code we removed and continue to the next challenge.

### Answer

N/A

## Challenge 2

### Video

We added a new `@property` to our `InstaPhotoPost` model called `isPopularPost` which denotes that the particular post has been liked more than 25 times.

```
TODO: Show changes we made to the model here…
```

We've also updated our table cells to have this little "Popular" badge which is hidden by default:

> TODO: Show updated table cell picture.

Let's update our code to show the "popular" badge on posts that are popular.

### Challenge Instruction

Update the `FeedViewController` to check if the current cell `isTrending`. If the cell `isTrending`, show the cell's `trendingBadge` image view by using `setHidden:`.

### Answer

```
TODO:
```

## Challenge 3

### Video

### Challenge Instruction

### Answer

## Challenge 4

### Video

### Challenge Instruction

### Answer

## Challenge 5

### Video

### Challenge Instruction

### Answer

## Challenge 6

### Video

### Challenge Instruction

### Answer