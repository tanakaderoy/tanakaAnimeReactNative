import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import iconFont from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/performance';

import App from './App';
import {API_KEY, APP_ID} from './src/util/constants';

const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: Ionicons;
}`;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: 'tanakaanime-f9fc0.firebaseapp.com',
  projectId: 'tanakaanime-f9fc0',
  storageBucket: 'tanakaanime-f9fc0.appspot.com',
  messagingSenderId: '723848843708',
  appId: APP_ID,
  measurementId: 'G-JX79W9E9FL',
};

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);

if (module.hot) {
  module.hot.accept();
}

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const perf = firebase.performance();
