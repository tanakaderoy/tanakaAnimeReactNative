//
//  ViewController.swift
//  tanakaanime-macOS
//
//  Created by Tanaka Mazivanhanga on 3/15/21.
//

import Cocoa


class ViewController: NSViewController {
  
  override func viewDidLoad() {
    super.viewDidLoad()
    guard let appDelegate = (NSApp.delegate as? AppDelegate) else {return}
    DispatchQueue.main.async {[weak self] in
      guard let window = self?.view.window, let screen = NSScreen.main else {return}
      let screenRect = screen.visibleFrame
      window.setFrame(NSRect(x: window.frame.origin.x, y: window.frame.origin.y, width: screenRect.width/1.7, height: screenRect.height * 0.8), display: true, animate: true)
      print("windowFrame \(window.frame)")
    }
//    self.view.window?.setFrame(NSRect(x:0,y:0,width: 1440,height: 790), display: true)
    let bridge:RCTBridge = appDelegate.bridge
    let rootView = RCTRootView(bridge: bridge, moduleName: "tanakaanime", initialProperties: nil)
    let view = self.view
    view.addSubview(rootView)
    rootView.fillSuperView()
    rootView.backgroundColor = NSColor.windowBackgroundColor
    
    
  }
//  RCTBridge *bridge = [((AppDelegate *)[NSApp delegate])bridge];
//  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge moduleName:@"tanakaanime" initialProperties:nil];
//
//  NSView *view = [self view];
//
//  [view addSubview:rootView];
//  [rootView setBackgroundColor:[NSColor windowBackgroundColor]];
//  [rootView setFrame:[view bounds]];
//  [rootView setAutoresizingMask:(NSViewMinXMargin | NSViewMinXMargin | NSViewMinYMargin | NSViewMaxYMargin | NSViewWidthSizable | NSViewHeightSizable)];
//}
  
//  VC.h
//  #import <Cocoa/Cocoa.h>
//
//  @interface ViewController : NSViewController
//
//  @end

}
