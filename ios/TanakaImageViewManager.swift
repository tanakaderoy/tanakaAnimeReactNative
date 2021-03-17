//
//  TanakaImageViewManager.swift
//  tanakaanime
//
//  Created by Tanaka Mazivanhanga on 3/16/21.
//

import UIKit
@objc(TanakaImageViewManager)
class TanakaImageViewManager: RCTViewManager{
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func view() -> UIView! {
    return TanakaImageView()
  }
}
