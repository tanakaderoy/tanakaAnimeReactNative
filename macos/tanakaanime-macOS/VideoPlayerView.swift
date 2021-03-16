//
//  VideoPlayerView.swift
//  tanakaanime-macOS
//
//  Created by Tanaka Mazivanhanga on 3/13/21.
//

import AVKit
import AVFoundation
import Foundation

class VideoPlayerView: NSView {
  // Define Now Playing Info
  var nowPlayingInfo = [String : Any]()
  var player: AVPlayer? = AVPlayer()
  var playerLayer:  AVPlayerLayer!
  var playerContainerView: NSView = NSView()
  var playerView: AVPlayerView = AVPlayerView()
  var hasEnded = false
  @objc var isVideoPlaying: NSNumber = 0

  var name = ""
  @objc var videoName: NSString = ""{
    didSet {
      name = videoName as String
    }
  }

  @objc var thumbnailUrl: NSString = ""{
    didSet {
    }
  }
  @objc var url: NSString = "" {
    didSet {
      print(url)
      playerView.player = nil
      player = nil
      player = AVPlayer()
      playerView.player = player

      playVideo(url)
//      playVideo("https://mountainoservo0002.animecdn.com/Jujutsu-Kaisen/Jujutsu-Kaisen-Episode-01-1080p.mp4")
    }
  }
  @objc var onPlayerUpdate: RCTDirectEventBlock?
  @objc var maximumSliderValue: NSNumber = 0
  @objc var sliderValue: NSNumber = 0
  @objc var minimumValue:NSNumber = 0

  @objc var duration: NSString = ""
  @objc var currentPlayerTime: NSString = ""

  override init(frame frameRect: NSRect) {
    super.init(frame: frameRect)
  commoninit()
  }

  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  
  fileprivate func setUpPlayerContainer() {
//    playerContainerView.layer?.backgroundColor = .white
    playerContainerView.backgroundColorr = .blue
    addSubview(playerContainerView)
    playerContainerView.fillSuperView()
//    playerContainerView.translatesAutoresizingMaskIntoConstraints = false
//    NSLayoutConstraint.activate([
//      playerContainerView.leadingAnchor.constraint(equalTo: leadingAnchor),
//      playerContainerView.trailingAnchor.constraint(equalTo: trailingAnchor),
//      playerContainerView.heightAnchor.constraint(equalTo: heightAnchor, multiplier: 1),
//      playerContainerView.topAnchor.constraint(equalTo: topAnchor)
//    ])
    addPlayerToView(self)
  }

  fileprivate func commoninit() {
    setUpPlayerContainer()
  }

  fileprivate func addPlayerToView( _ view: NSView){
//    playerView = AVPlayerView()
  
    view.addSubview(playerView)
//    let imageview = NSImageView()
//    view.addSubview(imageview)
//    imageview.fillSuperView()
//    imageview.image = .init(byReferencing: URL(string: "https://i2-prod.football.london/chelsea-fc/players/article20141681.ece/ALTERNATES/s615/0_BeFunky-collage-1.jpg")!)
    
    playerView.showsFullScreenToggleButton = true
    playerView.backgroundColorr = .red
    playerView.fillSuperView()
    
//    playVideo("https://mountainoservo0002.animecdn.com/Jujutsu-Kaisen/Jujutsu-Kaisen-Episode-01-1080p.mp4")
//    view.wantsLayer = true
//    playerLayer = AVPlayerLayer(player: player)
//    playerLayer.frame = view.bounds
//    playerLayer.videoGravity = .resizeAspectFill
//    view.layer?.addSublayer(playerLayer)
    NotificationCenter.default.addObserver(self, selector: #selector(playerEndPlay), name: .AVPlayerItemDidPlayToEndTime, object: nil)
  }

  override func layout(){
    super.layout()

//    playerLayer.frame = playerContainerView.bounds
//    playerView.frame = playerContainerView.bounds

  }

  @objc func play(){
    isVideoPlaying = 1
    if hasEnded{
      player?.seek(to: CMTime(seconds: 0, preferredTimescale: 1000))
      player?.play()
    }
    player?.play()
  }

  @objc func pause() {
    isVideoPlaying = 0
    player?.pause()
  }

  @objc func goForwardFive() {
    guard let duration = player?.currentItem?.duration, let currentTime = player?.currentTime() else {return }
    let newTime  = CMTimeGetSeconds(currentTime) + 5.0
    if newTime < (CMTimeGetSeconds(duration) - 5.0) {
      let time = CMTime(value: CMTimeValue(newTime*1000), timescale: 1000)
      player?.seek(to: time)
    }
  }

  @objc func seekTo(_ seconds: NSNumber){
    let value = CMTime(value: CMTimeValue(truncating: NSNumber(value: seconds.intValue * 1000)), timescale: 1000)
    player?.seek(to: value)
  }

  @objc func goBackFive() {
    guard let currentTime = player?.currentTime() else {return }
    var newTime  = CMTimeGetSeconds(currentTime) - 5.0
    if newTime < 0 {
      newTime = 0
    }
    let time = CMTime(value: CMTimeValue(newTime*1000), timescale: 1000)
    player?.seek(to: time)
  }

  @objc func playerEndPlay() {
    print("Player has ended")
    hasEnded = true
    isVideoPlaying = 0
    sendOnPlayerUpdate()
  }

  @objc func playVideo( _ url: NSString){
    guard let itemUrl = URL(string: url  as String) else {return}
    let playerItem = AVPlayerItem(url: itemUrl)
    player?.replaceCurrentItem(with: playerItem)
    player?.currentItem?.addObserver(self, forKeyPath: "duration", options: [.new, .initial], context: nil)
    addTimeObseerver()
    play()
  }


  override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
    if keyPath == "duration", let playerDuration = player?.currentItem?.duration.seconds, playerDuration > 0.0 {
      duration = getTimeString(from: player?.currentItem?.duration) as NSString
      currentPlayerTime = getTimeString(from: player?.currentTime()) as NSString
      sendOnPlayerUpdate()
    }
  }


