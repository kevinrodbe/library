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
static const BOOL showLabel = NO;

typedef enum labelType {
  kLabelTypeZoom,
  kLabelTypeBearing,
  kLabelTypeViewingAngle,
} LabelType;

static const LabelType labelType = kLabelTypeViewingAngle;

@interface CSMapVC () <GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;
@property(strong, nonatomic) UILabel *label;

@end

@implementation CSMapVC

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
  self = [super initWithNibName:nibNameOrNil
                         bundle:nibBundleOrNil];
  if(self) {
    self.title = @"LakeMapVC";
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];

  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:28.5382
                                                          longitude:-81.3687
                                                               zoom:14
                                                            bearing:0
                                                       viewingAngle:0];

  self.mapView = [GMSMapView mapWithFrame:self.view.bounds camera:camera];
  self.mapView.delegate = self;
  
  [self.mapView setMinZoom:10 maxZoom:18];

  self.mapView.mapType = kGMSTypeNormal;

  self.mapView.myLocationEnabled = YES;

  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;
  
  if(showLabel) {
    self.label = [[UILabel alloc] init];
    self.label.frame = CGRectMake(20, 400, 280, 35);
    self.label.layer.cornerRadius = 8.0;
    self.label.backgroundColor = [UIColor whiteColor];
    switch (labelType) {
      case kLabelTypeZoom:
        self.label.text = [NSString stringWithFormat:@"  current zoom: %0.2f",self.mapView.layer.cameraZoomLevel];
        break;
      case kLabelTypeBearing:
        self.label.text = [NSString stringWithFormat:@"  current bearing: %0.2f",self.mapView.layer.cameraBearing];
        break;
      case kLabelTypeViewingAngle:
        self.label.text = [NSString stringWithFormat:@"  current viewing angle: %0.2f",self.mapView.layer.cameraViewingAngle];
        break;
      default:
        break;
    }
    [self.mapView addSubview:self.label];
  }
  
  [self.view addSubview:self.mapView];
}

- (void)mapView:(GMSMapView *)mapView didChangeCameraPosition:(GMSCameraPosition *)position
{
  if(showLabel) {
    switch (labelType) {
      case kLabelTypeZoom:
        self.label.text = [NSString stringWithFormat:@"  current zoom: %0.2f",self.mapView.layer.cameraZoomLevel];
        break;
      case kLabelTypeBearing:
        self.label.text = [NSString stringWithFormat:@"  current bearing: %0.2f",self.mapView.layer.cameraBearing];
        break;
      case kLabelTypeViewingAngle:
        self.label.text = [NSString stringWithFormat:@"  current viewing angle: %0.2f",self.mapView.layer.cameraViewingAngle];
        break;
      default:
        break;
    }
  }
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
