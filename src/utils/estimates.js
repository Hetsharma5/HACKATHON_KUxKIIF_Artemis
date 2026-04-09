import { getAreaSummary } from "./area";
import { createPreviewLines, getRowCount } from "./layout";

const FERTILIZER_PRICE_PER_KG = 25;
const LABOR_COST_PER_ACRE = 3000;

export function generatePlanMetrics({ areaSqM, crop, orientation }) {
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
  const fertilizerRequiredKg = area.areaAcres * crop.fertilizerKgPerAcre;
  const expectedYieldQuintal = area.areaAcres * crop.yieldQuintalPerAcre;
  const estimatedRevenue = expectedYieldQuintal * crop.marketPricePerQuintal;
  const seedCost = seedRequiredKg * crop.seedPricePerKg;
  const totalCost =
    seedCost +
    fertilizerRequiredKg * FERTILIZER_PRICE_PER_KG +
    area.areaAcres * LABOR_COST_PER_ACRE;
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
    previewLines: createPreviewLines(rowInfo.rowCount, rowInfo.orientation),
  };
}
