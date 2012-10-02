//
//  ProfileViewController.m
//  InstaPhotoLevel3Challenges
//
//  Created by Eric Allam on 10/2/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#import "ProfileViewController.h"


@implementation ProfileViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    self.title = @"Profile";
    self.tabBarItem.image = [UIImage imageNamed:@"profile"];
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

@end
