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
    
    self.view.backgroundColor = [UIColor brownColor];
    
    
//    self.makeYellowButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
//    self.makeYellowButton.frame = CGRectMake(100, 100, 120, 44);
//    [self.makeYellowButton setTitle:@"Make Yellow!" forState:UIControlStateNormal];
//    [self.makeYellowButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
//    [self.view addSubview:self.makeYellowButton];
//    
//    self.makeBrownButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
//    self.makeBrownButton.frame = CGRectMake(100, 244, 120, 44);
//    [self.makeBrownButton setTitle:@"Make Brown!" forState:UIControlStateNormal];
//    [self.makeBrownButton addTarget:self action:@selector(changeBackgroundColor:) forControlEvents:UIControlEventTouchUpInside];
//    [self.view addSubview:self.makeBrownButton];
}

#define ARC4RANDOM_MAX      0x100000000

- (void)buttonPressed:(UIButton *)sender
{
    if (sender == self.fiftyPercentButton) {
        self.view.alpha = 0.5;
    }else{
        self.view.alpha = 1.0;
    }
}

//- (void)changeBackgroundColor:(UIButton *)sender
//{
//    if (sender == self.makeBrownButton) {
//        self.view.backgroundColor = [UIColor brownColor];
//    }else{
//        self.view.backgroundColor = [UIColor yellowColor];
//    }
//    
//}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
