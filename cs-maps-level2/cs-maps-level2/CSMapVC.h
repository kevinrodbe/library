//
//  CSMapVC.h
//  cs-maps-level2
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <GoogleMaps/GoogleMaps.h>

@interface CSMapVC : UIViewController <GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;

@end
