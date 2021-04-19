import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { Episode } from '../screens/ShowDetailScreen';
import { Colors } from '../util/color';

interface EpisodeItemProps {
  data: Episode;
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({data}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text} h4>
        {data.title}
      </Text>
    </View>
  );
};

export default EpisodeItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: Colors.secondaryDark,
  },
  text: {
    color: Colors.text,
  },
});
