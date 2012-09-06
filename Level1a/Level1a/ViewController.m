//
//  ViewController.m
//  Level1a
//
//  Created by Eric Allam on 9/6/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#define ARC4RANDOM_MAX      0x100000000

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    self.view = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.view.backgroundColor = [UIColor darkGrayColor];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    NSLog(@"Touch events %@", event);
    double alpha = ((double)arc4random() / ARC4RANDOM_MAX);
    self.view.backgroundColor = [self.view.backgroundColor colorWithAlphaComponent:alpha];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
