import axios from 'axios';

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { urlJoin } from '../utils/urlJoin';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { initDataRaw } = retrieveLaunchParams();

export const axiosInstance = axios.create({
  baseURL: urlJoin(API_BASE_URL, 'api'),
  headers: {
    Authorization: `tma ${initDataRaw}`
  }
});
