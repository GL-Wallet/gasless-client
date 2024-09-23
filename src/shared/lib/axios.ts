import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { urlJoin } from '../utils/urlJoin';
import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const { initDataRaw } = retrieveLaunchParams();

export const axiosInstance = axios.create({
  baseURL: urlJoin(API_BASE_URL, 'api'),
  headers: {
    Authorization: `tma ${initDataRaw}`
  }
});
