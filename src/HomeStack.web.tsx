import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import {LatestShow} from './models/LatestShow';
import ShowDetail from './screens/ShowDetailScreen';

import Icon from 'react-native-vector-icons/Ionicons';

export type HomeStackParamList = {
  Home: undefined;
  Detail: {show: LatestShow};
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackImage: () => {
        return <Icon name="arrow-back" size={30} />;
      },
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Detail" component={ShowDetail} />
  </Stack.Navigator>
);
