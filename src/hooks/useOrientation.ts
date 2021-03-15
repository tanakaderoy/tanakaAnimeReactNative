import {useEffect, useState} from 'react';
import {Dimensions, Platform} from 'react-native';

export function useOrientation() {
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>(
    'PORTRAIT',
  );
  if (Platform.OS !== 'windows') {
    useEffect(() => {
      Dimensions.addEventListener('change', ({screen: {width, height}}) => {
        if (width < height) {
          setOrientation('PORTRAIT');
        } else {
          setOrientation('LANDSCAPE');
        }
      });
    }, []);
  }

  return orientation;
}
