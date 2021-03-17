import React, {useState} from 'react';
import {
  Dimensions,
  requireNativeComponent,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {Text, Input} from 'react-native-elements';
import api from '../api/api';
import VideoPlayer from '../components/VideoPlayer';
import {NativeVideoPlayerProps, VideoPlayerView} from '../util/util';

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [newUrl, setNewUrl] = useState('');
  return (
    <SafeAreaView style={styles.container}>
      <Text h3>Enter new Base URL</Text>
      <Input
        value={newUrl}
        placeholder="Enter new URL"
        onChangeText={setNewUrl}
        onSubmitEditing={() => {
          api.changeBaseUrl(newUrl);
        }}
        onEndEditing={() => {
          api.changeBaseUrl(newUrl);
        }}
      />
    </SafeAreaView>
  );
};

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
