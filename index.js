/**
 * @format
 */
// import 'react-native-gesture-handler';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
// eslint-disable-next-line no-undef
if (!__DEV__ && Platform.OS !== 'android') {
  global.console = {
    ...console,
    info: () => {},
    log: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
  };
}

AppRegistry.registerComponent(appName, () => App);
