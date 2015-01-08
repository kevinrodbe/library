//
//  SlideshowViewController.m
//
//  Created by Christopher Constable on 9/26/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import "SlideshowViewController.h"

@interface SlideshowViewController ()

@end

@implementation SlideshowViewController

@synthesize posts;

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
    
    [NSTimer scheduledTimerWithTimeInterval:3.0 target:self selector:@selector(updateSlideshowImage:) userInfo:nil repeats:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)updateSlideshowImage:(id)sender
{
    NSLog(@"Timer did fire.");
    UIColor *randomColor = [UIColor colorWithRed:arc4random()%255 / 255.0
                                           green:arc4random()%255 / 255.0
                                            blue:arc4random()%255 / 255.0
                                           alpha:1.0];
    [self.view setBackgroundColor:randomColor];
}

@end
