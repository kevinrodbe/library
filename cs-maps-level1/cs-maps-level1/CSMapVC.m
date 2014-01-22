//
//  CSMapVC.m
//  cs-maps-level1
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

@interface CSMapVC ()

@property(strong, nonatomic) GMSMapView *mapView;

@end

@implementation CSMapVC

- (void)viewDidLoad {
  [super viewDidLoad];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:28.5382
                                                          longitude:-81.3687
                                                               zoom:10
                                                            bearing:0
                                                       viewingAngle:0];
  
  self.mapView = [GMSMapView mapWithFrame:self.view.bounds camera:camera];
  
  self.mapView.mapType = kGMSTypeHybrid;
  
  self.mapView.myLocationEnabled = YES;
  
  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;
  
  self.mapView.padding = UIEdgeInsetsMake(25, 25, 25, 25);
  
  [self.view addSubview:self.mapView];
}

- (BOOL)prefersStatusBarHidden
{
  return YES;
}

@end
