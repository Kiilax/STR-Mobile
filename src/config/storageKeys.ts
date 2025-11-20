export const keys = {
  interestPoints: "interest-points",
  equipments: "equipments",
  cameraPermissionGranted: "camera-permission-granted",
} as const

export type Keys = (typeof keys)[keyof typeof keys]
