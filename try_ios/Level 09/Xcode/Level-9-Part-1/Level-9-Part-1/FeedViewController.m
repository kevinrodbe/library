//
//  ViewController.m
//
//  Created by Christopher Constable on 9/24/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import "FeedViewController.h"

@interface FeedViewController ()

@end

@implementation FeedViewController

@synthesize posts;

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    [super prepareForSegue:segue sender:sender];
    if ([segue.destinationViewController conformsToProtocol:@protocol(InstaPhotoPostDataHandler)]) {
        ((id<InstaPhotoPostDataHandler>)segue.destinationViewController).posts = self.posts;
    }
}

- (void)slideshowShouldBeDismissed
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
