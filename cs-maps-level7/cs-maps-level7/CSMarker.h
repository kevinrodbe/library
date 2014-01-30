//
//  CSMarker.h
//  cs-maps-level7
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <GoogleMaps/GoogleMaps.h>

@interface CSMarker : GMSMarker

@property (nonatomic, assign) CLLocationCoordinate2D position;
@property (nonatomic, copy) NSString *objectID;

@end
