import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const { initDataRaw } = retrieveLaunchParams()

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    Authorization: `tma ${initDataRaw}`,
  },
})
