/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import { createElement } from "react-native-web";
import {Text} from 'react-native-elements';
import {Image} from 'react-native-elements/dist/image/Image';
import api from '../api/api';
import EpisodeItem from '../components/EpisodeItem';
import {HomeStackParamList} from '../HomeStack';
import {useOrientation} from '../hooks/useOrientation';
import {VideoPlayingContext} from '../context/VideoPlayingProvider';
import firebase from 'firebase/app'

interface ShowDetailProps
  extends StackScreenProps<HomeStackParamList, 'Detail'> {}



// eslint-disable-next-line @typescript-eslint/ban-types
function Video(url: string, style:Object): React.ReactElement{
    const attrs = {
        src: url,
        style,
        controls: 'controls',
        autoPlay: 'autoPlay'
      }
      return createElement('video', attrs)

}

const ShowDetail: React.FC<ShowDetailProps> = ({
  route: {params},
  navigation,
}) => {
    const anlytics = firebase.analytics();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchUrl, setWatchUrl] = useState('');
  const [vid, setVid] = useState<string | undefined>(undefined);
//   const videoPlayer = useRef<Video>(null);
  const {videoPlaying, setIsPlaying} = useContext(VideoPlayingContext);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>()
  const isIos = Platform.OS == 'ios';


  const vidHeight = Dimensions.get('screen').height * 0.35
      

  const {show} = params;
  useEffect(() => {
      anlytics.setCurrentScreen('ShowDetailScreen')
      anlytics.logEvent('watching',{show:show.title})
    const sub = api.getEpisodes<Episode[]>(show.title).subscribe(res => {
      setEpisodes(res);

      setWatchUrl(
        show.currentEpURL != '' ? show.currentEpURL : res[res.length - 1].link,
      );

      setCurrentEpisode( show.currentEpURL != '' ? {title: show.title, subtitle:show.currentEp, link:show.currentEpURL}:res[res.length - 1])
    },(err => {
      console.error(err);
      
    }));

    return () => {
      sub.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const sub = api.getVideoUrl<VidRes>(watchUrl).subscribe(res => {
      setVid(res.video);
    },(err => {
      console.error(err);
      
    }));

    return () => {
      sub.unsubscribe();
    };
  }, [watchUrl]);

  useEffect(() => {
    anlytics.logEvent('video_view', {name: `${show.title}: ${currentEpisode?.subtitle ?? ''}`});

    navigation.setOptions({
      title: `${show.title}: ${currentEpisode?.subtitle ?? ''}`,
    });
  }, [ currentEpisode]);
  function RenderVideo(): React.ReactElement {
    return (
      <>
        {vid && (
          
          
          
         Video(vid, {...styles.videoContainer, height:vidHeight}) 
        )}
      </>
    );
  }

  return (
    <View
      style={[styles.container, {margin: 2}]}>
      <View style={[styles.videoContainer, {height: vidHeight}]}>

        {vid && (
          <RenderVideo/>)} 
          
      </View>
      <View style={styles.infoContainer}>
        <Text h3>{show.title}</Text>
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
                    setCurrentEpisode(item)
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
  },
  videoContainer: {
    width: '100%',
    // aspectRatio: 16 / 9,

    backgroundColor: '#000',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
    height: 100,
  },
  poster: {
    width:  100,
    height:  100,
    borderRadius: 50,
    marginLeft:16
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
