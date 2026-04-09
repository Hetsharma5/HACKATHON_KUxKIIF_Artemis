import { createContext, useContext, useMemo, useState } from "react";
import cropsData from "../data/crops.json";
import { getAreaSummary } from "../utils/area";
import { generatePlanMetrics } from "../utils/estimates";

const PlannerContext = createContext(null);

const INITIAL_SQ_M = 0;

export function PlannerProvider({ children }) {
  const [fieldAreaSqM, setFieldAreaSqM] = useState(INITIAL_SQ_M);
  const [pointsCount, setPointsCount] = useState(0);
  const [points, setPoints] = useState([]);
  const [isBoundaryCompleted, setIsBoundaryCompleted] = useState(false);
  const [selectedCropKey, setSelectedCropKey] = useState("cotton");
  const [orientation, setOrientation] = useState("auto");
  const [isGenerating, setIsGenerating] = useState(false);

  const crop = cropsData[selectedCropKey];
  const areaSummary = getAreaSummary(fieldAreaSqM);
  const estimates = generatePlanMetrics({
    areaSqM: fieldAreaSqM,
    crop,
    orientation,
  });

  const value = useMemo(
    () => ({
      cropsData,
      crop,
      selectedCropKey,
      setSelectedCropKey,
      orientation,
      setOrientation,
      fieldAreaSqM,
      setFieldAreaSqM,
      pointsCount,
      setPointsCount,
      points,
      setPoints,
      isBoundaryCompleted,
      setIsBoundaryCompleted,
      isGenerating,
      setIsGenerating,
      areaSummary,
      estimates,
    }),
    [
      crop,
      selectedCropKey,
      orientation,
      fieldAreaSqM,
      pointsCount,
      points,
      isBoundaryCompleted,
      isGenerating,
      areaSummary,
      estimates,
    ]
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlannerStore() {
  const context = useContext(PlannerContext);

  if (!context) {
    throw new Error("usePlannerStore must be used inside PlannerProvider");
  }

  return context;
}
