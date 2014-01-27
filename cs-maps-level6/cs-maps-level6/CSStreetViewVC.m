//
//  StreetViewVC.m
//  cs-maps
//
//  Created by Jon Friskics on 12/18/13.
//  Copyright (c) 2013 Jon Friskics. All rights reserved.
//

#import "CSStreetViewVC.h"

@interface CSStreetViewVC ()

@end

@implementation CSStreetViewVC

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  NSLog(@"%@ is being presented in streetViewVC: %d",[self class],[self isBeingPresented]);
  
  GMSPanoramaCamera *camera = [GMSPanoramaCamera cameraWithHeading:180 pitch:0 zoom:1 FOV:90];
  GMSPanoramaView *panoView =
  [GMSPanoramaView panoramaWithFrame:CGRectZero
                      nearCoordinate:self.coord];
  
  panoView.camera = camera;
  
  self.view = panoView;
  
  UIButton *button = [UIButton buttonWithType:UIButtonTypeSystem];
  button.backgroundColor = [UIColor blueColor];
  button.frame = CGRectMake(40, 40, 80, 40);
  [button setTitle:@"close" forState:UIControlStateNormal];
  [button addTarget:self action:@selector(closeStreetView:) forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:button];
}

- (void)closeStreetView:(id)sender
{
  [self dismissViewControllerAnimated:YES completion:nil];
}



- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
