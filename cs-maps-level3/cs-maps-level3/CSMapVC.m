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

@interface CSMapVC ()<GMSMapViewDelegate>

@property(strong, nonatomic) GMSMapView *mapView;

@property(copy, nonatomic) NSArray *markers;

@property(strong, nonatomic) NSURLSession *markerSession;

// TODO: remove the polyline stuff - just using it for testing here
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

  // don't manually load any markers anymore
  //  [self setupMarkerData];
}

// don't manually load any markers anymore
//- (void)setupMarkerData {
//  GMSMarker *marker1 = [[GMSMarker alloc] init];
//  marker1.position = CLLocationCoordinate2DMake(28.54111, -81.37052);
//  marker1.map = nil;
//  marker1.title = @"The Abbey";
//  marker1.snippet = @"Theatre";
//  marker1.appearAnimation = kGMSMarkerAnimationPop;
//  marker1.icon = [GMSMarker markerImageWithColor:[UIColor greenColor]];
//
//  GMSMarker *marker2 = [[GMSMarker alloc] init];
//  marker2.position = CLLocationCoordinate2DMake(28.53111, -81.36052);
//  marker2.map = nil;
//  marker2.title = @"2";
//  marker2.snippet = @"snippet2";
//  marker2.appearAnimation = kGMSMarkerAnimationPop;
//  marker2.icon = [GMSMarker markerImageWithColor:[UIColor blueColor]];
//
//  GMSMarker *marker3 = [[GMSMarker alloc] init];
//  marker3.position = CLLocationCoordinate2DMake(28.55111, -81.36852);
//  marker3.map = nil;
//  marker3.title = @"3";
//  marker3.snippet = @"3";
//  marker3.appearAnimation = kGMSMarkerAnimationPop;
//  marker3.icon = [UIImage imageNamed:@"pin"];
//
//  NSMutableArray *mutableMarkers =
//  [[NSMutableArray alloc] initWithArray:self.markerData];
//  [mutableMarkers addObjectsFromArray:@[ marker1, marker2, marker3 ]];
//  self.markerData = [[NSArray alloc] initWithArray:mutableMarkers];
//
//  [self drawMarkers];
//}

- (void)drawMarkers {
  for (CSMarker *marker in self.markers) {
    if (marker.map == nil) {
      marker.map = self.mapView;
    }
  }
}

- (void)drawMarkersInVisibleRegion:(GMSVisibleRegion)visibleRegion {
  for (NSInteger i = 0; i < [self.markers count]; i++) {
    CSMarker *marker = self.markers[i];
    if (GMSGeometryContainsLocation(marker.position, self.polyline.path, YES) &&
        marker.map == nil) {
      marker.map = self.mapView;
    } else if (GMSGeometryContainsLocation(marker.position, self.polyline.path,
                                           YES) &&
               marker.map != nil) {

    } else {
      marker.map = nil;
    }
    NSMutableArray *mutableArray =
        [[NSMutableArray alloc] initWithArray:self.markers];
    [mutableArray replaceObjectAtIndex:i withObject:marker];
    self.markers = [mutableArray copy];
  }
}

- (void)mapView:(GMSMapView *)mapView
    didChangeCameraPosition:(GMSCameraPosition *)position {

  // TODO: remove polyline code - just in here for testing
  self.polyline.map = nil;
  self.polyline =
      [GMSPolyline polylineWithPath:[self pathForVisibleRegion:mapView]];
  self.polyline.strokeWidth = 10;
  self.polyline.strokeColor = [UIColor redColor];
  self.polyline.map = self.mapView;

  [self drawMarkersInVisibleRegion:mapView.projection.visibleRegion];
}

// TODO: remove this method, just in here for testing
- (GMSPath *)pathForVisibleRegion:(GMSMapView *)mapView {
  GMSMutablePath *path = [GMSMutablePath path];
  [path addCoordinate:CLLocationCoordinate2DMake(
                          mapView.projection.visibleRegion.nearLeft.latitude,
                          mapView.projection.visibleRegion.nearLeft.longitude)];
  [path
      addCoordinate:CLLocationCoordinate2DMake(
                        mapView.projection.visibleRegion.nearRight.latitude,
                        mapView.projection.visibleRegion.nearRight.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(
                          mapView.projection.visibleRegion.farRight.latitude,
                          mapView.projection.visibleRegion.farRight.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(
                          mapView.projection.visibleRegion.farLeft.latitude,
                          mapView.projection.visibleRegion.farLeft.longitude)];
  [path addCoordinate:CLLocationCoordinate2DMake(
                          mapView.projection.visibleRegion.nearLeft.latitude,
                          mapView.projection.visibleRegion.nearLeft.longitude)];

  return path;
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
      CGRectMake(10, CGRectGetMaxY(titleLabel.frame) + 10, 180, 120);
  snippetLabel.numberOfLines = 0;
  snippetLabel.font = [UIFont preferredFontForTextStyle:UIFontTextStyleBody];
  snippetLabel.text = marker.snippet;
  [infoWindow addSubview:snippetLabel];

  return infoWindow;
}

- (void)downloadMarkers:(id)sender {

  // define the API URL
  NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:@"http://jonfriskics.com/mapsapi/v1/getPoints/?type=lakes"]];

  NSURLSessionDataTask *task = [self.markerSession dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *e) {
    
    NSArray *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
    
    [[NSOperationQueue mainQueue] addOperationWithBlock:^{
      [self triageDownloadedMarkerData:json];
    }];
  }];

  [task resume];
}

- (void)triageDownloadedMarkerData:(NSArray *)json {
  // get a mutable copy of all of the markers
  NSMutableArray *mutableArray = [[NSMutableArray alloc] initWithArray:self.markers];

    // loop through each of the new markers one at a time
    for (NSDictionary *mark in json) {

      // create a CSMarker - this is a GMSMarker subclass that overrides
      // isEqual:
      CSMarker *marker = [[CSMarker alloc] init];

      // read in all of the data from the returned json dictionary
      marker.appearAnimation = [mark[@"appearAnimation"] integerValue];
      marker.position = CLLocationCoordinate2DMake([mark[@"lat"] doubleValue],
                                                   [mark[@"lng"] doubleValue]);
      marker.title = mark[@"title"];
      marker.snippet = mark[@"snippet"];
      marker.flat = [mark[@"flat"] boolValue];

      // don't show the map yet
      marker.map = nil;

      // if the set already contains this object, then don't add it to the set
      // if the set doesn't contain the object, then add it to the set
      if ([self.markers containsObject:marker]) {
        NSLog(@"set already contains %@", marker);
      } else {
        NSLog(@"added %@ to set", marker);
        [mutableArray addObject:marker];
      }
    }

    // cast the mutable set as an immutable one
    self.markers = [mutableArray copy];

    // re-draw the markers
    [self drawMarkers];
}

@end
