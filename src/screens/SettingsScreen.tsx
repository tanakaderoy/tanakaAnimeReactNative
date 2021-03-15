import React from 'react';
import {
  Dimensions,
  requireNativeComponent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import {NativeVideoPlayerProps, VideoPlayerView} from '../util/util';

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => (
  <View style={styles.container}>
    <Text>settings</Text>
  </View>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  videoPlayer: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    paddingBottom: -400,
  },
  fullscreenVideoPlayer: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    aspectRatio: 16 / 9,
  },
});
