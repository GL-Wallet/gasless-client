import type { CloudStorage as TCloudStorage } from '@telegram-apps/sdk-react'
import { initCloudStorage } from '@telegram-apps/sdk-react'

class CloudStorageService {
  cloudStorage: TCloudStorage

  constructor() {
    this.cloudStorage = initCloudStorage()
  }

  async get<P>(key: string): Promise<P | null> {
    try {
      const rawData = await this.cloudStorage.get(key)
      if (!rawData)
        return null

      const data = JSON.parse(rawData)
      return data as P
    }
    catch (error) {
      console.error('Failed to retrieve from CloudStorage:', error)
      return null
    }
  }

  async set<V>(key: string, value: V) {
    try {
      await this.cloudStorage.set(key, JSON.stringify(value))
    }
    catch (error) {
      console.error('Failed to save to CloudStorage:', error)
    }
  }

  async reset() {
    try {
      const keys = await this.cloudStorage.getKeys()
      keys.forEach(k => this.cloudStorage.delete(k))
    }
    catch (error) {
      console.error('Failed to save to CloudStorage:', error)
    }
  }
}

export const cloudStorageService = new CloudStorageService()
