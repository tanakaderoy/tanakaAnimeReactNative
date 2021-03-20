//
//  TanakaDeviceInfo.m
//  tanakaanime
//
//  Created by Tanaka Mazivanhanga on 3/19/21.
//

#import <UIKit/UIKit.h>
#import "TanakaDeviceInfo.h"

@implementation TanakaDeviceInfo{
  bool hasListeners;
}

//-(id) init {
//  self = [super init];
//  [NSNotificationCenter.defaultCenter addObserver:self selector: @selector(rotated) name:UIDeviceOrientationDidChangeNotification object:nil];
//  return self;
//}

//- (void)dealloc
//{
//  [[NSNotificationCenter defaultCenter] removeObserver:self];
//}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"currentOrientation"];
}

- (void)rotated{
  UIDeviceOrientation orientation = UIDevice.currentDevice.orientation;
  if(hasListeners){
  if (UIDeviceOrientationIsLandscape(orientation)){
    [self sendEventWithName:@"currentOrientation" body:@{@"orientation":@"landscape"}];
  }else{
    [self sendEventWithName:@"currentOrientation" body:@{@"orientation":@"portrait"}];
  }
  }
  
}

- (void)startObserving {
  hasListeners = YES;
  [NSNotificationCenter.defaultCenter addObserver:self selector: @selector(rotated) name:UIDeviceOrientationDidChangeNotification object:nil];
}

- (void)stopObserving {
  hasListeners = NO;
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}



RCT_EXPORT_MODULE(TanakaDeviceInfo)

RCT_EXPORT_METHOD(getDeviceType: (RCTResponseSenderBlock) callback){
  switch ([[UIDevice currentDevice] userInterfaceIdiom]) {
    case UIUserInterfaceIdiomPhone:
      callback(@[@"phone"]);
      break;
    case UIUserInterfaceIdiomPad:
      callback(@[@"pad"]);
      break;
    default:
      callback(@[@"unkown"]);
      break;
  }
}


@end
