import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Input, Text } from 'react-native-elements';
import api from '../api/api';
import { Colors } from '../util/color';
import { BASE_URL } from '../util/constants';

interface SettingsScreenProps {}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const [newUrl, setNewUrl] = useState('');
  const urls: URLType[] = [
    {isLocal: true, val: '10.147.1.153'},
    {isLocal: false, val: BASE_URL},
  ];
  const setUrl = (item: URLType) => {
    if (item.isLocal) {
      const url = `http://${item.val}:8004`;
      console.log(url);

      api.changeBaseUrl(url);
    } else {
      api.changeBaseUrl(item.val);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text} h3>
        Enter new Base URL
      </Text>
      <Input
        value={newUrl}
        style={{color: Colors.text}}
        placeholderTextColor={Colors.light}
        placeholder="Enter new URL"
        onChangeText={setNewUrl}
        onSubmitEditing={() => {
          api.changeBaseUrl(newUrl);
        }}
        onEndEditing={() => {
          api.changeBaseUrl(newUrl);
        }}
      />
      <FlatList
        data={urls}
        keyExtractor={it => it.val}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={{backgroundColor: Colors.secondaryDark, height: 40}}
              onPress={() => {
                setUrl(item);
              }}>
              <Text style={{color: Colors.text, fontSize: 30}}>{item.val}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};
export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  text: {
    color: Colors.text,
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

type URLType = {
  isLocal: boolean;
  val: string;
};