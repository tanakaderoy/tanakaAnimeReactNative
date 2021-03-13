/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import React, {ReactNode} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {HomeStack} from './src/HomeStack';
import SettingsScreen from './src/screens/SettingsScreen';
import {SearchStack} from './src/SearchStack';

const Tab = createBottomTabNavigator<TabParamList>();

type TabParamList = {
  Home: undefined;
  Search: undefined;
  Settings: undefined;
};

const App: () => ReactNode = () => (
  <SafeAreaProvider>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            //Ionicons

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Search':
                iconName = focused ? 'search-circle' : 'search-circle-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              default:
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{activeTintColor: 'tomato', inactiveTintColor: 'gray'}}>
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Search" component={SearchStack} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  </SafeAreaProvider>
);

export default App;
