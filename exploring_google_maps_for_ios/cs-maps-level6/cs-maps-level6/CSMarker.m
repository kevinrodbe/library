//
//  CSMarker.m
//  cs-maps-level6
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMarker.h"

@implementation CSMarker

- (NSUInteger)hash
{
  return [self.objectID hash];
}

- (BOOL)isEqual:(id)object
{
  if(![object isKindOfClass:[CSMarker class]]) return NO;
  
  CSMarker *otherMarker = (CSMarker *)object;
  
  return self.objectID == otherMarker.objectID || [self.objectID isEqual:otherMarker.objectID];
}

@end
