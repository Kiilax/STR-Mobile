import { computeDestinationPoint, getGreatCircleBearing } from "geolib";
import { useEquipmentsStore } from "../hooks/useEquipmentsStore";
import { EquipmentPlacement } from "../types/equipment";
import { Coordinates } from "../types/coordinates";

export class RectangleCalculator {
  /**
   * Calculates the 4 corners of a vehicle based on its front-left and rear-left coordinates.
   * Assumes placement.coordinates[0] is Front-Left and placement.coordinates[1] is Rear-Left.
   * Retrieves the vehicle width from the equipment store.
   *
   * @param placement The equipment placement containing coordinates and equipmentId
   * @returns An array of 4 coordinates (front-left, front-right, rear-right, rear-left) or null if calculation fails
   */
  static getVehicleRect(placement: EquipmentPlacement): Coordinates[] | null {
    if (!placement.coordinates || placement.coordinates.length < 2) {
      console.warn(
        "SquareCalculator: Insufficient coordinates for placement",
        placement.id
      );
      return null;
    }

    const frontLeft = placement.coordinates[0];
    const rearLeft = placement.coordinates[1];

    const equipment = useEquipmentsStore
      .getState()
      .getEquipmentById(placement.equipmentId);

    if (!equipment) {
      console.warn(
        "SquareCalculator: Equipment not found for id",
        placement.equipmentId
      );
      return null;
    }

    const width = equipment.width;

    if (!width) {
      console.warn(
        "SquareCalculator: Equipment width is missing for id",
        placement.equipmentId
      );
      return null;
    }

    const forwardBearing = getGreatCircleBearing(rearLeft, frontLeft);
    const rightBearing = (forwardBearing + 90) % 360;

    const frontRight = computeDestinationPoint(frontLeft, width, rightBearing);
    const rearRight = computeDestinationPoint(rearLeft, width, rightBearing);

    return [
      frontLeft,
      { latitude: frontRight.latitude, longitude: frontRight.longitude },
      { latitude: rearRight.latitude, longitude: rearRight.longitude },
      rearLeft,
    ];
  }
}
