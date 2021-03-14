import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
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
import {SearchStackParamList} from '../SearchStack';

interface ShowDetailProps
  extends StackScreenProps<HomeStackParamList, 'Detail'> {}

const ShowDetail: React.FC<ShowDetailProps> = ({
  route: {params},
  navigation,
}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchUrl, setWatchUrl] = useState('');
  const [vid, setVid] = useState<string | undefined>(undefined);
  const videoPlayer = useRef<Video>(null);
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

  return (
    <View style={styles.container}>
      <View style={[styles.videoContainer, {height: vidHeight}]}>
        {vid && (
          <Video
            ref={videoPlayer}
            resizeMode="cover"
            posterResizeMode="cover"
            source={{uri: vid}}
            style={styles.video}
            controls
            fullscreen={orientation == 'LANDSCAPE'}
          />
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={{alignSelf: 'center'}} h3>
          {show.title}
        </Text>
        <Image style={styles.poster} source={{uri: show.image}} />
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
  );
};

export default ShowDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
  },
  videoContainer: {
    width: '100%',
    // aspectRatio: 21 / 9,

    backgroundColor: '#000',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 100,
    backgroundColor: 'gray',
  },
  poster: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
