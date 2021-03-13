/* eslint-disable @typescript-eslint/ban-types */
import initializeAxios from './axiosSetup';
import {axiosRequestConfiguration} from './config';
import {map} from 'rxjs/operators';
import {defer, Observable} from 'rxjs';
import {LatestShow} from '../models/LatestShow';

const axiosInstance = initializeAxios(axiosRequestConfiguration);

const get = <T>(url: string, queryParams?: object): Observable<T> => {
  return defer(() => axiosInstance.get<T>(url, {params: queryParams})).pipe(
    map(result => result.data),
  );
};

const post = <T>(
  url: string,
  body: object,
  queryParams?: object,
): Observable<T> => {
  return defer(() =>
    axiosInstance.post<T>(url, body, {params: queryParams}),
  ).pipe(map(result => result.data));
};

const getLatestShows = (): Observable<LatestShow[]> => {
  return get<{latestShows: LatestShow[]}>('/shows/home').pipe(
    map(res => res.latestShows),
  );
};

const getEpisodes = <T>(show: string): Observable<T> => {
  return get<T>('/shows', {show});
};

const getVideoUrl = <T>(link: string): Observable<T> => {
  return post<T>('/watch', {episodeURL: link});
};

const changeBaseUrl = (url: string): void => {
  axiosInstance.defaults.baseURL = `http://${url}:8004`;
};

export default {
  get,
  post,
  getLatestShows,
  changeBaseUrl,
  getEpisodes,
  getVideoUrl,
};
