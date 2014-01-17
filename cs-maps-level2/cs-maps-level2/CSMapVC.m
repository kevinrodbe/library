//
//  CSMapVC.m
//  cs-maps-level2
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMapVC.h"
#import "CSMarker.h"

@interface CSMapVC ()

@property(strong, nonatomic) NSArray *markerData;
@property(strong, nonatomic) GMSPolyline *polyline;

@end

@implementation CSMapVC

- (void)viewDidLoad {
  [super viewDidLoad];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:28.5382
                                                          longitude:-81.3687
                                                               zoom:16
                                                            bearing:0
                                                       viewingAngle:0];

  self.mapView = [GMSMapView mapWithFrame:CGRectZero camera:camera];
  self.mapView.delegate = self;

  self.mapView.mapType = kGMSTypeHybrid;

  self.mapView.myLocationEnabled = YES;

  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;

  self.mapView.padding = UIEdgeInsetsMake(25, 25, 25, 25);

  [self.view addSubview:self.mapView];

  [self setupMarkerData];
}

- (void)viewWillLayoutSubviews {
  [super viewWillLayoutSubviews];
  self.mapView.frame = self.view.bounds;
}

- (void)setupMarkerData {
  GMSMarker *marker1 = [[GMSMarker alloc] init];
  marker1.position = CLLocationCoordinate2DMake(28.54111, -81.37052);
  marker1.map = nil;
  marker1.title = @"The Abbey";
  marker1.snippet = @"Theatre";
  marker1.appearAnimation = kGMSMarkerAnimationPop;
  marker1.icon = [GMSMarker markerImageWithColor:[UIColor greenColor]];

  GMSMarker *marker2 = [[GMSMarker alloc] init];
  marker2.position = CLLocationCoordinate2DMake(28.53111, -81.36052);
  marker2.map = nil;
  marker2.title = @"2";
  marker2.snippet = @"snippet2";
  marker2.appearAnimation = kGMSMarkerAnimationPop;
  marker2.icon = [GMSMarker markerImageWithColor:[UIColor blueColor]];

  GMSMarker *marker3 = [[GMSMarker alloc] init];
  marker3.position = CLLocationCoordinate2DMake(28.55111, -81.36852);
  marker3.map = nil;
  marker3.title = @"3";
  marker3.snippet = @"3";
  marker3.appearAnimation = kGMSMarkerAnimationPop;
  marker3.icon = [GMSMarker markerImageWithColor:[UIColor redColor]];

  NSMutableArray *mutableMarkers =
      [[NSMutableArray alloc] initWithArray:self.markerData];
  [mutableMarkers addObjectsFromArray:@[ marker1, marker2, marker3 ]];
  self.markerData = [[NSArray alloc] initWithArray:mutableMarkers];
}

- (void)drawMarkersInVisibleRegion:(GMSVisibleRegion)visibleRegion {
  for(GMSMarker *marker in self.markerData) {
    if(GMSGeometryContainsLocation(marker.position, self.polyline.path, YES) && marker.map == nil) {
      marker.map = self.mapView;
    } else if(GMSGeometryContainsLocation(marker.position, self.polyline.path, YES) && marker.map != nil) {
      
    } else {
      marker.map = nil;
    }
  }
//    NSLog(@"bearing: %f",self.mapView.camera.bearing);
//    NSLog(@"nllat: %f, mplat: %f, frlat: %f %f %f", visibleRegion.nearLeft.latitude, marker.position.latitude, visibleRegion.farRight.latitude, marker.position.latitude - visibleRegion.nearLeft.latitude, visibleRegion.farRight.latitude - marker.position.latitude);
//    NSLog(@"nllng: %f, mplng: %f, frlng: %f %f %f", visibleRegion.nearLeft.longitude, marker.position.longitude, visibleRegion.farRight.longitude, marker.position.longitude - visibleRegion.nearLeft.longitude, visibleRegion.farRight.longitude - marker.position.longitude);
//    if (marker.position.latitude > visibleRegion.nearLeft.latitude &&
//        marker.position.latitude < visibleRegion.farRight.latitude &&
//        marker.position.longitude > visibleRegion.nearLeft.longitude &&
//        marker.position.longitude < visibleRegion.farRight.longitude &&
//        (self.mapView.camera.bearing < 45 || self.mapView.camera.bearing > 315) &&
//        marker.map == nil) {
//      marker.map = self.mapView;
//    } else if (marker.position.latitude > visibleRegion.nearLeft.latitude &&
//               marker.position.latitude < visibleRegion.farRight.latitude &&
//               marker.position.longitude > visibleRegion.nearLeft.longitude &&
//               marker.position.longitude < visibleRegion.farRight.longitude &&
//               (self.mapView.camera.bearing < 45 || self.mapView.camera.bearing > 315) &&
//               marker.map != nil) {
//    } else {
//      marker.map = nil;
//    }
}

- (void)mapView:(GMSMapView *)mapView
    idleAtCameraPosition:(GMSCameraPosition *)position {
  NSLog(@"%s", __PRETTY_FUNCTION__);

}

- (void)mapView:(GMSMapView *)mapView
    didChangeCameraPosition:(GMSCameraPosition *)position {
  NSLog(@"%s", __PRETTY_FUNCTION__);
  self.polyline.map = nil;
  GMSMutablePath *path = [GMSMutablePath path];
  [path addCoordinate:CLLocationCoordinate2DMake(mapView.projection.visibleRegion.nearLeft.latitude, mapView.projection.visibleRegion.nearLeft.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(mapView.projection.visibleRegion.nearRight.latitude, mapView.projection.visibleRegion.nearRight.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(mapView.projection.visibleRegion.farRight.latitude, mapView.projection.visibleRegion.farRight.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(mapView.projection.visibleRegion.farLeft.latitude, mapView.projection.visibleRegion.farLeft.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(mapView.projection.visibleRegion.nearLeft.latitude, mapView.projection.visibleRegion.nearLeft.longitude)];
  self.polyline = [GMSPolyline polylineWithPath:path];
  self.polyline.strokeWidth = 10;
  self.polyline.strokeColor = [UIColor redColor];
  self.polyline.map = self.mapView;
  
  [self drawMarkersInVisibleRegion:mapView.projection.visibleRegion];
}

- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture {
  NSLog(@"%s", __PRETTY_FUNCTION__);
}

- (BOOL)prefersStatusBarHidden {
  return YES;
}

- (UIView *)mapView:(GMSMapView *)mapView
    markerInfoWindow:(GMSMarker *)marker
{
  UIView *infoWindow = [[UIView alloc] init];
  infoWindow.frame = CGRectMake(0,0,200,200);
  infoWindow.backgroundColor = [UIColor grayColor];
  
  UILabel *titleLabel = [[UILabel alloc] init];
  titleLabel.frame = CGRectMake(10,10,180,60);
  titleLabel.font = [UIFont preferredFontForTextStyle:UIFontTextStyleHeadline];
  titleLabel.text = marker.title;
  [infoWindow addSubview:titleLabel];
  
  return infoWindow;
}

@end
