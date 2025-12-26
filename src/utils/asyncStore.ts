import AsyncStorage from "@react-native-async-storage/async-storage";
import { Keys } from "@config/index";

export class AsyncStore {
  /**
   * Load a value from storage and parse it.
   * @param key Storage key
   * @param defaultValue Value to return if key is not found or an error occurs
   * @returns Parsed value from storage or defaultValue
   */
  static async get<T>(key: Keys, defaultValue: T): Promise<T> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return defaultValue;
    } catch (err) {
      console.error(`AsyncStore.get error for key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Save a value to storage.
   * @param key Storage key
   * @param value Value to be stored
   */
  static async set<T>(key: Keys, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`AsyncStore.set error for key "${key}":`, err);
    }
  }

  /**
   * Update a value using a setter function.
   * @param key Storage key
   * @param defaultValue Value to use if key is not found or an error occurs
   * @param updater Function that takes the previous value and returns the new value
   * @returns The updated value
   */
  static async update<T>(
    key: Keys,
    defaultValue: T,
    updater: (prev: T) => T
  ): Promise<T> {
    try {
      const prev = await AsyncStore.get<T>(key, defaultValue);
      const next = updater(prev);
      await AsyncStore.set<T>(key, next);
      return next;
    } catch (err) {
      console.error(`AsyncStore.update error for key "${key}":`, err);
      return defaultValue;
    }
  }

  /**
   * Remove a key from storage.
   * @param key Storage key to be removed
   * @returns Promise that resolves when the key is removed
   */
  static async remove(key: Keys): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (err) {
      console.error(`AsyncStore.remove error for key "${key}":`, err);
    }
  }

  /**
   * Clear ALL storage (be careful).
   * @returns Promise that resolves when storage is cleared
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (err) {
      console.error("AsyncStore.clear error:", err);
    }
  }
}
