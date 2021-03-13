import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import SearchScreen from './screens/SearchScreen';

export type SearchStackParamList = {
  Search: undefined;
  Detail: {show: string};
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);
