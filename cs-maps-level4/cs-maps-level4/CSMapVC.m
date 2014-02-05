//
//  CSMapVC.m
//  cs-maps-level4
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

// TODO: remove NSLog()

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

#import "CSMarker.h"

#import "CSDirectionsVC.h"

const NSString *DIRECTIONS_API_URL = @"http://maps.googleapis.com/maps/api/directions/json";

@interface CSMapVC () <GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;
@property(copy, nonatomic) NSSet *markers;
@property(strong, nonatomic) NSURLSession *markerSession;
@property(strong, nonatomic) CSMarker *userCreatedMarker;
@property(strong, nonatomic) UIButton *directionsButton;
@property(copy, nonatomic) NSArray *steps;

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

  // TODO: replace this with a button image when the asset is ready to go
  UIButton *loadNewMarkers = [UIButton buttonWithType:UIButtonTypeSystem];
  loadNewMarkers.frame = CGRectMake(25, 25, 45, 45);
  [loadNewMarkers setTitle:@"load" forState:UIControlStateNormal];
  [loadNewMarkers addTarget:self
                     action:@selector(downloadMarkerData:)
           forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:loadNewMarkers];
  
  self.directionsButton = [UIButton buttonWithType:UIButtonTypeSystem];
  self.directionsButton.frame = CGRectMake(20, 400, 280, 30);
  self.directionsButton.backgroundColor = [UIColor whiteColor];
  [self.directionsButton setTitle:@"directions" forState:UIControlStateNormal];
  [self.directionsButton addTarget:self
                            action:@selector(directionsTapped:)
                  forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:self.directionsButton];
  self.directionsButton.alpha = 0.0;

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

  infoWindow.frame = CGRectMake(0, 0, 200, 200);
  infoWindow.backgroundColor = [UIColor grayColor];

  UILabel *titleLabel = [[UILabel alloc] init];
  titleLabel.frame = CGRectMake(10, 10, 180, 60);
  titleLabel.font = [UIFont preferredFontForTextStyle:UIFontTextStyleHeadline];
  titleLabel.text = marker.title;
  [infoWindow addSubview:titleLabel];

  UILabel *snippetLabel = [[UILabel alloc] init];
  snippetLabel.frame =
      CGRectMake(10, CGRectGetMaxY(titleLabel.frame) + 10, 180, 60);
  snippetLabel.numberOfLines = 0;
  snippetLabel.font = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
  snippetLabel.text = marker.userData[@"distance"];
  [infoWindow addSubview:snippetLabel];

  return infoWindow;
}


- (void)downloadMarkerData:(id)sender {
  NSURL *lakesURL = [NSURL URLWithString:@"http://jonfriskics.com/mapsapi/v1/getPoints/?type=lakes"];
  
  NSURLSessionDataTask *task = [self.markerSession dataTaskWithURL:lakesURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {
    
    NSArray *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
      [self createMarkerObjectsWithJson:json];
    }];
    
  }];
  
  [task resume];
}


- (void)createMarkerObjectsWithJson:(NSArray *)json {
  NSMutableSet *mutableSet = [[NSMutableSet alloc] initWithSet:self.markers];

  for (NSDictionary *mark in json) {
    CSMarker *marker = [[CSMarker alloc] init];

    marker.objectID = [mark[@"id"] stringValue];
    marker.appearAnimation = [mark[@"appearAnimation"] integerValue];
    marker.position = CLLocationCoordinate2DMake([mark[@"lat"] doubleValue],
                                                 [mark[@"lng"] doubleValue]);
    marker.title = mark[@"title"];
    marker.snippet = mark[@"snippet"];
    marker.flat = [mark[@"flat"] boolValue];

    marker.map = nil;

    [mutableSet addObject:marker];
  }

  self.markers = [mutableSet copy];

  [self drawMarkers];
}

