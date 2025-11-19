import { useState, useEffect, useCallback } from "react"
import { AsyncStore } from "../utils/AsyncStore"
import { Keys } from "@config/index"

interface UseReactiveAsyncStoreResult<T> {
  value: T
  setValue: (value: T | ((prev: T) => T)) => Promise<void>
  loading: boolean
  error: Error | null
  clearError: () => void
  refresh: () => Promise<void>
}
/**
 * useReactiveAsyncStore is a custom React hook for managing a value in AsyncStore
 * with reactive updates, error handling, and loading state.
 *
 * @template T - The type of the value to store.
 * @param key - The storage key (from Keys) to use in AsyncStore.
 * @param defaultValue - The default value to use if nothing is stored.
 * @returns {UseReactiveAsyncStoreResult<T>} An object with:
 *   - value: The current value from storage.
 *   - setValue: Function to update the value in storage.
 *   - removeValue: Function to remove the value from storage.
 *   - loading: Boolean indicating if the value is being loaded.
 *   - error: Any error encountered during storage operations.
 *   - clearError: Function to clear the error state.
 *   - refresh: Function to reload the value from storage.
 */

export function useReactiveAsyncStore<T>(
  key: Keys,
  defaultValue: T
): UseReactiveAsyncStoreResult<T> {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  const loadStoredValue = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const value = await AsyncStore.get<T>(key, defaultValue)
      setStoredValue(value)
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
  }, [loadStoredValue])

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      setError(null)
      try {
        const nextValue = value instanceof Function ? value(storedValue) : value
        setStoredValue(nextValue)
        await AsyncStore.set(key, nextValue)
      } catch (err) {
        const storageError = err instanceof Error ? err : new Error("Unknown error occurred")
        setError(storageError)
        console.error(`Error saving ${key} to storage:`, storageError)
        await loadStoredValue()
      }
    },
    [key, storedValue, loadStoredValue]
  )

  const clearError = useCallback(() => setError(null), [])

  return {
    value: storedValue,
    setValue,
    loading,
    error,
    clearError,
    refresh: loadStoredValue,
  }
}
