//
//  ViewController.m
//  AlphaTouch
//
//  Created by Eric Allam on 9/10/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

//- (void)loadView
//{
//    self.view = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
//    
//}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    self.view.backgroundColor = [UIColor darkGrayColor];
}

#define ARC4RANDOM_MAX      0x100000000

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    self.view.alpha = ((double)arc4random() / 0x100000000);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
