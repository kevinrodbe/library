//
//  ViewController.h
//
//  Created by Christopher Constable on 9/24/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "SlideshowViewController.h"
#import "InstaPhotoPostDataHandler.h"

@interface FeedViewController : UIViewController <SlideshowDelegate, InstaPhotoPostDataHandler>

@end
