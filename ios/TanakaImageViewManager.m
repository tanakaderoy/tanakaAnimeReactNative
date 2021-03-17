//
//  TanakaImageViewManager.m
//  tanakaanime
//
//  Created by Tanaka Mazivanhanga on 3/16/21.
//

#import "React/RCTViewManager.h"
@interface RCT_EXTERN_MODULE(TanakaImageViewManager, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(url, NSString)
RCT_EXPORT_VIEW_PROPERTY(cornerRadius, NSNumber)
@end
