import React from 'react';
import {NativeEventEmitter, NativeModules} from 'react-native';
const {TanakaDeviceInfo} = NativeModules;

export type DeviceType = 'phone' | 'pad' | 'unkown';

interface DeviceInfoInterface {
  getDeviceType(deviceType: (deviceType: DeviceType) => void): void;
}

export default TanakaDeviceInfo as DeviceInfoInterface;

export const tanakaDeviceInfoEmitter = new NativeEventEmitter(TanakaDeviceInfo);
