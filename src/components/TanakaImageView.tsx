import React from 'react';
import {Platform, requireNativeComponent, StyleSheet} from 'react-native';
import {TanakaImageViewProps} from '../util/util';

const TanakaImageViewIos = requireNativeComponent<TanakaImageViewProps>(
  'TanakaImageView',
);

interface TanakaImageViewIosProps extends TanakaImageViewProps {}

const TanakaImageView: React.FC<TanakaImageViewIosProps> = ({
  url,
  cornerRadius,
}) => {
  if (Platform.OS != 'ios') {
    return null;
  }
  return (
    <TanakaImageViewIos
      url={url}
      cornerRadius={cornerRadius}
      style={StyleSheet.absoluteFill}
    />
  );
};

export default TanakaImageView;

const styles = StyleSheet.create({});