- (BOOL)mapView:(GMSMapView *)mapView didTapMarker:(GMSMarker *)marker {
  if (mapView.myLocation != nil) {
    NSURL *distanceURL = [NSURL URLWithString:
                          [NSString stringWithFormat:
                           @"http://maps.googleapis.com/maps/api/distancematrix/json?origins=%f,%f&destinations=%f,%f&""mode=driving&sensor=false",
                           self.mapView.myLocation.coordinate.latitude,
                           self.mapView.myLocation.coordinate.longitude,
                           marker.position.latitude,
                           marker.position.longitude]];

    NSURLSessionDataTask *distanceTask = [self.markerSession dataTaskWithURL:distanceURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {

      NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];

      [[NSOperationQueue mainQueue] addOperationWithBlock:^{
        
        NSMutableSet *mutableMarkers = [self.markers mutableCopy];
        
        CSMarker *m = [mutableMarkers member:marker];
        
        if(m) {
          [mutableMarkers removeObject:m];
          m.userData = @{ @"distance" : json[@"rows"][0][@"elements"][0][@"distance"][@"text"] };
          [mutableMarkers addObject:m];

          self.markers = [mutableMarkers copy];
          /* TODO: ask if there's a better way than this.
           *       this is forcing the info window to re-open, and it seems kind
           * of hacky
           */
          [mapView setSelectedMarker:marker];
         }
      }];

    }];
    
    [distanceTask resume];


    NSURL *directionsURL = [NSURL URLWithString:
                            [NSString stringWithFormat:
                             @"%@?origin=%f,%f&destination=%f,%f&sensor=false",
                             DIRECTIONS_API_URL,
                             mapView.myLocation.coordinate.latitude,
                             mapView.myLocation.coordinate.longitude,
                             marker.position.latitude, marker.position.longitude ]];
    
    NSURLSessionDataTask *directionsTask = [self.markerSession dataTaskWithURL:directionsURL completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {

      NSError *error = nil;
      NSDictionary *json =
      [NSJSONSerialization JSONObjectWithData:data
                                      options:NSJSONReadingMutableContainers
                                        error:&error];
      
      if(!error) {
        self.steps = json[@"routes"][0][@"legs"][0][@"steps"];
        [[NSOperationQueue mainQueue] addOperationWithBlock:^{
          self.directionsButton.alpha = 1.0;
        }];
      }
    }];
    
    [directionsTask resume];
  }
  
  return NO;
}

- (void)directionsTapped:(id)sender {
  CSDirectionsVC *directionsVC = [[CSDirectionsVC alloc] init];
  directionsVC.steps = self.steps;
  directionsVC.modalPresentationStyle = UIModalPresentationCurrentContext;
  directionsVC.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
  [self presentViewController:directionsVC
                     animated:YES
                   completion:^{
                     self.directionsButton.alpha = 0.0;
                     self.steps = nil;
                     self.mapView.selectedMarker = nil;
                   }];
}


- (void)mapView:(GMSMapView *)mapView didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {
  
  if (self.userCreatedMarker != nil) {
    self.userCreatedMarker.map = nil;
    self.userCreatedMarker = nil;
  }
  
  GMSGeocoder *geocoder = [GMSGeocoder geocoder];
  [geocoder reverseGeocodeCoordinate:coordinate completionHandler:^(GMSReverseGeocodeResponse *response, NSError *error) {
    CSMarker *marker = [[CSMarker alloc] init];
    marker.position = coordinate;
    marker.appearAnimation = kGMSMarkerAnimationPop;
    marker.map = nil;
    
    marker.title = response.firstResult.addressLine1;
    marker.snippet = response.firstResult.addressLine2;
    
    self.userCreatedMarker = marker;
    
    [self drawMarkers];
  }];
}


- (void)mapView:(GMSMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate
{
  if(self.directionsButton.alpha > 0.0) {
    self.directionsButton.alpha = 0.0;
  }
}


- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture
{
  if(self.directionsButton.alpha > 0.0) {
    self.directionsButton.alpha = 0.0;
  }
  self.mapView.selectedMarker = nil;
}

@end
