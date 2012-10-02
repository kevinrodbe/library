//
//  FirstViewController.m
//  InstaPhotoLevel3
//
//  Created by Eric Allam on 9/27/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#import "FirstViewController.h"

@interface FirstViewController ()

@end

@implementation FirstViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    self.title = @"First";
    self.tabBarItem.image = [UIImage imageNamed:@"first"];
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSLog(@"FirstViewController -viewDidLoad");
//    self.title = @"First";
//    self.tabBarItem.image = [UIImage imageNamed:@"first"];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
