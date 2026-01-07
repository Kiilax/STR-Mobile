export interface TeamAction {
  id: string;
  teamId: string;
  equipementPlacementId: string;
  action: "DROPOFF" | "REMOVE";
}
