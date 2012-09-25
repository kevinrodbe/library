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

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    firstButton.frame = CGRectMake(100, 100, 100, 44);
    [firstButton setTitle:@"Click me!" forState:UIControlStateNormal];
    [firstButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:firstButton];
    
    UILabel *firstLabel = [[UILabel alloc] initWithFrame:CGRectMake(100, 200, 200, 44)];
    firstLabel.text = @"Hello I am a UILabel";
    [self.view addSubview:firstLabel];
}

#define ARC4RANDOM_MAX      0x100000000

- (void)buttonPressed:(UIButton *)sender
{
    NSLog(@"Button pressed, sender: %@", sender);
    self.view.alpha = ((double)arc4random() / 0x100000000);
    [sender removeFromSuperview];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
