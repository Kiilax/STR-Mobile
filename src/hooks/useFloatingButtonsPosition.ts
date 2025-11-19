import { useSafeAreaInsets } from "react-native-safe-area-context"

export function useFloatingButtonsPosition() {
  const insets = useSafeAreaInsets()

  const buttonBottom = insets.bottom + 70

  return {
    buttonBottom,
  }
}
