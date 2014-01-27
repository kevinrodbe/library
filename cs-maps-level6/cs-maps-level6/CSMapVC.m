//
//  CSMapVC.m
//  cs-maps-level6
//
//  Created by Jon Friskics on 1/13/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

// TODO: remove NSLog()

#import "CSMapVC.h"

#import <GoogleMaps/GoogleMaps.h>

#import "CSMarker.h"

#import "CSDirectionsVC.h"

#import "CSStreetViewVC.h"

const NSString *DIRECTIONS_API_URL = @"http://maps.googleapis.com/maps/api/directions/json";

@interface CSMapVC ()<GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;

@property(copy, nonatomic) NSSet *markers;

@property(strong, nonatomic) NSURLSession *markerSession;

@property(strong, nonatomic) CSMarker *userCreatedMarker;

@property(strong, nonatomic) UIButton *directionsButton;

@property(copy, nonatomic) NSArray *steps;

@property(strong, nonatomic) NSMutableArray *polylines;

@property(strong, nonatomic) UIButton *streetViewButton;

@property(strong, nonatomic) CSMarker *activeMarker;

@end

@implementation CSMapVC

- (void)viewDidLoad {
  [super viewDidLoad];
  GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:28.5382
                                                          longitude:-81.3687
                                                               zoom:16
                                                            bearing:0
                                                       viewingAngle:0];

  self.mapView = [GMSMapView mapWithFrame:self.view.bounds camera:camera];
  self.mapView.delegate = self;

  self.mapView.mapType = kGMSTypeHybrid;

  self.mapView.myLocationEnabled = YES;

  self.mapView.settings.compassButton = YES;
  self.mapView.settings.myLocationButton = YES;

  self.mapView.padding = UIEdgeInsetsMake(25, 25, 25, 25);

  [self.view addSubview:self.mapView];

  // TODO: replace this with a button image when the asset is ready to go
  UIButton *loadNewMarkers = [UIButton buttonWithType:UIButtonTypeSystem];
  loadNewMarkers.frame = CGRectMake(25, 25, 45, 45);
  [loadNewMarkers setTitle:@"load" forState:UIControlStateNormal];
  [loadNewMarkers addTarget:self
                     action:@selector(downloadMarkers:)
           forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:loadNewMarkers];

  NSURLSessionConfiguration *config =
      [NSURLSessionConfiguration defaultSessionConfiguration];
  config.URLCache = [[NSURLCache alloc] initWithMemoryCapacity:2 * 1024 * 1024
                                                  diskCapacity:10 * 1024 * 1024
                                                      diskPath:@"MarkerData"];
  self.markerSession = [NSURLSession sessionWithConfiguration:config];
  
  GMSPath *path = [self pathForCongressionalData];
  
  GMSPolygon *polygon = [GMSPolygon polygonWithPath:path];
  polygon.strokeColor = [UIColor redColor];
  polygon.strokeWidth = 6;
  polygon.fillColor = [UIColor colorWithRed:1.0 green:0.2 blue:0.2 alpha:0.5];
  polygon.map = self.mapView;
}

