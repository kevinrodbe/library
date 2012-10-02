//
//  SecondViewController.m
//  InstaPhotoLevel3
//
//  Created by Eric Allam on 9/27/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#import "SecondViewController.h"

@interface SecondViewController ()

@end

@implementation SecondViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];

    self.title = NSLocalizedString(@"Second", @"Second");
    self.tabBarItem.image = [UIImage imageNamed:@"second"];

    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    NSLog(@"SecondViewController -viewDidLoad");
//    self.title = @"Second";
//    self.tabBarItem.image = [UIImage imageNamed:@"second"];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
