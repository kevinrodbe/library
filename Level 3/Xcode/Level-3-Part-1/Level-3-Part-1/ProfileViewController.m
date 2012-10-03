//
//  ProfileViewController.m
//  Level-3-Part-1
//
//  Created by Christopher Constable on 10/2/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import "ProfileViewController.h"

@interface ProfileViewController ()

@end

@implementation ProfileViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        self.title = @"Profile";
        self.tabBarItem.image = [UIImage imageNamed:@"tab_icon_profile"];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor whiteColor];
    
    // Add the profile picture
    UIButton *profilePicture = [UIButton buttonWithType:UIButtonTypeCustom];
    [profilePicture addTarget:self action:@selector(profilePicturePressed:) forControlEvents:UIControlEventTouchUpInside];
    [profilePicture setImage:[UIImage imageNamed:@"profile_picture"] forState:UIControlStateNormal];
    [profilePicture setImage:[UIImage imageNamed:@"profile_picture"] forState:UIControlStateHighlighted];
    [profilePicture setFrame:CGRectMake(15, 15, 52, 60)];
    
    [self.view addSubview:profilePicture];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)profilePicturePressed:(id)sender
{
    // Create new view controller
    UIViewController *profileImageViewController = [[UIViewController alloc] init];
    profileImageViewController.view.frame = self.view.frame;
    
    // Create and add image view
    UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"profile_picture_large"]];
    [imageView setContentMode:UIViewContentModeScaleAspectFit];
    imageView.frame = profileImageViewController.view.frame;
    [profileImageViewController.view addSubview:imageView];
    
    // Push new view controller
    [self.navigationController pushViewController:profileImageViewController animated:YES];
}

@end
