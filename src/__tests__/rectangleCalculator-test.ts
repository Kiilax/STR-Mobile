import { useEquipmentsStore } from "@/hooks";
import { Equipment, EquipmentPlacement } from "@/types";
import { RectangleCalculator } from "@/utils/rectangleCalculator";

describe("SquareCalculator", () => {
  const mockEquipments: Equipment[] = [
    {
      id: 1,
      name: "Truck",
      description: "Big Truck",
      length: 10,
      width: 2.5,
      height: 3,
      image: "truck.png",
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01",
    },
  ];

  beforeEach(() => {
    useEquipmentsStore.setState({ equipments: mockEquipments });
  });

  afterEach(() => {
    useEquipmentsStore.setState({ equipments: [] });
  });

  it("should calculate 4 corners for a valid vehicle placement", () => {
    const placement: EquipmentPlacement = {
      id: 100,
      equipmentId: 1,
      interestPointId: 10,
      quantity: 1,
      coordinates: [
        { latitude: 50.0, longitude: 10.0 },
        { latitude: 50.0001, longitude: 10.0 },
      ],
      dropOffDate: "",
      removalDate: "",
      createdAt: "",
      updatedAt: "",
      isVisited: false,
    };

    placement.coordinates = [
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 48.8565, longitude: 2.3522 },
    ];

    const result = RectangleCalculator.getVehicleRect(placement);

    expect(result).not.toBeNull();
    expect(result?.length).toBe(4);

    if (result) {
      const [fl, fr, rr, rl] = result;

      expect(fl).toEqual(placement.coordinates[0]);
      expect(rl).toEqual(placement.coordinates[1]);

      expect(fr.longitude).toBeGreaterThan(fl.longitude);
      expect(fr.latitude).toBeCloseTo(fl.latitude, 4);

      expect(rr.longitude).toBeGreaterThan(rl.longitude);
      expect(rr.latitude).toBeCloseTo(rl.latitude, 4);
    }
  });

  it("should return null if equipment is not found", () => {
    const placement: EquipmentPlacement = {
      id: 101,
      equipmentId: 999,
      interestPointId: 10,
      quantity: 1,
      coordinates: [
        { latitude: 10, longitude: 10 },
        { latitude: 10.0001, longitude: 10 },
      ],
      dropOffDate: "",
      removalDate: "",
      createdAt: "",
      updatedAt: "",
      isVisited: false,
    };

    const result = RectangleCalculator.getVehicleRect(placement);
    expect(result).toBeNull();
  });

  it("should return null if placement has fewer than 2 coordinates", () => {
    const placement: EquipmentPlacement = {
      id: 102,
      equipmentId: 1,
      interestPointId: 10,
      quantity: 1,
      coordinates: [{ latitude: 10, longitude: 10 }],
      dropOffDate: "",
      removalDate: "",
      createdAt: "",
      updatedAt: "",
      isVisited: false,
    };

    const result = RectangleCalculator.getVehicleRect(placement);
    expect(result).toBeNull();
  });
});
