//
//  TanakaDeviceInfo.h
//  tanakaanime
//
//  Created by Tanaka Mazivanhanga on 3/19/21.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface TanakaDeviceInfo : RCTEventEmitter <RCTBridgeModule>
- (void) rotated;
@end
