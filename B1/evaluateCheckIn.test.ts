import { describe, expect, it } from "vitest";
import { evaluateCheckIn, type Branch } from "./evaluateCheckIn";

const branches: Branch[] = [
  {
    id: "B-01",
    name: "Kemayoran",
    lat: -6.1569,
    lng: 106.8449,
    radiusM: 150,
    active: true,
  },
  {
    id: "B-02",
    name: "Sunter",
    lat: -6.142,
    lng: 106.872,
    radiusM: 200,
    active: true,
  },
  {
    id: "B-03",
    name: "Cakung",
    lat: -6.185,
    lng: 106.945,
    radiusM: 120,
    active: false,
  },
];

describe("evaluateCheckIn", () => {
  it("returns VALID for B-01", () => {
    const result = evaluateCheckIn(
      {
        userId: "U-01",
        lat: -6.157,
        lng: 106.845,
        accuracyM: 12,
        at: new Date().toISOString(),
      },
      branches,
    );

    expect(result.status).toBe("VALID");

    if (result.status === "VALID") {
      expect(result.branchId).toBe("B-01");
    }
  });

  it("ignores inactive branches", () => {
    const result = evaluateCheckIn(
      {
        userId: "U-01",
        lat: -6.1851,
        lng: 106.9451,
        accuracyM: 10,
        at: new Date().toISOString(),
      },
      branches,
    );

    expect(result).toMatchObject({
      status: "OUT_OF_RANGE",
      nearestBranchId: "B-02",
    });
  });

  it("rejects low GPS accuracy", () => {
    const result = evaluateCheckIn(
      {
        userId: "U-01",
        lat: -6.157,
        lng: 106.845,
        accuracyM: 140,
        at: new Date().toISOString(),
      },
      branches,
    );

    expect(result).toEqual({
      status: "REJECTED",
      reason: "LOW_ACCURACY",
    });
  });

  it("rejects coordinates 0,0", () => {
    const result = evaluateCheckIn(
      {
        userId: "U-01",
        lat: 0,
        lng: 0,
        accuracyM: 5,
        at: new Date().toISOString(),
      },
      branches,
    );

    expect(result).toEqual({
      status: "REJECTED",
      reason: "INVALID_COORDINATE",
    });
  });

  it("returns nearest active branch when outside range", () => {
    const result = evaluateCheckIn(
      {
        userId: "U-01",
        lat: -6.3,
        lng: 106.8,
        accuracyM: 15,
        at: new Date().toISOString(),
      },
      branches,
    );

    expect(result.status).toBe("OUT_OF_RANGE");

    if (result.status === "OUT_OF_RANGE") {
      expect(result.nearestBranchId).toBe("B-01");
    }
  });

  it("rejects latitude below -90", () => {
    expect(
      evaluateCheckIn(
        {
          userId: "U-01",
          lat: -91,
          lng: 106,
          accuracyM: 5,
          at: new Date().toISOString(),
        },
        branches,
      ),
    ).toEqual({
      status: "REJECTED",
      reason: "INVALID_COORDINATE",
    });
  });

  it("rejects longitude above 180", () => {
    expect(
      evaluateCheckIn(
        {
          userId: "U-01",
          lat: -6,
          lng: 181,
          accuracyM: 5,
          at: new Date().toISOString(),
        },
        branches,
      ),
    ).toEqual({
      status: "REJECTED",
      reason: "INVALID_COORDINATE",
    });
  });

  it("rejects NaN coordinates", () => {
    expect(
      evaluateCheckIn(
        {
          userId: "U-01",
          lat: NaN,
          lng: 106,
          accuracyM: 5,
          at: new Date().toISOString(),
        },
        branches,
      ),
    ).toEqual({
      status: "REJECTED",
      reason: "INVALID_COORDINATE",
    });
  });

  it("rejects when there are no active branches", () => {
    const inactiveBranches = branches.map((branch) => ({
      ...branch,
      active: false,
    }));

    expect(
      evaluateCheckIn(
        {
          userId: "U-01",
          lat: -6.157,
          lng: 106.845,
          accuracyM: 5,
          at: new Date().toISOString(),
        },
        inactiveBranches,
      ),
    ).toEqual({
      status: "REJECTED",
      reason: "NO_BRANCH_ASSIGNED",
    });
  });

  it("rejects when branch list is empty", () => {
    expect(
      evaluateCheckIn(
        {
          userId: "U-01",
          lat: -6.157,
          lng: 106.845,
          accuracyM: 5,
          at: new Date().toISOString(),
        },
        [],
      ),
    ).toEqual({
      status: "REJECTED",
      reason: "NO_BRANCH_ASSIGNED",
    });
  });
});