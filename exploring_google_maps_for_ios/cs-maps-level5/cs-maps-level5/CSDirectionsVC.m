//
//  CSDirectionsVC.m
//  cs-maps-level5
//
//  Created by Jon Friskics on 1/24/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSDirectionsVC.h"

#import "CSDirectionsCell.h"

@interface CSDirectionsVC () <UITableViewDataSource, UITableViewDelegate>

@property (strong, nonatomic) UITableView *tableView;

@end

@implementation CSDirectionsVC


- (void)viewDidLoad
{
  [super viewDidLoad];
	self.tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
  self.tableView.dataSource = self;
  self.tableView.delegate = self;
  [self.view addSubview:self.tableView];
  
  UIButton *backButton = [UIButton buttonWithType:UIButtonTypeCustom];
  backButton.frame = CGRectMake(110, CGRectGetMaxY(self.view.bounds) - 55, 100, 45);
  [backButton setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateNormal];
  [backButton setBackgroundImage:[UIImage imageNamed:@"button"] forState:UIControlStateHighlighted];
  [backButton setTitle:@"back" forState:UIControlStateNormal];
  [backButton setTitleColor:[UIColor colorWithRed:0.152941176 green:0.439215686 blue:0.788235294 alpha:1.0] forState:UIControlStateNormal];
  [backButton setTitleColor:[UIColor colorWithRed:0.6 green:0.6 blue:0.6 alpha:1.0] forState:UIControlStateHighlighted];
  [backButton addTarget:self action:@selector(back:) forControlEvents:UIControlEventTouchUpInside];
  [self.view addSubview:backButton];
}


- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  
  [self.tableView reloadData];
}


- (void)viewWillLayoutSubviews
{
  [super viewWillLayoutSubviews];
  self.tableView.frame = CGRectMake(CGRectGetMinX(self.view.bounds),
                                    CGRectGetMinY(self.view.bounds),
                                    CGRectGetWidth(self.view.bounds),
                                    CGRectGetHeight(self.view.bounds) - 30);
}


- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
  return 100;
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
  return self.steps.count;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
  CSDirectionsCell *cell = [tableView dequeueReusableCellWithIdentifier:@"cell"];
  
  if(cell == nil) {
    cell = [[CSDirectionsCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:@"cell"];
  }
  
  cell.selectionStyle = UITableViewCellSelectionStyleNone;
  
  NSDictionary *step = self.steps[indexPath.row];
  
  NSString *htmlStringWithFormatting = [NSString stringWithFormat:@"%@ %@",@"<style type='text/css'>body { font-size: 15px; }</style>",step[@"html_instructions"]];
  [cell.directionsWebView loadHTMLString:htmlStringWithFormatting baseURL:nil];
  
  cell.distanceLabel.text = step[@"distance"][@"text"];
  
  return cell;
}


- (void)back:(id)sender
{
  [self dismissViewControllerAnimated:YES completion:^{
    
  }];
}


@end
