//
//  CSParkMapVC.m
//  cs-maps-level1
//
//  Created by Jon Friskics on 12/16/13.
//  Copyright (c) 2013 Code School. All rights reserved.
//

#import "CSParkMapVC.h"

@interface CSParkMapVC ()

@end

@implementation CSParkMapVC

- (void)viewDidLoad
{
  [super viewDidLoad];

  GMSCameraPosition *camera = [GMSCameraPosition
                               cameraWithLatitude:28.538046
                               longitude:-81.368802
                               zoom:12
                               bearing:0
                               viewingAngle:0];
  
  self.mapView = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  self.mapView.mapType = kGMSTypeHybrid;
  self.mapView.padding = UIEdgeInsetsMake(20, 20, 20, 20);
  
  self.mapView.myLocationEnabled = YES;
  
  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;

  [self.view addSubview:self.mapView];
}

- (void)viewWillLayoutSubviews
{
  [super viewWillLayoutSubviews];
  
  self.mapView.frame = self.view.frame;
}

- (BOOL)prefersStatusBarHidden
{
  return YES;
}

@end
