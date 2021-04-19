import { StackScreenProps } from '@react-navigation/stack';
import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';
import ShowItem from '../components/ShowItem';
import { HomeStackParamList } from '../HomeStack';
import { LatestShow } from '../models/LatestShow';
import { Colors } from '../util/color';

interface HomeScreenProps extends StackScreenProps<HomeStackParamList> {}

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [shows, setShows] = useState<LatestShow[]>([]);

  useEffect(() => {
    const anlytics = firebase.analytics();
    anlytics.logEvent('page_view', {name: 'HomeScreen'});
    navigation.setOptions({
      headerRight: function HeaderRight() {
        return (
          <Button
            title="Reload"
            onPress={() => {
              setShows([]);
              const unsub = api.getLatestShows().subscribe(
                shows => {
                  setShows(shows);
                  unsub.unsubscribe();
                },
                err => {
                  console.error(err);
                },
              );
            }}
            iconRight
            style={{paddingHorizontal: 24}}
            icon={<Icon name="refresh" />}
          />
        );
      },
    });
  }, []);

  useEffect(() => {
    const unsub = api.getLatestShows().subscribe(
      shows => {
        setShows(shows);
      },
      err => {
        console.error(err);
      },
    );

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
    backgroundColor: Colors.dark,
  },
});
