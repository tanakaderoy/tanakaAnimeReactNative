import {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import DeviceInfo, {DeviceType} from '../util/DeviceInfo';

export default function(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>('unkown');

  useEffect(() => {
    if (Platform.OS == 'ios') {
      DeviceInfo.getDeviceType(device => {
        setDeviceType(device);
      });
    }
  }, [deviceType]);
  return deviceType;
}
