// hooks/useAsyncStorage.ts
import { useState, useEffect, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface UseAsyncStorageResult<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => Promise<void>
  removeValue: () => Promise<void>
  loading: boolean
  error: Error | null
  clearError: () => void
  refresh: () => Promise<void>
}

/**
 * Custom hook to manage AsyncStorage with loading and error states.
 * @param key The key to store the value under.
 * @param defaultValue The default value to use if none is found in storage.
 * @returns An object containing the stored value, setter, remover, loading state, error state, and utility functions.
 */

export function useAsyncStorage<T>(key: string, defaultValue: T): UseAsyncStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const loadStoredValue = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const item = await AsyncStorage.getItem(key)

      if (item !== null) {
        const parsedValue = JSON.parse(item) as T
        setStoredValue(parsedValue)
      } else {
        setStoredValue(defaultValue)
      }
    } catch (err) {
      const storageError = err instanceof Error ? err : new Error("Unknown error occurred")
      setError(storageError)
      console.error(`Error loading ${key} from storage:`, storageError)
    } finally {
      setLoading(false)
    }
  }, [key, defaultValue])

  useEffect(() => {
    loadStoredValue()
  }, [key, loadStoredValue])

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)): Promise<void> => {
      try {
        setError(null)

        const valueToStore = value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (err) {
        const storageError = err instanceof Error ? err : new Error("Unknown error occurred")
        setError(storageError)
        console.error(`Error saving ${key} to storage:`, storageError)
        await loadStoredValue()
      }
    },
    [key, storedValue, loadStoredValue]
  )

  const removeValue = useCallback(async (): Promise<void> => {
    try {
      setError(null)
      setStoredValue(defaultValue)
      await AsyncStorage.removeItem(key)
    } catch (err) {
      const storageError = err instanceof Error ? err : new Error("Unknown error occurred")
      setError(storageError)
      console.error(`Error removing ${key} from storage:`, storageError)
    }
  }, [key, defaultValue])

  const clearError = useCallback((): void => {
    setError(null)
  }, [])

  return {
    value: storedValue,
    setValue,
    removeValue,
    loading,
    error,
    clearError,
    refresh: loadStoredValue,
  }
}
