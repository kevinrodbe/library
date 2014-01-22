//
//  CSMarker.m
//  cs-maps-level3
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMarker.h"

#define kDoubleEpsilon (0.00001)

static BOOL doubleCloseTo(double a, double b){
  if (fabs(a-b) < kDoubleEpsilon) {
    return YES;
  }else{
    return NO;
  }
}

@implementation CSMarker

- (BOOL)isEqual:(id)object
{
  if(doubleCloseTo(self.position.latitude, [(CSMarker *)object position].latitude) && doubleCloseTo(self.position.longitude, [(CSMarker *)object position].longitude)) {
    return YES;
  }
  
  return NO;
}

@end
