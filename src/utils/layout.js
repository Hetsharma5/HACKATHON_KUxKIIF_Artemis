import { distance, polygon as turfPolygon, bbox, lineString, lineSplit, midpoint, booleanPointInPolygon, featureEach } from "@turf/turf";

const ASPECT_RATIO = 1.6;

function getPseudoDimensions(usableArea) {
  const width = Math.sqrt(usableArea * ASPECT_RATIO);
  const height = usableArea / width;

  return { width, height };
}

export function getRowCount(usableArea, rowSpacingM, orientation) {
  if (!usableArea || !rowSpacingM) {
    return 0;
  }

  const { width, height } = getPseudoDimensions(usableArea);
  const horizontalRows = Math.max(1, Math.floor(height / rowSpacingM));
  const verticalRows = Math.max(1, Math.floor(width / rowSpacingM));

  if (orientation === "horizontal") {
    return { rowCount: horizontalRows, orientation: "horizontal" };
  }

  if (orientation === "vertical") {
    return { rowCount: verticalRows, orientation: "vertical" };
  }

  if (verticalRows > horizontalRows) {
    return { rowCount: verticalRows, orientation: "vertical" };
  }

  return { rowCount: horizontalRows, orientation: "horizontal" };
}

export function createGeospatialPreviewLines(points, rowSpacingCm, orientation) {
  if (!points || points.length < 3 || !rowSpacingCm) return [];

  const turfPoints = points.map((p) => [p[1], p[0]]);
  const closedRing = [...turfPoints, turfPoints[0]];
  const poly = turfPolygon([closedRing]);

  const polyBbox = bbox(poly);
  const [minLng, minLat, maxLng, maxLat] = polyBbox;

  const spacingKm = rowSpacingCm / 100000;
  if (spacingKm <= 0) return [];

  const linesToRender = [];
  const MAX_LINES = 400; // Cap at 400 lines to prevent extreme lag.

  const drawLines = (numLines, getLineCoords) => {
    for (let i = 1; i <= numLines; i++) {
        const sweepLine = lineString(getLineCoords(i));
        let foundFragments = false;
        
        try {
          const split = lineSplit(sweepLine, poly);
          if (split && split.features.length > 0) {
            featureEach(split, function(feat) {
               const mid = midpoint(feat.geometry.coordinates[0], feat.geometry.coordinates[feat.geometry.coordinates.length - 1]);
               if (booleanPointInPolygon(mid, poly)) {
                   linesToRender.push(feat.geometry.coordinates.map(c => [c[1], c[0]]));
                   foundFragments = true;
               }
            });
          }
        } catch(e) {}
        
        if (!foundFragments) {
           const mid = midpoint(sweepLine.geometry.coordinates[0], sweepLine.geometry.coordinates[sweepLine.geometry.coordinates.length - 1]);
           if (booleanPointInPolygon(mid, poly)) {
               linesToRender.push(sweepLine.geometry.coordinates.map(c => [c[1], c[0]]));
           }
        }
    }
  };

  if (orientation === "horizontal") {
    const totalHeightKm = distance([minLng, minLat], [minLng, maxLat], { units: "kilometers" });
    const trueNumLines = Math.floor(totalHeightKm / spacingKm);
    const numLines = Math.min(trueNumLines, MAX_LINES);
    
    if (numLines > 0 && trueNumLines > 0) {
      const latStep = (maxLat - minLat) * (spacingKm / totalHeightKm);
      drawLines(numLines, (i) => [[minLng - 0.01, minLat + i * latStep], [maxLng + 0.01, minLat + i * latStep]]);
    }
  } else {
    const totalWidthKm = distance([minLng, minLat], [maxLng, minLat], { units: "kilometers" });
    const trueNumLines = Math.floor(totalWidthKm / spacingKm);
    const numLines = Math.min(trueNumLines, MAX_LINES);
    
    if (numLines > 0 && trueNumLines > 0) {
      const lngStep = (maxLng - minLng) * (spacingKm / totalWidthKm);
      drawLines(numLines, (i) => [[minLng + i * lngStep, minLat - 0.01], [minLng + i * lngStep, maxLat + 0.01]]);
    }
  }

  console.log(`Generated ${linesToRender.length} lines for orientation ${orientation} with spacing ${spacingKm}km`);
  return linesToRender;
}
