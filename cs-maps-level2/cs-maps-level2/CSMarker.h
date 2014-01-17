//
//  CSMarker.h
//  cs-maps-level2
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GoogleMaps/GoogleMaps.h>

@interface CSMarker : NSObject

@property CLLocationCoordinate2D position;
@property (strong, nonatomic) NSString *title;
@property (strong, nonatomic) GMSMapView *map;
@property (strong, nonatomic) NSString *snippet;
@property NSInteger appearAnimation;
@property BOOL flat;
@property (strong, nonatomic) UIImage *icon;

@end
