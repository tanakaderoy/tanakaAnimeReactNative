import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Image} from 'react-native-elements/dist/image/Image';
import api from '../api/api';
import EpisodeItem from '../components/EpisodeItem';
import {HomeStackParamList} from '../HomeStack';

interface ShowDetailProps
  extends StackScreenProps<HomeStackParamList, 'Detail'> {}

const ShowDetail: React.FC<ShowDetailProps> = ({route: {params}}) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchUrl, setWatchUrl] = useState('');
  const [vid, setVid] = useState<string | undefined>(undefined);

  const {show} = params;
  useEffect(() => {
    const sub = api.getEpisodes<Episode[]>(show.title).subscribe(res => {
      setEpisodes(res);
      setWatchUrl(res[res.length - 1].link);
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

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer} />
      <View style={styles.infoContainer}>
        <Text style={{alignSelf: 'center'}} h3>
          {show.title}
        </Text>
        <Image style={styles.poster} source={{uri: show.image}} />
      </View>
      <View>
        <FlatList
          data={episodes}
          keyExtractor={it => it.link}
          renderItem={({item}) => <EpisodeItem data={item} />}
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
    height: 300,
    aspectRatio: 16 / 9,
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
