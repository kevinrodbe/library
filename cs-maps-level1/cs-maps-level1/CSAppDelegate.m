//
//  CSAppDelegate.m
//  cs-maps-level1
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSAppDelegate.h"

#import <GoogleMaps/GoogleMaps.h>

#import "CSMapVC.h"

static const BOOL navBarVersion = NO;

@implementation CSAppDelegate

- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];

  [GMSServices provideAPIKey:@"AIzaSyBMRXdcKTShvaNadUvOdGy4PKwS6RBxM4k"];

  if(navBarVersion) {
    CSMapVC *csMapVC = [[CSMapVC alloc] init];
    
    UINavigationController *navController = [[UINavigationController alloc] initWithRootViewController:csMapVC];
    
    UITabBarController *tabBarController = [[UITabBarController alloc] init];
    tabBarController.viewControllers = @[navController];
    self.window.rootViewController = tabBarController;
  } else {
    CSMapVC *csMapVC = [[CSMapVC alloc] init];
    self.window.rootViewController = csMapVC;
  }

  self.window.backgroundColor = [UIColor whiteColor];
  [self.window makeKeyAndVisible];
  return YES;
}

@end
