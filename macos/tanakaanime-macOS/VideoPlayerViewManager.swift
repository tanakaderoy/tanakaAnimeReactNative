//
//  VideoPlayerViewManager.swift
//  tanakaanime-macOS
//
//  Created by Tanaka Mazivanhanga on 3/13/21.
//

import Foundation
import AVKit
@objc(VideoPlayerViewManager)
class VideoPlayerViewManager: RCTViewManager {
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  override func view() -> NSView! {
    return VideoPlayerView()
  }

  @objc func playFromManager(_ node: NSNumber){
    DispatchQueue.main.async {
      guard let component = self.bridge.uiManager.view(forReactTag: node) as? VideoPlayerView else { return }
      component.play()
    }
  }

  @objc func pauseFromManager(_ node: NSNumber){
    DispatchQueue.main.async {
      guard let component = self.bridge.uiManager.view(forReactTag: node) as? VideoPlayerView else { return }
      component.pause()
    }
  }

 @objc func goBackFiveFromManager(_ node: NSNumber){
  DispatchQueue.main.async {
     guard let component = self.bridge.uiManager.view(forReactTag: node) as? VideoPlayerView else { return }
     component.goBackFive()
   }
  }
 @objc func goForwardFiveFromManager(_ node: NSNumber){
  DispatchQueue.main.async {
     guard let component = self.bridge.uiManager.view(forReactTag: node) as? VideoPlayerView else { return }
     component.goForwardFive()
   }
  }
  @objc func seekToFromManager( _ node: NSNumber, seconds: NSNumber){
    DispatchQueue.main.async {
       guard let component = self.bridge.uiManager.view(forReactTag: node) as? VideoPlayerView else { return }
       component.seekTo(seconds)
     }
  }
}

