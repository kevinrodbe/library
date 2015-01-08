//
//  ViewController.h
//  AlphaTouch
//
//  Created by Eric Allam on 9/10/12.
//  Copyright (c) 2012 Eric Allam. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController

- (IBAction)buttonPressed:(id)sender;

@property (weak, nonatomic) IBOutlet UIButton *fiftyPercentButton;
//@property (weak, nonatomic) UIButton *makeYellowButton;
//@property (weak, nonatomic) UIButton *makeBrownButton;

@end
