import axios, {AxiosRequestConfig, AxiosInstance, AxiosPromise} from 'axios';

const initialization = (config: AxiosRequestConfig): AxiosInstance => {
  const axiosInstance = axios.create(config);
  return axiosInstance;
};

export default initialization;
