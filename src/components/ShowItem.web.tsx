import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, Text } from 'react-native-elements';
import { LatestShow } from '../models/LatestShow';
import { Colors } from '../util/color';

interface ShowItemProps {
  show: LatestShow;
}

const ShowItem: React.FC<ShowItemProps> = ({show}) => {

  return (
    <View style={styles.container}>
      {
        <Image
          source={{uri: show.image ? show.image : ''}}
          style={styles.poster}
        />
      }
      <View style={styles.infoContainer}>
        <Text style={styles.text} h3>
          {show.title}
        </Text>
        <Text style={styles.text}>{show.currentEp}</Text>
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
    backgroundColor: Colors.secondaryDark,
    elevation: 4,
    shadowOffset: {width: 5, height: 5},
    shadowColor: Colors.accent,
    shadowOpacity: 0.4,
  },
  infoContainer: {
    flexDirection: 'column',
    padding: 16,
    flex: 1,
  },
  text: {
    color: Colors.text,
  },
  poster: {
    height: 250,
    width: 150,
    borderRadius: 4,
    margin: 8,
  },
});