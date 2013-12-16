//
//  CSAppDelegate.m
//  cs-maps-level1
//
//  Created by Jon Friskics on 12/16/13.
//  Copyright (c) 2013 Code School. All rights reserved.
//

#import "CSAppDelegate.h"
#import "CSParkMapVC.h"

@implementation CSAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  
  [GMSServices provideAPIKey:@"AIzaSyBMRXdcKTShvaNadUvOdGy4PKwS6RBxM4k"];
  
  CSParkMapVC *parkMapVC = [[CSParkMapVC alloc] init];
  self.window.rootViewController = parkMapVC;
  
  self.window.backgroundColor = [UIColor whiteColor];
  [self.window makeKeyAndVisible];
  return YES;
}

@end
