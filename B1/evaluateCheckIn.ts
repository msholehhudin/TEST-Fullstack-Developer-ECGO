export type Branch = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusM: number;
  active: boolean;
};

export type CheckIn = {
  userId: string;
  lat: number;
  lng: number;
  accuracyM: number;
  at: string;
};

export type RejectReason =
  | "NO_BRANCH_ASSIGNED"
  | "LOW_ACCURACY"
  | "INVALID_COORDINATE";

export type Result =
  | {
      status: "VALID";
      branchId: string;
      branchName: string;
      distanceM: number;
    }
  | {
      status: "OUT_OF_RANGE";
      nearestBranchId: string | null;
      distanceM: number | null;
    }
  | {
      status: "REJECTED";
      reason: RejectReason;
    };

const EARTH_RADIUS_M = 6371008.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function haversineDistanceM(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(EARTH_RADIUS_M * c);
}

export function evaluateCheckIn(
  checkIn: CheckIn,
  branches: Branch[],
): Result {
  // 1. Validate coordinates first
  const invalidCoordinate =
    !Number.isFinite(checkIn.lat) ||
    !Number.isFinite(checkIn.lng) ||
    checkIn.lat < -90 ||
    checkIn.lat > 90 ||
    checkIn.lng < -180 ||
    checkIn.lng > 180 ||
    (checkIn.lat === 0 && checkIn.lng === 0);

  if (invalidCoordinate) {
    return {
      status: "REJECTED",
      reason: "INVALID_COORDINATE",
    };
  }

  // 2. Validate GPS accuracy
  if (!Number.isFinite(checkIn.accuracyM) || checkIn.accuracyM > 100) {
    return {
      status: "REJECTED",
      reason: "LOW_ACCURACY",
    };
  }

  // 3. Only active branches are relevant
  const activeBranches = branches.filter((branch) => branch.active);

  if (activeBranches.length === 0) {
    return {
      status: "REJECTED",
      reason: "NO_BRANCH_ASSIGNED",
    };
  }

  const tolerance = Math.min(checkIn.accuracyM, 30);

  let nearestBranch: {
    branch: Branch;
    distanceM: number;
  } | null = null;

  let matchedBranch: {
    branch: Branch;
    distanceM: number;
  } | null = null;

  for (const branch of activeBranches) {
    const distanceM = haversineDistanceM(
      checkIn.lat,
      checkIn.lng,
      branch.lat,
      branch.lng,
    );

    // Track nearest active branch
    if (
      nearestBranch === null ||
      distanceM < nearestBranch.distanceM ||
      (distanceM === nearestBranch.distanceM &&
        branch.id.localeCompare(nearestBranch.branch.id) < 0)
    ) {
      nearestBranch = {
        branch,
        distanceM,
      };
    }

    // Check whether branch matches geofence
    if (distanceM <= branch.radiusM + tolerance) {
      if (
        matchedBranch === null ||
        distanceM < matchedBranch.distanceM ||
        (distanceM === matchedBranch.distanceM &&
          branch.id.localeCompare(matchedBranch.branch.id) < 0)
      ) {
        matchedBranch = {
          branch,
          distanceM,
        };
      }
    }
  }

  if (matchedBranch !== null) {
    return {
      status: "VALID",
      branchId: matchedBranch.branch.id,
      branchName: matchedBranch.branch.name,
      distanceM: matchedBranch.distanceM,
    };
  }

  return {
    status: "OUT_OF_RANGE",
    nearestBranchId: nearestBranch?.branch.id ?? null,
    distanceM: nearestBranch?.distanceM ?? null,
  };
}