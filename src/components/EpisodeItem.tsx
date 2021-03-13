import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Episode} from '../screens/ShowDetailScreen';

interface EpisodeItemProps {
  data: Episode;
}

const EpisodeItem: React.FC<EpisodeItemProps> = ({data}) => {
  return (
    <View>
      <Text> Yo </Text>
    </View>
  );
};

export default EpisodeItem;

const styles = StyleSheet.create({});
