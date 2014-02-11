//
//  CSMapVC.m
//  cs-maps-level2
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

@interface CSMapVC ()<GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;
@property(copy, nonatomic) NSSet *markers;

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
  self.mapView.delegate = self;

  [self.mapView setMinZoom:10 maxZoom:18];

  self.mapView.mapType = kGMSTypeNormal;

  self.mapView.myLocationEnabled = YES;

  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;

  [self.view addSubview:self.mapView];

  [self setupMarkers];
}

- (void)setupMarkers {
  GMSMarker *marker1 = [[GMSMarker alloc] init];
  marker1.position = CLLocationCoordinate2DMake(28.5441, -81.37301);
  marker1.map = nil;
  marker1.title = @"Lake Eola";
  marker1.snippet = @"Come see the swans";
  marker1.appearAnimation = kGMSMarkerAnimationPop;
  marker1.icon = [GMSMarker markerImageWithColor:[UIColor greenColor]];

  GMSMarker *marker2 = [[GMSMarker alloc] init];
  marker2.position = CLLocationCoordinate2DMake(28.53137, -81.36675);
  marker2.map = nil;
  marker2.title = @"Lake Davis";
  marker2.snippet = @"Check out the great park";
  marker2.appearAnimation = kGMSMarkerAnimationNone;
  marker2.icon = [GMSMarker markerImageWithColor:[UIColor blueColor]];

  GMSMarker *marker3 = [[GMSMarker alloc] init];
  marker3.position = CLLocationCoordinate2DMake(28.52951, -81.37919);
  marker3.map = nil;
  marker3.title = @"Lake of the Woods";
  marker3.snippet = @"Spooky name for a lake, don't you think?";
  marker3.appearAnimation = kGMSMarkerAnimationPop;
  marker3.icon = [UIImage imageNamed:@"map-marker"];

  self.markers = [NSSet setWithObjects:marker1, marker2, marker3, nil];

  [self drawMarkers];
}

- (void)drawMarkers {
  for (GMSMarker *marker in self.markers) {
    if (marker.map == nil) {
      marker.map = self.mapView;
    }
  }
}

- (BOOL)prefersStatusBarHidden {
  return YES;
}

- (UIView *)mapView:(GMSMapView *)mapView markerInfoWindow:(GMSMarker *)marker {
  UIView *infoWindow = [[UIView alloc] init];
  infoWindow.frame = CGRectMake(0, 0, 200, 70);
  
  UIImageView *backgroundImage = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"infoWindow"]];
  [infoWindow addSubview:backgroundImage];
  
  UILabel *titleLabel = [[UILabel alloc] init];
  titleLabel.frame = CGRectMake(14, 11, 175, 16);
  titleLabel.font = [UIFont fontWithDescriptor:[UIFontDescriptor fontDescriptorWithFontAttributes:@{NSFontAttributeName: @"Arial", NSForegroundColorAttributeName: [UIColor colorWithRed:0.0f green:0.0f blue:0.0f alpha:1.0]}] size:14];
  titleLabel.text = marker.title;
  [infoWindow addSubview:titleLabel];
  
  UILabel *snippetLabel = [[UILabel alloc] init];
  snippetLabel.frame = CGRectMake(14, 42, 175, 16);
  snippetLabel.font = [UIFont fontWithDescriptor:[UIFontDescriptor fontDescriptorWithFontAttributes:@{NSFontAttributeName: @"Arial", NSForegroundColorAttributeName: [UIColor colorWithRed:0.739f green:0.739f blue:0.739f alpha:1.0]}] size:11];
  snippetLabel.text = marker.snippet;
  [infoWindow addSubview:snippetLabel];
  
  return infoWindow;
}

// specific to level2 - not present in later levels
- (void)mapView:(GMSMapView *)mapView
    didTapInfoWindowOfMarker:(GMSMarker *)marker {
  NSString *message = [NSString
                       stringWithFormat:
                       @"You tapped the info window for the %@ marker",
                       marker.title];
  UIAlertView *windowTapped = [[UIAlertView alloc]
          initWithTitle:@"Info Window Tapped!"
                message:message
               delegate:nil
      cancelButtonTitle:@"Alright!"
      otherButtonTitles:nil];
  [windowTapped show];
}

@end
