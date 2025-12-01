import { create } from "zustand";

interface QRCodeState {
  result: string | null;
  setResult: (data: string) => void;
  clear: () => void;
}

const useQRCodeStore = create<QRCodeState>((set) => ({
  result: null,
  setResult: (data) => set({ result: data }),
  clear: () => set({ result: null }),
}));

export default useQRCodeStore;
