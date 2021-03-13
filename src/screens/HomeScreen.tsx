import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import api from '../api/api';
import ShowItem from '../components/ShowItem';
import {HomeStackParamList} from '../HomeStack';
import {LatestShow} from '../models/LatestShow';

interface HomeScreenProps extends StackScreenProps<HomeStackParamList> {}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [shows, setShows] = useState<LatestShow[]>([]);
  useEffect(() => {
    const unsub = api.getLatestShows().subscribe(shows => {
      setShows(shows);
    });

    return () => {
      unsub.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={shows}
        keyExtractor={it => it.url}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Detail', {show: item});
              }}>
              <ShowItem show={item} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
