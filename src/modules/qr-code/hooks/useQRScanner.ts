import { useCameraPermissions } from "expo-camera"
import { useEffect } from "react"
import { useReactiveAsyncStore } from "../../../hooks/useReactiveAsyncStore"
import { keys } from "../../../config"

export function useQRScanner() {
  const [permission, requestPermission] = useCameraPermissions()
  const cameraPermissionStorage = useReactiveAsyncStore<boolean>(
    keys.cameraPermissionGranted,
    false
  )

  useEffect(() => {
    const checkAndRequestPermissions = async () => {
      if (permission?.granted) {
        cameraPermissionStorage.setValue(true)
      } else if (permission && !permission.granted) {
        await requestPermission()
      }
    }

    checkAndRequestPermissions()
  }, [cameraPermissionStorage, permission, requestPermission])

  const isGranted = permission?.granted || cameraPermissionStorage.value

  const handleRequestPermission = async () => {
    if (!isGranted) {
      const perm = await requestPermission()
      return perm.granted
    }
    return true
  }

  return {
    permission,
    isGranted,
    loading: cameraPermissionStorage.loading,
    error: cameraPermissionStorage.error,
    handleRequestPermission,
  }
}