- (void)drawMarkers {
  for (CSMarker *marker in self.markers) {
    if (marker.map == nil) {
      marker.map = self.mapView;
    }
  }
  if (self.userCreatedMarker != nil && self.userCreatedMarker.map == nil) {
    self.userCreatedMarker.map = self.mapView;
    self.mapView.selectedMarker = self.userCreatedMarker;
    GMSCameraUpdate *cameraUpdate =
        [GMSCameraUpdate setTarget:self.userCreatedMarker.position];
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

- (void)downloadMarkers:(id)sender {
  NSURLRequest *request = [NSURLRequest
      requestWithURL:
          [NSURL
              URLWithString:
                  @"http://jonfriskics.com/mapsapi/v1/getPoints/?type=lakes"]];

  NSURLSessionDataTask *task = [self.markerSession dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {

    NSArray *json =
        [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];

    [[NSOperationQueue mainQueue]
        addOperationWithBlock:^{ [self doSomethingWithMarkerData:json]; }];
  }];

  [task resume];
}

- (void)doSomethingWithMarkerData:(NSArray *)json {
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
  NSLog(@"%s", __PRETTY_FUNCTION__);
  
  if(self.activeMarker == nil) {
    self.activeMarker = (CSMarker *)marker;
  }
  
  NSURLRequest *request = [NSURLRequest
      requestWithURL:
          [NSURL URLWithString:
                     [NSString stringWithFormat:
                                   @"http://maps.googleapis.com/maps/api/"
                                    "distancematrix/"
                                    "json?origins=%f,%f&destinations=%f,%f&"
                                    "mode=driving&sensor=false",
                                   self.mapView.myLocation.coordinate.latitude,
                                   self.mapView.myLocation.coordinate.longitude,
                                   marker.position.latitude,
                                   marker.position.longitude]]];

  NSURLSessionDataTask *task = [self.markerSession  dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {
    NSDictionary *json = (NSDictionary *)
        [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    [[NSOperationQueue mainQueue]
        addOperationWithBlock:^{
          NSMutableSet *mutableMarkers = [self.markers mutableCopy];
          CSMarker *m = [mutableMarkers member:marker];
          if([mutableMarkers containsObject:marker]) {
            [mutableMarkers removeObject:m];
            m.userData = @{
                           @"distance" :
                             json[@"rows"][0][@"elements"][0][@"distance"][@"text"]
                           };
            [mutableMarkers addObject:m];
            
            self.markers = [mutableMarkers copy];
            
            /* TODO: ask if there's a better way than this.
             *       this is forcing the info window to re-open, and it seems kind
             * of hacky
             */
          }
          [mapView setSelectedMarker:marker];
        }];
  }];

  [task resume];

  if(self.polylines == nil) {
    self.polylines = [[NSMutableArray alloc] init];
  }
  for (GMSPolyline *polyline in self.polylines) {
    NSLog(@"polyline: %@",polyline);
    polyline.map = nil;
  }
  [self.polylines removeAllObjects];

  if (mapView.myLocation != nil) {

    NSURLRequest *request2 = [NSURLRequest
                             requestWithURL:
                             [NSURL URLWithString:
                              [NSString stringWithFormat:
                               @"%@?origin=%f,%f&destination=%f,%f&sensor=false",
                               DIRECTIONS_API_URL,
                               mapView.myLocation.coordinate.latitude,
                               mapView.myLocation.coordinate.longitude,
                               marker.position.latitude, marker.position.longitude ]]];
    NSLog(@"request2: %@",[[request2 URL] absoluteString]);
    NSURLSessionDataTask *task2 = [self.markerSession  dataTaskWithRequest:request2 completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {

      NSError *error = nil;
      NSDictionary *json =
          [NSJSONSerialization JSONObjectWithData:data
                                          options:NSJSONReadingMutableContainers
                                            error:&error];
      self.steps = json[@"routes"][0][@"legs"][0][@"steps"];
      
      [[NSOperationQueue mainQueue]
       addOperationWithBlock:^{
         if(self.directionsButton == nil) {
           self.directionsButton = [UIButton buttonWithType:UIButtonTypeSystem];
           self.directionsButton.frame = CGRectMake(20, 400, 280, 30);
           self.directionsButton.backgroundColor = [UIColor whiteColor];
           [self.directionsButton setTitle:@"directions" forState:UIControlStateNormal];
           [self.directionsButton addTarget:self
                      action:@selector(directionsTapped:)
            forControlEvents:UIControlEventTouchUpInside];
           [self.view addSubview:self.directionsButton];
           
           GMSPath *path =
           [GMSPath pathFromEncodedPath:
            json[@"routes"][0][@"overview_polyline"][@"points"]];
           GMSPolyline *polyline = [GMSPolyline polylineWithPath:path];
           polyline.strokeWidth = 7;
           polyline.strokeColor = [UIColor greenColor];
           polyline.map = mapView;
           [self.polylines addObject:polyline];
         }
         if(self.streetViewButton == nil) {
           self.streetViewButton = [UIButton buttonWithType:UIButtonTypeSystem];
           self.streetViewButton.frame = CGRectMake(20, 430, 280, 30);
           self.streetViewButton.backgroundColor = [UIColor whiteColor];
           [self.streetViewButton setTitle:@"street view" forState:UIControlStateNormal];
           [self.streetViewButton addTarget:self
                                     action:@selector(showStreetView:)
                           forControlEvents:UIControlEventTouchUpInside];
           [self.view addSubview:self.streetViewButton];
         }
       }];
    }];
    [task2 resume];
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
                     [sender removeFromSuperview];
                     self.steps = nil;
                     self.mapView.selectedMarker = nil;
                     self.activeMarker = nil;
                   }];
}

- (void)mapView:(GMSMapView *)mapView
    didLongPressAtCoordinate:(CLLocationCoordinate2D)coordinate {

  if (self.userCreatedMarker != nil) {
    self.userCreatedMarker.map = nil;
    self.userCreatedMarker = nil;
  }
  
  for (GMSPolyline *polyline in self.polylines) {
    polyline.map = nil;
  }
  [self.polylines removeAllObjects];

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


- (void)mapView:(GMSMapView *)mapView
    didTapInfoWindowOfMarker:(GMSMarker *)marker {
  [self directionsTapped:nil];
}

// TODO: Move this to Level 6
- (void)mapView:(GMSMapView *)mapView didTapAtCoordinate:(CLLocationCoordinate2D)coordinate
{
  if(self.directionsButton != nil) {
    [self.directionsButton removeFromSuperview];
    self.directionsButton = nil;
  }
  if(self.streetViewButton != nil) {
    [self.streetViewButton removeFromSuperview];
    self.streetViewButton = nil;
  }

  for (GMSPolyline *polyline in self.polylines) {
    polyline.map = nil;
  }
  [self.polylines removeAllObjects];

}

// TODO: Move this to Level 6
- (void)mapView:(GMSMapView *)mapView willMove:(BOOL)gesture
{
  if(self.directionsButton != nil) {
    [self.directionsButton removeFromSuperview];
    self.directionsButton = nil;
  }
  if(self.streetViewButton != nil) {
    [self.streetViewButton removeFromSuperview];
    self.streetViewButton = nil;
  }

  self.mapView.selectedMarker = nil;
  self.activeMarker = nil;
  
  for (GMSPolyline *polyline in self.polylines) {
    polyline.map = nil;
  }
  [self.polylines removeAllObjects];
}

- (GMSPath *)pathForCongressionalData
{
  NSStringEncoding *enc = NULL;
  NSError *error;
  NSString *areaString = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"orange" ofType:@"txt"] usedEncoding:enc error:&error];
  NSArray *splitAreaString = [areaString componentsSeparatedByString:@" "];
  
  GMSMutablePath *mutablePath = [[GMSMutablePath alloc] init];
  for(NSString *latLngString in splitAreaString) {
    NSArray *splitCoordinate = [latLngString componentsSeparatedByString:@","];
    [mutablePath addLatitude:[splitCoordinate[1] doubleValue] longitude:[splitCoordinate[0] doubleValue]];
  }
  return [mutablePath copy];
}

- (void)showStreetView:(id)sender
{
  CSStreetViewVC *streetViewVC = [[CSStreetViewVC alloc] init];
  streetViewVC.coord = self.activeMarker.position;
  streetViewVC.modalPresentationStyle = UIModalPresentationFullScreen;
  streetViewVC.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal;
  NSLog(@"%@ is being presented in longPress: %d", [self class],
        [self isBeingPresented]);
  [self presentViewController:streetViewVC
                     animated:YES
                   completion:^{
                     [sender removeFromSuperview];
                     self.steps = nil;
                     self.mapView.selectedMarker = nil;
                     self.activeMarker = nil;
                   }];
}

@end
