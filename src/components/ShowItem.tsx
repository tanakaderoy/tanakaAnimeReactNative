import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Text, Image} from 'react-native-elements';
import {LatestShow} from '../models/LatestShow';
import TanakaImageView from './TanakaImageView';

interface ShowItemProps {
  show: LatestShow;
}

const ShowItem: React.FC<ShowItemProps> = ({show}) => {
  const isIos = Platform.OS == 'ios';
  return (
    <View style={styles.container}>
      {isIos ? (
        <View style={styles.poster}>
          <TanakaImageView
            style={{borderRadius: 4}}
            cornerRadius={4}
            url={show.image}
          />
        </View>
      ) : (
        <Image
          source={{uri: show.image ? show.image : ''}}
          style={styles.poster}
        />
      )}
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
    margin: 8,
  },
});
