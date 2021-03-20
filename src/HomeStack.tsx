import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import {LatestShow} from './models/LatestShow';
import ShowDetail from './screens/ShowDetailScreen';
import {SearchResult} from './models/SearchResult';
import {Platform} from 'react-native';
import ShowDetailDesktop from './screens/ShowDetailScreenMacOs';
import {Colors} from './util/color';

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
      headerBackTitle: 'Back',
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen
      name="Detail"
      component={
        Platform.OS == 'macos' || Platform.OS == 'windows'
          ? ShowDetailDesktop
          : ShowDetail
      }
    />
  </Stack.Navigator>
);
