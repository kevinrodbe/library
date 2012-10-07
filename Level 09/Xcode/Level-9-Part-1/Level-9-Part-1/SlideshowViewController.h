//
//  SlideshowViewController.h
//
//  Created by Christopher Constable on 9/26/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "InstaPhotoPostDataHandler.h"

@protocol SlideshowDelegate <NSObject>
- (void)slideshowShouldBeDismissed;
@end

@interface SlideshowViewController : UIViewController <InstaPhotoPostDataHandler>
@property (nonatomic, weak) id<SlideshowDelegate> delegate;
@end
