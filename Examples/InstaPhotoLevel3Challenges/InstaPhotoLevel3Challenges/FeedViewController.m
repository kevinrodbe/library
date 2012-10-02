#import "FeedViewController.h"

@implementation FeedViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    
    self.title = @"Feed";
    self.tabBarItem.image = [UIImage imageNamed:@"feed"];
    
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
}

@end
