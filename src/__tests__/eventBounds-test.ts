import { calculateEventBounds } from "../utils/eventBounds";
import { Event } from "@/types";

describe("calculateEventBounds", () => {
  it("should return null when event is null", () => {
    const result = calculateEventBounds(null);
    expect(result).toBeNull();
  });

  it("should return null when event has no coordinates", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [],
      courses: [],
      interestPoints: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);
    expect(result).toBeNull();
  });

  it("should calculate bounds from zones only", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [
        {
          name: "Zone 1",
          description: "Test Zone",
          coordinates: [
            { latitude: 10, longitude: 20 },
            { latitude: 12, longitude: 22 },
          ],
        },
      ],
      courses: [],
      interestPoints: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).toEqual({
      latitude: 11,
      longitude: 21,
      latitudeDelta: (12 - 10) * 1.2,
      longitudeDelta: (22 - 20) * 1.2,
    });
  });

  it("should calculate bounds from courses only", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [],
      courses: [
        {
          id: 1,
          eventId: 1,
          name: "Course 1",
          color: "#FF0000",
          route: [
            { latitude: 5, longitude: 15 },
            { latitude: 7, longitude: 17 },
          ],
        },
      ],
      interestPoints: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).toEqual({
      latitude: 6,
      longitude: 16,
      latitudeDelta: (7 - 5) * 1.2,
      longitudeDelta: (17 - 15) * 1.2,
    });
  });

  it("should calculate bounds from interest points only", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [],
      courses: [],
      interestPoints: [
        {
          id: 1,
          eventId: 1,
          coordinates: { latitude: 8, longitude: 18 },
          images: [],
          isVisited: false,
          synced: false,
          updated: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
        {
          id: 2,
          eventId: 1,
          coordinates: { latitude: 10, longitude: 20 },
          images: [],
          isVisited: false,
          synced: false,
          updated: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
      ],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).toEqual({
      latitude: 9,
      longitude: 19,
      latitudeDelta: (10 - 8) * 1.2,
      longitudeDelta: (20 - 18) * 1.2,
    });
  });

  it("should calculate bounds from all coordinate sources combined", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [
        {
          name: "Zone 1",
          description: "Test Zone",
          coordinates: [{ latitude: 10, longitude: 20 }],
        },
      ],
      courses: [
        {
          id: 1,
          eventId: 1,
          name: "Course 1",
          color: "#FF0000",
          route: [{ latitude: 5, longitude: 15 }],
        },
      ],
      interestPoints: [
        {
          id: 1,
          eventId: 1,
          coordinates: { latitude: 15, longitude: 25 },
          images: [],
          isVisited: false,
          synced: false,
          updated: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
      ],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).toEqual({
      latitude: 10,
      longitude: 20,
      latitudeDelta: (15 - 5) * 1.2,
      longitudeDelta: (25 - 15) * 1.2,
    });
  });

  it("should apply minimum delta of 0.01 when calculated delta is smaller", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [
        {
          name: "Zone 1",
          description: "Test Zone",
          coordinates: [
            { latitude: 10, longitude: 20 },
            { latitude: 10.001, longitude: 20.001 },
          ],
        },
      ],
      courses: [],
      interestPoints: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).not.toBeNull();
    expect(result?.latitudeDelta).toBe(0.01);
    expect(result?.longitudeDelta).toBe(0.01);
  });

  it("should handle event with empty zones array", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [
        {
          name: "Zone 1",
          description: "Test Zone",
          coordinates: [],
        },
      ],
      courses: [
        {
          id: 1,
          eventId: 1,
          name: "Course 1",
          color: "#FF0000",
          route: [{ latitude: 5, longitude: 15 }],
        },
      ],
      interestPoints: [],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).not.toBeNull();
    expect(result?.latitude).toBe(5);
    expect(result?.longitude).toBe(15);
    expect(result?.latitudeDelta).toBe(0.01);
    expect(result?.longitudeDelta).toBe(0.01);
  });

  it("should handle single coordinate point", () => {
    const event: Event = {
      id: 1,
      startDate: "2026-01-01",
      endDate: "2026-01-02",
      title: "Test Event",
      description: "Test Description",
      zones: [],
      courses: [],
      interestPoints: [
        {
          id: 1,
          eventId: 1,
          coordinates: { latitude: 10, longitude: 20 },
          images: [],
          isVisited: false,
          synced: false,
          updated: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        },
      ],
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    };

    const result = calculateEventBounds(event);

    expect(result).toEqual({
      latitude: 10,
      longitude: 20,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  });
});
