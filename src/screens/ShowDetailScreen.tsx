import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {HomeStackParamList} from '../HomeStack';

interface ShowDetailProps
  extends StackScreenProps<HomeStackParamList, 'Detail'> {}

const ShowDetail: React.FC<ShowDetailProps> = ({route: {params}}) => {
  const {show} = params;
  return (
    <View>
      <Text> ShowDetail - {show}</Text>
    </View>
  );
};

export default ShowDetail;

const styles = StyleSheet.create({});
