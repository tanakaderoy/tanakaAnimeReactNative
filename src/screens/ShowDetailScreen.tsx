import {StackScreenProps} from '@react-navigation/stack';
import {BottomTabNavigationOptions, BottomTabNavigationProp} from '@react-navigation/bottom-tabs'
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
import TanakaImageView from '../components/TanakaImageView';
import { Colors } from '../util/color';
import useDeviceType from '../hooks/useDeviceType';
import useIosOrientation from '../hooks/useIosOrientation';
import { TabParamList } from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const {videoPlaying, setIsPlaying} = useContext(VideoPlayingContext);
  const [currentEpisode, setCurrentEpisode] = useState<Episode>()
  const isIos = Platform.OS == 'ios';


  const orientation = useOrientation();
  const vidHeight = Dimensions.get('screen').height * 0.35
     

  const {show} = params;
  useEffect(() => {
    let isMounted = true
    const sub = api.getEpisodes<Episode[]>(show.title).subscribe(res => {
      
      if(isMounted){
      setEpisodes(res);

      setWatchUrl(
        show.currentEpURL != '' ? show.currentEpURL : res[res.length - 1].link,
      );

      setCurrentEpisode( show.currentEpURL != '' ? {title: show.title, subtitle:show.currentEp, link:show.currentEpURL}:res[res.length - 1])
      }

    },(err => {
      console.error(err);
      
    }));

    return () => {
      sub.unsubscribe();
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const sub = api.getVideoUrl<VidRes>(watchUrl).subscribe(res => {
      if(isMounted){
      setVid(res.video);
      }
    },(err => {
      console.error(err);
      
    }));

    return () => {
      sub.unsubscribe();
      isMounted = false
    };
  }, [watchUrl]);

  const o = useIosOrientation()
  const devType = useDeviceType()
  useEffect(() => {
    const parent = navigation.dangerouslyGetParent() 
    parent?.setOptions({
      tabBarVisible: orientation == 'PORTRAIT'
    })
    navigation.setOptions({
      headerShown: (orientation == 'PORTRAIT') || devType == 'pad',
      title: `${show.title}: ${currentEpisode?.subtitle ?? ''}`,
    });
  }, [orientation,o, currentEpisode]);

  useEffect(()=>{
    let isMounted = true
    if(isMounted){
    setIsPlaying(true)
    
    navigation.addListener('blur',()=>{
      setIsPlaying(false)
    })
  }
  

    return () => {
      isMounted = false;
    }
  },[setIsPlaying])




  function RenderVideo(): React.ReactElement {
    return (
      <>
        {vid && (
          <VideoPlayer
            style={styles.video}
            url={vid}
            thumbnailUrl={show.image}
            videoName={show.title}
            onPlayerUpdate={e => console.log(e)}
          />
        )}
      </>
    );
  }  


  if(devType == 'pad'){

  return (
    <View
      style={[styles.container, {padding: orientation == 'PORTRAIT' ? 2 : 0}]}>
      <StatusBar hidden={(orientation == 'LANDSCAPE') || (devType == 'pad' && o == 'landscape')} />
      <View style={[(styles.parent),{flexDirection: o=='landscape' ? 'row' : 'column'}]}>
      <View>
      <View style={[styles.videoContainer, {height: vidHeight}]}>
        {vid && (
          <Video
            ref={videoPlayer}
            resizeMode="cover"
            posterResizeMode="cover"
            source={{uri: vid}}
            style={styles.video}
            controls
          />
        )}
        {/* {vid && Platform.OS == 'ios' && <RenderVideo />} */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.text} h3>{show.title}</Text>
        {isIos ? (
        <View style={[styles.poster, {backgroundColor:'black'}]}>
          <TanakaImageView
            style={styles.poster}
            cornerRadius={Platform.OS == 'android' || Platform.OS =='ios' ? (25) : 50}
            url={show.image}
          />
        </View>
      ):<Image style={styles.poster} source={{uri: show.image}} />}
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
    </View>
  );
        }
        const screen = Dimensions.get('screen')
const phoneVidHeight = orientation == 'LANDSCAPE' ? screen.height: screen.height * 0.35
        return (<SafeAreaView
        style={[styles.container, {padding: orientation == 'PORTRAIT' ? 2 : 0}]}>
        <StatusBar hidden={orientation == 'LANDSCAPE'} />
        <View style={[styles.videoContainer, {height: phoneVidHeight}]}>
          {vid && (
            <Video
              ref={videoPlayer}
              resizeMode="cover"
              posterResizeMode="cover"
              source={{uri: vid}}
              style={styles.video}
              controls
            />
          )}
          {/* {vid && Platform.OS == 'ios' && <RenderVideo />} */}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.text} h3>{show.title}</Text>
          {isIos ? (
          <View style={[styles.poster, {backgroundColor:'black'}]}>
            <TanakaImageView
              style={styles.poster}
              cornerRadius={Platform.OS == 'android' || Platform.OS =='ios' ? (25) : 50}
              url={show.image}
            />
          </View>
        ):<Image style={styles.poster} source={{uri: show.image}} />}
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
      </SafeAreaView>
    );
};

export default ShowDetail;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark
  },
  text:{color:Colors.text},
  videoContainer: {
    width: '100%',
    // aspectRatio: 16 / 9,

    backgroundColor: '#000',
  },
  parent: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: Colors.dark,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8,
    height: Platform.OS == 'android' || Platform.OS =='ios' ? 50 : 100,
  },
  poster: {
    width: Platform.OS == 'android' || Platform.OS =='ios' ? 50 : 100,
    height: Platform.OS == 'android' || Platform.OS =='ios' ? 50 : 100,
    borderRadius: Platform.OS == 'android' || Platform.OS =='ios' ? (25) : 50,
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
