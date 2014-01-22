//
//  CSMarker.m
//  cs-maps-level4
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMarker.h"

static BOOL doubleCloseTo(double a, double b){
  if (fabs(a-b) < 0.00001) {
    return YES;
  }else{
    return NO;
  }
}

@implementation CSMarker

- (BOOL)isEqual:(id)object
{
  CSMarker *obj = object;
  if(doubleCloseTo(self.position.latitude, obj.position.latitude) &&
     doubleCloseTo(self.position.longitude, obj.position.longitude)) {
    return YES;
  }
  
  return NO;
}

@end
