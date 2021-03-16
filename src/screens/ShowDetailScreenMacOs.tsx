import {StackScreenProps} from '@react-navigation/stack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text} from 'react-native-elements';
import {Image} from 'react-native-elements/dist/image/Image';
import api from '../api/api';
import EpisodeItem from '../components/EpisodeItem';
import {HomeStackParamList} from '../HomeStack';
import Video from 'react-native-video';
import {useOrientation} from '../hooks/useOrientation';
import {VideoPlayingContext} from '../context/VideoPlayingProvider';
import VideoPlayer from '../components/VideoPlayer';

interface ShowDetailDesktopProps
  extends StackScreenProps<HomeStackParamList, 'Detail'> {}

const ShowDetailDesktop: React.FC<ShowDetailDesktopProps> = ({
  route: {params},
  navigation,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchUrl, setWatchUrl] = useState('');
  const [vid, setVid] = useState<string | undefined>(undefined);
  const videoPlayer = useRef<Video>(null);
  const {videoPlaying, setIsPlaying} = useContext(VideoPlayingContext);

  const orientation = useOrientation();
  const vidHeight =
    orientation == 'PORTRAIT'
      ? Dimensions.get('screen').height * 0.35
      : Dimensions.get('screen').height;

  const {show} = params;
  useEffect(() => {
    const sub = api.getEpisodes<Episode[]>(show.title).subscribe(res => {
      setEpisodes(res);

      setWatchUrl(
        show.currentEpURL != '' ? show.currentEpURL : res[res.length - 1].link,
      );
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = api.getVideoUrl<VidRes>(watchUrl).subscribe(res => {
      setVid(res.video);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [watchUrl]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: orientation == 'PORTRAIT',
      title: show.title,
    });
  }, [orientation]);

  function RenderVideo(): React.ReactElement {
    return (
      <>
        {vid && Platform.OS == 'macos' && (
          <VideoPlayer
            url={vid}
            thumbnailUrl={show.image}
            videoName={show.title}
            onPlayerUpdate={e => console.log(e)}
          />
        )}
        {vid && Platform.OS == 'windows' && (
          <Video
            ref={videoPlayer}
            resizeMode="cover"
            posterResizeMode="cover"
            source={{uri: vid}}
            style={styles.video}
            controls
            onVideoEnd={() => {
              setIsPlaying(false);
            }}
            onVideoLoadStart={() => {
              setIsPlaying(true);
            }}
          />
        )}
      </>
    );
  }

  return (
    <View
      style={[styles.container, {margin: orientation == 'PORTRAIT' ? 24 : 0}]}>
      <StatusBar hidden={orientation == 'LANDSCAPE'} />
      <View style={styles.parent}>
        <View>
          <View style={[styles.videoContainer, {height: vidHeight}]}>
            <RenderVideo />
          </View>
          <View style={styles.infoContainer}>
            <Text h3>{show.title}</Text>
            <Image style={styles.poster} source={{uri: show.image}} />
          </View>
        </View>
        <View style={styles.episodeListContainer}>
          <FlatList
            data={episodes}
            keyExtractor={it => it.link + it.title}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.link != watchUrl) {
                      setVid(undefined);
                      setWatchUrl(item.link);
                    }
                  }}>
                  <EpisodeItem data={item} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default ShowDetailDesktop;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  videoContainer: {
    // width: Dimensions.get('screen').width * 0.35,
    aspectRatio: 16 / 9,

    backgroundColor: '#000',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
    height: Platform.OS == ('android' || 'ios') ? 50 : 100,
  },
  poster: {
    width: Platform.OS == ('android' || 'ios') ? 50 : 100,
    height: Platform.OS == ('android' || 'ios') ? 50 : 100,
    borderRadius: Platform.OS == ('android' || 'ios') ? 25 : 50,
  },
  video: {
    // height: 350,
    // width: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  mediaControls: {
    height: '100%',
    flex: 1,
    alignSelf: 'center',
  },
  episodeListContainer: {
    flex: 1,
  },
});

export type Episode = {
  title: string;
  subtitle: string;
  link: string;
};

type VidRes = {
  msg: string;
  video: string;
};
