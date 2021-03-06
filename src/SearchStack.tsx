import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {Platform} from 'react-native';
import {LatestShow} from './models/LatestShow';
import {SearchResult} from './models/SearchResult';
import SearchScreen from './screens/SearchScreen';
import ShowDetail from './screens/ShowDetailScreen';
import ShowDetailDesktop from './screens/ShowDetailScreenMacOs';
import {Colors} from './util/color';

export type SearchStackParamList = {
  Search: undefined;
  Detail: {show: LatestShow};
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: Colors.primary},
      headerTintColor: Colors.text,
      headerBackTitle: 'Back',
    }}>
    <Stack.Screen name="Search" component={SearchScreen} />
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
