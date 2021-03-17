//
//  TanakaImageView.swift
//  tanakaanime
//
//  Created by Tanaka Mazivanhanga on 3/16/21.
//

import UIKit
import Foundation

class TanakaImageView: UIView {
  var container: UIView = UIView()
  var imageView:UIImageView = UIImageView()
  @objc var url: NSString = "" {
    didSet {
      print("url is: \n\(url)")
      guard let imageUrl = URL(string: url as String) else {return}
      ImageLoader.shared.loadImage(from: imageUrl) { [weak self] (image) in
        DispatchQueue.main.async {
          self?.imageView.image = image
        }
      }
    }
  }
  
  @objc var cornerRadius: NSNumber = 0 {
    didSet{
      self.imageView.layer.masksToBounds = true
      self.imageView.layer.cornerRadius = CGFloat(truncating: cornerRadius)
    }
  }
  
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    
    addSubview(container)
    container.fillSuperView()
    container.addSubview(imageView)
    imageView.fillSuperView()
    
    
  }
  
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  func downloadImage(url:URL, completion: @escaping((_ image: UIImage?) -> ())){
    print("Started downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
    getDataFromUrl(url: url) { (data) in
      DispatchQueue.main.async {
        print("Finished downloading \"\(url.deletingPathExtension().lastPathComponent)\".")
        guard let data = data else {
          completion(UIImage())
          return
          
        }
        completion(UIImage(data: data))
      }
    }

  }

  func getDataFromUrl(url:URL, completion: @escaping((_ data: Data?) -> ())) {
    URLSession.shared.dataTask(with: url) { (data, response, error) in
      completion(data)
    }.resume()
  }
  
}


extension UIImage {

    func decodedImage() -> UIImage {
        guard let cgImage = cgImage else { return self }
        let size = CGSize(width: cgImage.width, height: cgImage.height)
        let colorSpace = CGColorSpaceCreateDeviceRGB()
        let context = CGContext(data: nil, width: Int(size.width), height: Int(size.height), bitsPerComponent: 8, bytesPerRow: cgImage.bytesPerRow, space: colorSpace, bitmapInfo: CGImageAlphaInfo.noneSkipFirst.rawValue)
        context?.draw(cgImage, in: CGRect(origin: .zero, size: size))
        guard let decodedImage = context?.makeImage() else { return self }
        return UIImage(cgImage: decodedImage)
    }
  // Rough estimation of how much memory image uses in bytes
     var diskSize: Int {
         guard let cgImage = cgImage else { return 0 }
         return cgImage.bytesPerRow * cgImage.height
     }
}



// Declares in-memory image cache
protocol ImageCacheType: class {
  // Returns the image associated with a given url
    func image(for url: URL) -> UIImage?
    // Inserts the image of the specified url in the cache
    func insertImage(_ image: UIImage?, for url: URL)
    // Removes the image of the specified url in the cache
    func removeImage(for url: URL)
    // Removes all images from the cache
    func removeAllImages()
    // Accesses the value associated with the given key for reading and writing
    subscript(_ url: URL) -> UIImage? { get set }
  
}



final class ImageCache: ImageCacheType {

    // 1st level cache, that contains encoded images
    private lazy var imageCache: NSCache<AnyObject, AnyObject> = {
        let cache = NSCache<AnyObject, AnyObject>()
        cache.countLimit = config.countLimit
        return cache
    }()
    // 2nd level cache, that contains decoded images
    private lazy var decodedImageCache: NSCache<AnyObject, AnyObject> = {
        let cache = NSCache<AnyObject, AnyObject>()
        cache.totalCostLimit = config.memoryLimit
        return cache
    }()
    private let lock = NSLock()
    private let config: Config

    public struct Config {
        public let countLimit: Int
        public let memoryLimit: Int

        public static let defaultConfig = Config(countLimit: 100, memoryLimit: 1024 * 1024 * 100) // 100 MB
    }

    public init(config: Config = Config.defaultConfig) {
        self.config = config
    }

    public func image(for url: URL) -> UIImage? {
        lock.lock(); defer { lock.unlock() }
        // the best case scenario -> there is a decoded image in memory
        if let decodedImage = decodedImageCache.object(forKey: url as AnyObject) as? UIImage {
            return decodedImage
        }
        // search for image data
        if let image = imageCache.object(forKey: url as AnyObject) as? UIImage {
            let decodedImage = image.decodedImage()
            decodedImageCache.setObject(image as AnyObject, forKey: url as AnyObject, cost: decodedImage.diskSize)
            return decodedImage
        }
        return nil
    }

    public func insertImage(_ image: UIImage?, for url: URL) {
        guard let image = image else { return removeImage(for: url) }
        let decompressedImage = image.decodedImage()

        lock.lock(); defer { lock.unlock() }
        imageCache.setObject(decompressedImage, forKey: url as AnyObject, cost: 1)
        decodedImageCache.setObject(image as AnyObject, forKey: url as AnyObject, cost: decompressedImage.diskSize)
    }

    public func removeImage(for url: URL) {
        lock.lock(); defer { lock.unlock() }
        imageCache.removeObject(forKey: url as AnyObject)
        decodedImageCache.removeObject(forKey: url as AnyObject)
    }

    public func removeAllImages() {
        lock.lock(); defer { lock.unlock() }
        imageCache.removeAllObjects()
        decodedImageCache.removeAllObjects()
    }

    public subscript(_ key: URL) -> UIImage? {
        get {
            return image(for: key)
        }
        set {
            return insertImage(newValue, for: key)
        }
    }
}



final class ImageLoader {
    public static let shared = ImageLoader()

    private let cache: ImageCacheType
    private lazy var backgroundQueue: OperationQueue = {
        let queue = OperationQueue()
        queue.maxConcurrentOperationCount = 5
        return queue
    }()

    public init(cache: ImageCacheType = ImageCache()) {
        self.cache = cache
    }

  public func loadImage(from url: URL, completion:@escaping(UIImage?)->()) {
        if let image = cache[url] {
            return completion(image)
        }
    
    URLSession.shared.dataTask(with: url) {[weak self] (data, res, err) in
      if let err = err{
        print("Error geting image")
        print(err)
        completion(nil)
      }
      if let data = data{
        print("Image Loading \(url)")
        guard let image = UIImage(data: data) else {return}
        self?.cache[url] = image
        completion(image)
      }
    }.resume()
    }
}