  func addTimeObseerver() {
    let interval = CMTime(seconds: 0.5, preferredTimescale: CMTimeScale(NSEC_PER_SEC))
    let mainQueue = DispatchQueue.main
    _ = player?.addPeriodicTimeObserver(forInterval: interval, queue: mainQueue, using: { [weak self] (time) in
      guard let currentItem = self?.player?.currentItem else {return}
      self?.maximumSliderValue = NSNumber(value: currentItem.duration.seconds)
      self?.minimumValue = 0
      //For some reason on my actual device running iOS14  !currentItem.currentTime().seconds.isNaN was NaN
      self?.sliderValue = !currentItem.currentTime().seconds.isNaN ? NSNumber(value: currentItem.currentTime().seconds) :  NSNumber(value:currentItem.asset.duration.seconds)
      self?.currentPlayerTime = (self?.getTimeString(from: currentItem.currentTime()) ?? "00:00") as NSString
      self?.sendOnPlayerUpdate()
    })
  }

  func getTimeString(from time: CMTime?) -> String {
    guard let time = time else {return "00:00"}
    let totalSeconds = CMTimeGetSeconds(time)
    let hours = Int(totalSeconds/3600)
    let minutes = Int(totalSeconds/60) % 60
    let seconds = Int(totalSeconds.truncatingRemainder(dividingBy: 60))
    if hours > 0 {
      return String(format: "%i:%02i:%02i", arguments: [hours,minutes,seconds])
    }else {
      return String(format: "%02i:%02i", arguments: [minutes,seconds])

    }
  }



  
  func sendOnPlayerUpdate(){
    if let onPlayerUpdate = onPlayerUpdate {
      maximumSliderValue = maximumSliderValue.doubleValue.isNaN ? 0 as NSNumber : maximumSliderValue
      onPlayerUpdate(["duration": duration, "currentTime": currentPlayerTime, "sliderValue": sliderValue, "sliderMinValue": minimumValue, "sliderMaxValue":maximumSliderValue, "isPlaying": isVideoPlaying])
    }
  }

  func sendSliderValueUpdate(){
    if let onPlayerUpdate = onPlayerUpdate {
      onPlayerUpdate(["duration": duration])
    }
  }

  deinit {
    print("Remov Observers")
    player?.currentItem?.removeObserver(self, forKeyPath: "duration")
    NotificationCenter.default.removeObserver(self)
  }

  func downloadImage(url:URL, completion: @escaping((_ image: UIImage?) -> ())){
    print("Started downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
    getDataFromUrl(url: url) { (data) in
      DispatchQueue.main.async {
        print("Finished downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
        completion(UIImage(data: data!))
      }
    }

  }

  func getDataFromUrl(url:URL, completion: @escaping((_ data: Data?) -> ())) {
    URLSession.shared.dataTask(with: url) { (data, response, error) in
      completion(data)
    }.resume()
  }
  
}
extension NSView {
    var backgroundColorr: NSColor? {
        get {
            guard let color = layer?.backgroundColor else { return nil }
            return NSColor(cgColor: color)
        }
        set {
            wantsLayer = true
            layer?.backgroundColor = newValue?.cgColor
        }
    }
  
  
  func pinEdges(to other: NSView) {
    translatesAutoresizingMaskIntoConstraints = false
         leadingAnchor.constraint(equalTo: other.leadingAnchor).isActive = true
         trailingAnchor.constraint(equalTo: other.trailingAnchor).isActive = true
         topAnchor.constraint(equalTo: other.topAnchor).isActive = true
         bottomAnchor.constraint(equalTo: other.bottomAnchor).isActive = true
     }
  
  
  func fillSuperView() {
    translatesAutoresizingMaskIntoConstraints = false
    guard let superview = superview else {
      return
    }
    leadingAnchor.constraint(equalTo: superview.leadingAnchor).isActive = true
    trailingAnchor.constraint(equalTo: superview.trailingAnchor).isActive = true
    topAnchor.constraint(equalTo: superview.topAnchor).isActive = true
    bottomAnchor.constraint(equalTo: superview.bottomAnchor).isActive = true
  }
}
