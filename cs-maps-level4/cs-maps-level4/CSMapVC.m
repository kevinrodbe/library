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

@interface CSMapVC ()<GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;

@property(copy, nonatomic) NSSet *markers;

@property(strong, nonatomic) NSURLSession *markerSession;

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
}

- (void)drawMarkers {
  for (CSMarker *marker in self.markers) {
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
  NSLog(@"%s",__PRETTY_FUNCTION__);

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
  
  NSLog(@"distance: %@",marker.userData);
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
  NSMutableSet *mutableSet =
      [[NSMutableSet alloc] initWithSet:self.markers];

  for (NSDictionary *mark in json) {

    CSMarker *marker = [[CSMarker alloc] init];

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
  NSLog(@"%s",__PRETTY_FUNCTION__);

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
  NSLog(@"request: %@", [request.URL absoluteString]);
  
  NSURLSessionDataTask *task = [self.markerSession  dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {
    NSDictionary *json = (NSDictionary *)
    [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
      NSMutableSet *mutableMarkers = [self.markers mutableCopy];
      CSMarker *m = [mutableMarkers member:marker];
      
      [mutableMarkers removeObject:m];
      m.userData = @{@"distance" : json[@"rows"][0][@"elements"][0][@"distance"][@"text"]};
      [mutableMarkers addObject:m];
      
      self.markers = [mutableMarkers copy];
      
      /* TODO: ask if there's a better way than this.
       *       this is forcing the info window to re-open, and it seems kind of hacky
       */
      [mapView setSelectedMarker:marker];
    }];
  }];
  
  [task resume];

  return NO;
}


@end
