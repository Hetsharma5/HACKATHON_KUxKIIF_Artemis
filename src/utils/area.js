import { area as turfArea, polygon as turfPolygon } from "@turf/turf";

export const SQM_PER_ACRE = 4046.86;
export const SQM_PER_HECTARE = 10000;

export function sqMetersToAcres(squareMeters) {
  return squareMeters / SQM_PER_ACRE;
}

export function sqMetersToHectares(squareMeters) {
  return squareMeters / SQM_PER_HECTARE;
}

export function getAreaSummary(squareMeters) {
  const areaSqM = Number(squareMeters) || 0;
  const areaAcres = sqMetersToAcres(areaSqM);
  const areaHectares = sqMetersToHectares(areaSqM);

  return {
    areaSqM,
    areaAcres,
    areaHectares,
  };
}

export function getAreaFromPolygonPoints(points) {
  if (!Array.isArray(points) || points.length < 3) {
    return 0;
  }

  // Leaflet uses [lat, lng], but Turf requires [lng, lat] for GeoJSON
  const turfPoints = points.map(p => [p[1], p[0]]);
  const closedRing = [...turfPoints, turfPoints[0]];
  const turfPoly = turfPolygon([closedRing]);
  return turfArea(turfPoly);
}

export function createDemoAreaFromPoints(pointsCount) {
  if (pointsCount < 3) {
    return 0;
  }

  const seedArea = 1800;
  const growthPerPoint = 420;
  return seedArea + (pointsCount - 3) * growthPerPoint;
}
