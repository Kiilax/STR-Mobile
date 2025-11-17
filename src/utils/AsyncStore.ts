import AsyncStorage from "@react-native-async-storage/async-storage"
import { Keys } from "@config/index"

export class AsyncStore {
  /**
   * Load a value from storage and parse it.
   */
  static async get<T>(key: Keys, defaultValue: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item) as T
      }
      return defaultValue
    } catch (err) {
      console.error(`AsyncStore.get error for key "${key}":`, err)
      return defaultValue
    }
  }

  /**
   * Save a value to storage.
   */
  static async set<T>(key: Keys, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`AsyncStore.set error for key "${key}":`, err)
    }
  }

  // static async addToCollection<T>(key: Keys, item: T): Promise<void> {
  //   try {
  //     const collection = await AsyncStore.get<T[]>(key, [])
  //     collection.push(item)
  //     await AsyncStore.set<T[]>(key, collection)
  //   } catch (err) {
  //     console.error(`AsyncStore.addToCollection error for key "${key}":`, err)
  //   }
  // }

  /**
   * Update a value using a setter function.
   */
  static async update<T>(key: Keys, defaultValue: T, updater: (prev: T) => T): Promise<T> {
    try {
      const prev = await AsyncStore.get<T>(key, defaultValue)
      const next = updater(prev)
      await AsyncStore.set<T>(key, next)
      return next
    } catch (err) {
      console.error(`AsyncStore.update error for key "${key}":`, err)
      return defaultValue
    }
  }

  /**
   * Remove a key from storage.
   */
  static async remove(key: Keys): Promise<void> {
    try {
      await AsyncStorage.removeItem(key)
    } catch (err) {
      console.error(`AsyncStore.remove error for key "${key}":`, err)
    }
  }

  /**
   * Clear ALL storage (be careful).
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear()
    } catch (err) {
      console.error("AsyncStore.clear error:", err)
    }
  }
}
