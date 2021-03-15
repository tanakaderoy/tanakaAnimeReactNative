import React from 'react';
import {
  Dimensions,
  HostComponent,
  requireNativeComponent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeVideoPlayerProps, VideoPlayerView} from '../util/util';

interface VideoPlayerProps extends NativeVideoPlayerProps {}
// const VideoPlayerView = requireNativeComponent<NativeVideoPlayerProps>(
//   'VideoPlayerView',
// );

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  videoName,
  thumbnailUrl,
  onPlayerUpdate,
}) => {
  return (
    <VideoPlayerView
      style={styles.video}
      url={url}
      videoName={videoName}
      onPlayerUpdate={onPlayerUpdate}
      thumbnailUrl={thumbnailUrl}
    />
  );
};

export default VideoPlayer;

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});
