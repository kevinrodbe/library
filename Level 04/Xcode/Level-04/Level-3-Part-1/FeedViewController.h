//
//  FeedViewController.h
//  InstaPhoto
//
//  Created by Christopher Constable on 10/2/12.
//  Copyright (c) 2012 Futura IO. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface FeedViewController : UIViewController <UITableViewDataSource>

@property (nonatomic, strong) UITableView *tableView;

@end
