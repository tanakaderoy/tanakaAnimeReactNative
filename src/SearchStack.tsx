import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {Platform} from 'react-native';
import {LatestShow} from './models/LatestShow';
import {SearchResult} from './models/SearchResult';
import SearchScreen from './screens/SearchScreen';
import ShowDetail from './screens/ShowDetailScreen';
import ShowDetailDesktop from './screens/ShowDetailScreenMacOs';

export type SearchStackParamList = {
  Search: undefined;
  Detail: {show: LatestShow};
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => (
  <Stack.Navigator>
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
