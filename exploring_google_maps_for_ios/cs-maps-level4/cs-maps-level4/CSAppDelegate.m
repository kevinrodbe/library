//
//  CSAppDelegate.m
//  cs-maps-level4
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSAppDelegate.h"

#import <GoogleMaps/GoogleMaps.h>

#import "CSMapVC.h"

@implementation CSAppDelegate

- (BOOL)application:(UIApplication *)application
didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  
  [GMSServices provideAPIKey:@"AIzaSyBMRXdcKTShvaNadUvOdGy4PKwS6RBxM4k"];
  
  CSMapVC *csMapVC = [[CSMapVC alloc] init];
  self.window.rootViewController = csMapVC;
  
  self.window.backgroundColor = [UIColor whiteColor];
  [self.window makeKeyAndVisible];
  return YES;
}

@end
