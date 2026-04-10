import { getAreaSummary } from "./area";
import { createGeospatialPreviewLines, getRowCount } from "./layout";

// --- Cost constants (per-acre, based on average Indian farming rates) ---
const FERTILIZER_PRICE_PER_KG = 25;     // ₹25/kg blended NPK
const LABOR_COST_PER_ACRE = 3000;       // Sowing + weeding + harvest labor
const IRRIGATION_COST_PER_ACRE = 2500;  // Bore-well / canal charges per season
const PESTICIDE_COST_PER_ACRE = 1800;   // 2-3 sprays per season avg.
const EQUIPMENT_COST_PER_ACRE = 2200;   // Tractor / plough / rotavator rental
const TRANSPORT_COST_PER_ACRE = 800;    // Field-to-mandi logistics

export function generatePlanMetrics({ areaSqM, points, crop, orientation, previousCrop }) {
  if (!crop) {
    return null;
  }

  const area = getAreaSummary(areaSqM);
  const usableArea = area.areaSqM * 0.9;
  const rowSpacingM = crop.rowSpacingCm / 100;
  const plantSpacingM = crop.plantSpacingCm / 100;
  const plantsPerSqM = 1 / (rowSpacingM * plantSpacingM);
  const estimatedTotalPlants = usableArea * plantsPerSqM;

  const rowInfo = getRowCount(usableArea, rowSpacingM, orientation);
  const seedRequiredKg = area.areaAcres * crop.seedRateKgPerAcre;
  let fertilizerRequiredKg = area.areaAcres * crop.fertilizerKgPerAcre;
  
  if (previousCrop) {
    if (previousCrop.toLowerCase() === "cotton") {
      fertilizerRequiredKg *= 1.20; // 20% increase
    } else if (previousCrop.toLowerCase() === "groundnut" || previousCrop.toLowerCase() === "legumes") {
      fertilizerRequiredKg *= 0.85; // 15% decrease
    }
  }
  const expectedYieldQuintal = area.areaAcres * crop.yieldQuintalPerAcre;
  const estimatedRevenue = expectedYieldQuintal * crop.marketPricePerQuintal;

  // Individual cost line items
  const seedCost = seedRequiredKg * crop.seedPricePerKg;
  const fertilizerCost = fertilizerRequiredKg * FERTILIZER_PRICE_PER_KG;
  const laborCost = area.areaAcres * LABOR_COST_PER_ACRE;
  const irrigationCost = area.areaAcres * IRRIGATION_COST_PER_ACRE;
  const pesticideCost = area.areaAcres * PESTICIDE_COST_PER_ACRE;
  const equipmentCost = area.areaAcres * EQUIPMENT_COST_PER_ACRE;
  const transportCost = area.areaAcres * TRANSPORT_COST_PER_ACRE;

  const totalCost =
    seedCost +
    fertilizerCost +
    laborCost +
    irrigationCost +
    pesticideCost +
    equipmentCost +
    transportCost;

  const estimatedProfit = estimatedRevenue - totalCost;

  return {
    ...area,
    usableAreaSqM: usableArea,
    rowCount: rowInfo.rowCount,
    resolvedOrientation: rowInfo.orientation,
    estimatedTotalPlants,
    seedRequiredKg,
    fertilizerRequiredKg,
    expectedYieldQuintal,
    estimatedRevenue,
    estimatedCost: totalCost,
    estimatedProfit,
    // Individual cost breakdown
    costBreakdown: {
      seedCost,
      fertilizerCost,
      laborCost,
      irrigationCost,
      pesticideCost,
      equipmentCost,
      transportCost,
    },
    previewLines: createGeospatialPreviewLines(points, crop.rowSpacingCm, rowInfo.orientation),
  };
}
