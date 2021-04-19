import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { LatestShow } from './models/LatestShow';
import HomeScreen from './screens/HomeScreen';
import ShowDetail from './screens/ShowDetailScreen';
import { Colors } from './util/color';

export type HomeStackParamList = {
  Home: undefined;
  Detail: {show: LatestShow};
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: Colors.primary},
      headerTintColor: Colors.text,
      headerBackImage: () => {
        return <Icon name="arrow-back" size={30} />;
      },
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Detail" component={ShowDetail} />
  </Stack.Navigator>
);
