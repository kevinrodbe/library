//
//  CSMapVC.m
//  cs-maps-level3
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

#import "CSMarker.h"

@interface CSMapVC () <GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;
@property(copy, nonatomic) NSSet *markers;
@property(strong, nonatomic) NSURLSession *markerSession;
@property(strong, nonatomic) CSMarker *userCreatedMarker;

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

  UIButton *loadNewMarkers = [UIButton buttonWithType:UIButtonTypeCustom];
  loadNewMarkers.frame = CGRectMake(25, 25, 150, 40);
  [loadNewMarkers setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateNormal];
  [loadNewMarkers setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateHighlighted];
  [loadNewMarkers setTitle:@"load" forState:UIControlStateNormal];
  [loadNewMarkers setTitleColor:[UIColor colorWithRed:0.152941176 green:0.439215686 blue:0.788235294 alpha:1.0] forState:UIControlStateNormal];
  [loadNewMarkers setTitleColor:[UIColor colorWithRed:0.6 green:0.6 blue:0.6 alpha:1.0] forState:UIControlStateHighlighted];
  [loadNewMarkers addTarget:self
                     action:@selector(downloadMarkerData:)
           forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:loadNewMarkers];

  NSURLSessionConfiguration *config =
      [NSURLSessionConfiguration defaultSessionConfiguration];
  config.URLCache = [[NSURLCache alloc] initWithMemoryCapacity:2 * 1024 * 1024
                                                  diskCapacity:10 * 1024 * 1024
                                                      diskPath:@"MarkerData"];
  self.markerSession = [NSURLSession sessionWithConfiguration:config];
}


- (void)drawMarkers {
  for(CSMarker *marker in self.markers) {
    if(marker.map == nil) {
      marker.map = self.mapView;
    }
  }
  if (self.userCreatedMarker != nil && self.userCreatedMarker.map == nil) {
    self.userCreatedMarker.map = self.mapView;
    self.mapView.selectedMarker = self.userCreatedMarker;
    GMSCameraUpdate *cameraUpdate = [GMSCameraUpdate setTarget:self.userCreatedMarker.position];
    [self.mapView animateWithCameraUpdate:cameraUpdate];
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


- (void)downloadMarkerData:(id)sender {
  NSURL *lakesURL = [NSURL URLWithString:@"http://jonfriskics.com/mapsapi/v1/getPoints/?type=lakes"];

  NSURLSessionDataTask *task = [self.markerSession dataTaskWithURL:lakesURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {
    
    NSArray *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
      // Calls to the SDK have to happen on the main thread, but you're not guaranteed to be on the main thread in an NSURLSession callback
      [self createMarkerObjectsWithJson:json];
    }];
    
  }];

  [task resume];
}


- (void)createMarkerObjectsWithJson:(NSArray *)json {
  // get a mutable copy of all of the markers
  NSMutableSet *mutableSet = [[NSMutableSet alloc] initWithSet:self.markers];

    // loop through each of the new markers one at a time
    for (NSDictionary *mark in json) {

      // create a CSMarker - this is a GMSMarker subclass that overrides
      // isEqual:
      CSMarker *marker = [[CSMarker alloc] init];

      marker.objectID = [mark[@"id"] stringValue];
      
      // read in all of the data from the returned json dictionary
      marker.appearAnimation = [mark[@"appearAnimation"] integerValue];
      marker.position = CLLocationCoordinate2DMake([mark[@"lat"] doubleValue],
                                                   [mark[@"lng"] doubleValue]);
      marker.title = mark[@"title"];
      marker.snippet = mark[@"snippet"];
      marker.flat = [mark[@"flat"] boolValue];

      // don't show the map yet
      marker.map = nil;

      [mutableSet addObject:marker];
    }

    // cast the mutable set as an immutable one
    self.markers = [mutableSet copy];

    // re-draw the markers
    [self drawMarkers];
}


- (void)mapView:(GMSMapView *)mapView didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {

  if (self.userCreatedMarker != nil) {
    self.userCreatedMarker.map = nil;
    self.userCreatedMarker = nil;
  }
  
  CSMarker *marker = [[CSMarker alloc] init];
  marker.position = coordinate;
  marker.appearAnimation = kGMSMarkerAnimationPop;
  marker.map = nil;
  
  marker.title = @"user created";
  marker.snippet = @"snippet for user created";
  
  self.userCreatedMarker = marker;
  
  [self drawMarkers];
}


@end
