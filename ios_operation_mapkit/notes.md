---
layout: page
title: iOS Operation - MapKit
course_url: http://operationmapkit.codeschool.com
path: ios
---


Location data
--------------------------------

### Creating location from lat/lng

Latitude and longitude data should be type `double`.  If you are storing these values in an `NSNumber`, then you can pass that object the `doubleValue` message if needed.

#### if data is already type `double`
```objc
double latitude  =  28.5407;
double longitude = -81.3756;

CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude, longitude);
```

#### if data is already type `NSNumber`
```objc
double latitude  = [latNumberObject doubleValue];
double longitude = [lngNumberObject doubleValue];

CLLocationCoordinate2D coordinate = CLLocationCoordinate2DMake(latitude, longitude);
```