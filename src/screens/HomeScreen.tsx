import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import api from '../api/api';
import ShowItem from '../components/ShowItem';
import {LatestShow} from '../models/LatestShow';

interface HomeScreenProps {}

const HomeScreen: React.FC<HomeScreenProps> = () => {
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
          return <ShowItem show={item} />;
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
