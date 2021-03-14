import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Image} from 'react-native-elements/dist/image/Image';
import {LatestShow} from '../models/LatestShow';

interface ShowItemProps {
  show: LatestShow;
}

const ShowItem: React.FC<ShowItemProps> = ({show}) => {
  return (
    <View style={styles.container}>
      <Image source={{uri: show.image}} style={styles.poster} />
      <View style={styles.infoContainer}>
        <Text h3>{show.title} </Text>
        <Text>{show.currentEp}</Text>
      </View>
    </View>
  );
};

export default ShowItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  infoContainer: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
  },
  poster: {
    height: 250,
    width: 150,
    borderRadius: 4,
  },
});
