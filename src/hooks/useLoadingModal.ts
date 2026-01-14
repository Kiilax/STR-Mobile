import { useState, useCallback } from "react";

interface LoadingState {
  visible: boolean;
  title: string;
  message: string;
}

const initialState: LoadingState = {
  visible: false,
  title: "",
  message: "",
};

export const useLoadingModal = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(initialState);

  const showLoading = useCallback((title: string, message: string = "") => {
    setLoadingState({
      visible: true,
      title,
      message,
    });
  }, []);

  const hideLoading = useCallback(() => {
    setLoadingState(initialState);
  }, []);

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      title: string,
      message: string = ""
    ): Promise<T> => {
      showLoading(title, message);
      try {
        return await asyncFn();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading]
  );

  return {
    loadingState,
    showLoading,
    hideLoading,
    withLoading,
    isLoading: loadingState.visible,
  };
};
