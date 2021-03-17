import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {LatestShow} from './models/LatestShow';
import SearchScreen from './screens/SearchScreen';
import ShowDetail from './screens/ShowDetailScreen.web';

export type SearchStackParamList = {
  Search: undefined;
  Detail: {show: LatestShow};
};

const Stack = createStackNavigator<SearchStackParamList>();

export const SearchStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerBackImage: () => {
        return <Icon name="arrow-back" size={30} />;
      },
    }}>
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="Detail" component={ShowDetail} />
  </Stack.Navigator>
);
