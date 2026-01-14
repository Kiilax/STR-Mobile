import { useState, useCallback } from "react";
import { AlertType } from "@/components/error-modal";

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "primary" | "secondary" | "danger";
}

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  buttons?: AlertButton[];
}

const initialState: AlertState = {
  visible: false,
  title: "",
  message: "",
  type: "error",
  buttons: undefined,
};

export function useAlertModal() {
  const [alertState, setAlertState] = useState<AlertState>(initialState);

  const showAlert = useCallback(
    (
      title: string,
      message: string,
      type: AlertType = "error",
      buttons?: AlertButton[]
    ) => {
      setAlertState({
        visible: true,
        title,
        message,
        type,
        buttons,
      });
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState(initialState);
  }, []);

  // Helper methods for common alert types
  const showError = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      showAlert(title, message, "error", buttons);
    },
    [showAlert]
  );

  const showSuccess = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      showAlert(title, message, "success", buttons);
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      showAlert(title, message, "warning", buttons);
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (title: string, message: string, buttons?: AlertButton[]) => {
      showAlert(title, message, "info", buttons);
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
}
