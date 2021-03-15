import React, {createContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface VideoPlayingProviderProps {}

export const VideoPlayingContext = createContext<{
  videoPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}>({videoPlaying: false, setIsPlaying: _ => {}});

const VideoPlayingProvider: React.FC<VideoPlayingProviderProps> = ({
  children,
}) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const setIsPlaying = (isPlaying: boolean) => {
    setVideoPlaying(isPlaying);
  };

  return (
    <VideoPlayingContext.Provider value={{videoPlaying, setIsPlaying}}>
      {children}
    </VideoPlayingContext.Provider>
  );
};

export default VideoPlayingProvider;
