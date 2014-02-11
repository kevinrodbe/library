//
//  CSMapVC.m
//  cs-maps-level1
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

static const BOOL navBarVersion = NO;

@interface CSMapVC ()

@property(strong, nonatomic) GMSMapView *mapView;

@end

@implementation CSMapVC

- (void)viewDidLoad {
  [super viewDidLoad];

  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:28.5382
                                                          longitude:-81.3687
                                                               zoom:14
                                                            bearing:0
                                                       viewingAngle:0];

  self.mapView = [GMSMapView mapWithFrame:self.view.bounds camera:camera];
  
  [self.mapView setMinZoom:10 maxZoom:18];

  self.mapView.mapType = kGMSTypeNormal;

  self.mapView.myLocationEnabled = YES;

  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;

  [self.view addSubview:self.mapView];
}

- (void)viewWillLayoutSubviews
{
  [super viewWillLayoutSubviews];
  if(navBarVersion) {
    self.mapView.padding = UIEdgeInsetsMake(self.topLayoutGuide.length+5, 0, self.bottomLayoutGuide.length+5, 0);
  }
}

- (BOOL)prefersStatusBarHidden {
  return YES;
}

@end
