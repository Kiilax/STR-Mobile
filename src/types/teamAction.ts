export interface TeamAction {
  id: string;
  teamId: string;
  equipmentPlacementId: string;
  action: "DROPOFF" | "REMOVE";
}
