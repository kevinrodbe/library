//
//  StreetViewVC.m
//  cs-maps
//
//  Created by Jon Friskics on 12/18/13.
//  Copyright (c) 2013 Jon Friskics. All rights reserved.
//

// TODO: check panorama before showing it.  nil stuff

#import "CSStreetViewVC.h"

@interface CSStreetViewVC ()

@end

@implementation CSStreetViewVC

- (id)initWithNibName:(NSString *)nibNameOrNil
               bundle:(NSBundle *)nibBundleOrNil {
  self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
  if (self) {
    // Custom initialization
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated {
  [super viewDidAppear:animated];

  GMSPanoramaService *service = [[GMSPanoramaService alloc] init];
  [service requestPanoramaNearCoordinate:self.coordinate callback:^(GMSPanorama *panorama, NSError *error) {
    if (panorama != nil) {
      GMSPanoramaCamera *camera =
          [GMSPanoramaCamera cameraWithHeading:180 pitch:0 zoom:1 FOV:90];
      GMSPanoramaView *panoView = [[GMSPanoramaView alloc] init];
      panoView.camera = camera;
      panoView.panorama = panorama;
      self.view = panoView;

      UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
      [button setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateNormal];
      [button setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateHighlighted];
      button.frame = CGRectMake(40, 40, 80, 40);
      [button setTitle:@"close" forState:UIControlStateNormal];
      [button setTitleColor:[UIColor colorWithRed:0.152941176 green:0.439215686 blue:0.788235294 alpha:1.0] forState:UIControlStateNormal];
      [button setTitleColor:[UIColor colorWithRed:0.6 green:0.6 blue:0.6 alpha:1.0] forState:UIControlStateHighlighted];
      [button addTarget:self
                    action:@selector(closeStreetView:)
          forControlEvents:UIControlEventTouchUpInside];
      [self.view addSubview:button];
    } else {
      [[[UIAlertView alloc] initWithTitle:@"No Street View data found" message:@"We couldn't find a street view at this place.  Try again with a marker near a road" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil] show];
      [self closeStreetView:nil];
    }
  }];
}

- (void)closeStreetView:(id)sender {
  [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Dispose of any resources that can be recreated.
}

@end
