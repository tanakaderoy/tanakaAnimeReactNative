import {AxiosRequestConfig} from 'axios';
import {BASE_URL} from '../util/constants';

export const axiosRequestConfiguration: AxiosRequestConfig = {
  baseURL: BASE_URL,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
};
