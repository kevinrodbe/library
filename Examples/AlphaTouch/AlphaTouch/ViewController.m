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
    
    self.view.backgroundColor = [UIColor darkGrayColor];
    UIButton *firstButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [firstButton setTranslatesAutoresizingMaskIntoConstraints:NO];
    [firstButton setTitle:@"Click me!" forState:UIControlStateNormal];
    [firstButton addTarget:self action:@selector(buttonPressed:) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:firstButton];
    
    NSArray *cns = [NSLayoutConstraint constraintsWithVisualFormat:@"|-[firstButton]-|"
                                                           options:NSLayoutAttributeCenterX
                                                           metrics:nil
                                                             views:NSDictionaryOfVariableBindings(firstButton)];
    
    [self.view addConstraints:cns];
    
    cns = [NSLayoutConstraint constraintsWithVisualFormat:@"V:[firstButton]-10-|"
                                                  options:NSLayoutAttributeBottom metrics:nil
                                                    views:NSDictionaryOfVariableBindings(firstButton)];
    
    [self.view addConstraints:cns];
    
//    NSLayoutConstraint *cn =
//        [NSLayoutConstraint constraintWithItem:firstButton
//                                     attribute:NSLayoutAttributeCenterX
//                                     relatedBy:NSLayoutRelationEqual
//                                        toItem:self.view
//                                     attribute:NSLayoutAttributeCenterX
//                                    multiplier:1.0
//                                      constant:0.0];
//    [self.view addConstraint:cn];
//    
//    cn =
//        [NSLayoutConstraint constraintWithItem:firstButton
//                                     attribute:NSLayoutAttributeBottom
//                                     relatedBy:NSLayoutRelationEqual
//                                        toItem:firstButton.superview
//                                     attribute:NSLayoutAttributeBottom
//                                    multiplier:1.0
//                                      constant:-10.0];
//    
//    [self.view addConstraint:cn];
}

#define ARC4RANDOM_MAX      0x100000000

- (IBAction)buttonPressed:(UIButton *)sender
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
