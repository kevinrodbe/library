//
//  CSDirectionsVC.m
//  cs-maps-level4
//
//  Created by Jon Friskics on 1/24/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSDirectionsVC.h"

#import "CSDirectionsCell.h"

@interface CSDirectionsVC () <UITableViewDataSource, UITableViewDelegate>

@property (strong, nonatomic) UITableView *tableView;

@end

typedef NS_ENUM(NSInteger, CSParsedHtmlType) {
  CSParsedHtmlTypeNormal,
  CSParsedHtmlTypeBold,
  CSParsedHtmlTypeEnding
};

@implementation CSDirectionsVC


- (void)viewDidLoad
{
  [super viewDidLoad];
	self.tableView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
  self.tableView.dataSource = self;
  self.tableView.delegate = self;
  [self.view addSubview:self.tableView];
  
  UIButton *backButton = [UIButton buttonWithType:UIButtonTypeSystem];
  backButton.frame = CGRectMake(20, CGRectGetMaxY(self.view.bounds) - 30, 280, 30);
  [backButton setTitle:@"back" forState:UIControlStateNormal];
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
  return 120;
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

  NSDictionary *step = self.steps[indexPath.row];
  
  NSArray *parsedHtml = [self parseHtmlInstructions:step[@"html_instructions"]];
  
  cell.directionsLabel.text = [self htmlStringAfterParsing:parsedHtml];
  cell.distanceLabel.text = step[@"distance"][@"text"];
  
  return cell;
}


- (void)back:(id)sender
{
  [self dismissViewControllerAnimated:YES completion:^{

  }];
}


- (NSArray *)parseHtmlInstructions:(NSString *)htmlInstructions
{
  NSMutableArray *finishedArray = [[NSMutableArray alloc] init];
  NSMutableString *mutableString = [htmlInstructions mutableCopy];
  
  NSRange rangeToFirstB, rangeToEndB;
  
  while([mutableString rangeOfString:@"<div"].location != 0) {
    if(mutableString.length == 0) {
      break;
    }
    rangeToFirstB = [mutableString rangeOfString:@"<b>"];
    NSDictionary *normal = @{@"type" : @(CSParsedHtmlTypeNormal), @"string" : [[mutableString substringWithRange:NSMakeRange(0, rangeToFirstB.location)] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet] ]};
    [finishedArray addObject:normal];
    [mutableString deleteCharactersInRange:NSMakeRange(0, rangeToFirstB.location)];
    
    rangeToEndB = [mutableString rangeOfString:@"</b>"];
    NSDictionary *bold = @{@"type" : @(CSParsedHtmlTypeBold), @"string" : [[mutableString substringWithRange:NSMakeRange(3, rangeToEndB.location-rangeToEndB.length+1)] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]]};
    [finishedArray addObject:bold];
    [mutableString deleteCharactersInRange:NSMakeRange(0, rangeToEndB.location+rangeToEndB.length)];
  }
  
  if(mutableString.length > 0) {
    NSRange rangeToEndOpenTag = [mutableString rangeOfString:@"\">"];
    NSDictionary *ending = @{@"type" : @(CSParsedHtmlTypeEnding), @"string" : [[mutableString substringWithRange:NSMakeRange(rangeToEndOpenTag.location+rangeToEndOpenTag.length, mutableString.length-rangeToEndOpenTag.location-rangeToEndOpenTag.length-6)] stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceCharacterSet]]};
    [finishedArray addObject:ending];
  }
  
  return finishedArray;
}


- (NSString *)htmlStringAfterParsing:(NSArray *)parsedHtml
{
  NSMutableString *mutableString = [[NSMutableString alloc] init];
  for(NSDictionary *piece in parsedHtml) {
    switch ([piece[@"type"] integerValue]) {
      case CSParsedHtmlTypeNormal:
        [mutableString insertString:piece[@"string"] atIndex:mutableString.length];
        [mutableString insertString:@" " atIndex:mutableString.length];
        break;
      case CSParsedHtmlTypeBold:
        [mutableString insertString:piece[@"string"] atIndex:mutableString.length];
        [mutableString insertString:@" " atIndex:mutableString.length];
        break;
      case CSParsedHtmlTypeEnding:
        [mutableString insertString:piece[@"string"] atIndex:mutableString.length];
        break;
      default:
        break;
    }
  }
  return [mutableString copy];
}


@end
