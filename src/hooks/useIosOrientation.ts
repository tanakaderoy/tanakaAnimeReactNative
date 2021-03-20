import {useEffect, useState} from 'react';
import {Dimensions, Platform} from 'react-native';
import {tanakaDeviceInfoEmitter} from '../util/DeviceInfo';

export default function() {
  const {width, height} = Dimensions.get('screen');
  let initial: orientation;
  if (width < height) {
    initial = 'portrait';
  } else {
    initial = 'landscape';
  }

  const [orientation, setOrientation] = useState<orientation>(initial);
  if (Platform.OS == 'ios') {
    useEffect(() => {
      const sub = tanakaDeviceInfoEmitter.addListener(
        'currentOrientation',
        event => {
          const ev = event as OrientationEvent;
          setOrientation(ev.orientation);
        },
      );

      return () => {
        sub.remove();
      };
    }, []);
  }
  return orientation;
}

interface OrientationEvent {
  orientation: orientation;
}

type orientation = 'landscape' | 'portrait';
