export const keys = {
  interestPoints: "interest-points",
  equipments: "equipments",
  cameraPermissionGranted: "camera-permission-granted",
  eventId: "event-id",
  eventData: "event-data",
} as const;

export type Keys = (typeof keys)[keyof typeof keys];
