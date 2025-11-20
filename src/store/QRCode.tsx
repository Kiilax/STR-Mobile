import { create } from "zustand"

type QRStore = {
  qrData: string | null
  setQRData: (data: string) => void
}

export const useQRStore = create<QRStore>((set) => ({
  qrData: null,
  setQRData: (data) => set({ qrData: data }),
}))
