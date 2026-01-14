export const keys = {
  interestPoints: "interest-points",
  equipments: "equipments",
  cameraPermissionGranted: "camera-permission-granted",
  eventId: "event-id",
  eventData: "event-data",
  equipmentPlacements: "equipment-placements",
  teamActions: "team-actions",
  url: "url",
  currentTeamId: "current-team-id",
} as const;

export type Keys = (typeof keys)[keyof typeof keys];
