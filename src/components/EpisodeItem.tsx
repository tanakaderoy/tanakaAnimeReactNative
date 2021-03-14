import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import {Episode} from '../screens/ShowDetailScreen';

interface EpisodeItemProps {
  data: Episode;
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({data}) => {
  return (
    <View style={styles.container}>
      <Text h4>{data.title}</Text>
    </View>
  );
};

export default EpisodeItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
  },
  text: {
    color: 'gray',
  },
});
