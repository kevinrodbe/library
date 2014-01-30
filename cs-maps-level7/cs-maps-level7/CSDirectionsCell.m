//
//  CSDirectionsCell.m
//  cs-maps-level7
//
//  Created by Jon Friskics on 1/24/14.
//  Copyright (c) 2014 Code School. All rights reserved.
//

#import "CSDirectionsCell.h"

@implementation CSDirectionsCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
      self.directionsLabel = [[UILabel alloc] init];
      self.directionsLabel.numberOfLines = 0;
      self.directionsLabel.lineBreakMode = NSLineBreakByWordWrapping;
      self.directionsLabel.font = [UIFont fontWithName:@"Helvetica" size:17.0f];
      [self addSubview:self.directionsLabel];
      
      self.distanceLabel = [[UILabel alloc] init];
      self.distanceLabel.numberOfLines = 1;
      [self addSubview:self.distanceLabel];
    }
    return self;
}


- (void)layoutSubviews
{
  [super layoutSubviews];
  
  CGRect directionsLabelFrame = self.directionsLabel.frame;
  directionsLabelFrame.origin.x = 20;
  directionsLabelFrame.origin.y = 20;
  directionsLabelFrame.size.width = 280;
  self.directionsLabel.frame = directionsLabelFrame;
  [self.directionsLabel sizeToFit];
  
  self.distanceLabel.frame = CGRectMake(20, CGRectGetMaxY(self.directionsLabel.frame) + 20, 280, 30);
}

@end
