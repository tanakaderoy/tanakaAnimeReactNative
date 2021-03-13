import React, {createContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface BaseUrlProviderProps {}

export const BaseUrlContext = createContext<{
  baseUrl: string;
  changeUrl: (url: string) => void;
}>({baseUrl: '', changeUrl: _ => {}});

const BaseUrlProvider: React.FC<BaseUrlProviderProps> = ({children}) => {
  const [baseUrl, setBaseUrl] = useState('http://10.147.1.153:8004');

  const changeUrl = (url: string) => {
    setBaseUrl(`http://${url}:8004`);
  };

  return (
    <BaseUrlContext.Provider value={{baseUrl, changeUrl}}>
      {children}
    </BaseUrlContext.Provider>
  );
};

export default BaseUrlProvider;

const styles = StyleSheet.create({});
