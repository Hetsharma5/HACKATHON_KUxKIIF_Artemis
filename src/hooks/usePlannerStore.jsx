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
  const [activeLandId, setActiveLandId] = useState(null);

  const crop = cropsData[selectedCropKey];
  const areaSummary = getAreaSummary(fieldAreaSqM);
  
  const [savedLands, setSavedLands] = useState([]);

  // Compute previous crop based on activeLandId
  const activeLand = savedLands.find(l => l.id === activeLandId);
  const previousCrop = activeLand?.history?.length > 0 
    ? activeLand.history[activeLand.history.length - 1].crop 
    : null;

  const estimates = generatePlanMetrics({
    areaSqM: fieldAreaSqM,
    crop,
    orientation,
    previousCrop,
  });

  const addSavedLand = (landName, cropName, points) => {
    const newLand = {
      id: `land-${Date.now()}`,
      name: landName || `New Parcel ${savedLands.length + 1}`,
      lastMappedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      currentCrop: cropName,
      status: cropName && cropName !== 'None' ? "In Progress" : "Awaiting Crop",
      history: cropName && cropName !== 'None' ? [
        { year: new Date().getFullYear(), crop: cropName, status: "In Progress" }
      ] : [],
      points,
      areaSqM: fieldAreaSqM
    };
    setSavedLands([newLand, ...savedLands]);
  };

  const appendCropHistory = (landId, year, cropName) => {
    setSavedLands(prev => prev.map(land => {
      if (land.id === landId) {
        return {
          ...land,
          history: [...land.history, { year, crop: cropName, status: "Harvested" }].sort((a, b) => a.year - b.year)
        };
      }
      return land;
    }));
  };

  const resetLandSeason = (landId) => {
    setSavedLands(prev => prev.map(land => {
      if (land.id === landId) {
        return {
          ...land,
          currentCrop: 'None',
          status: 'Awaiting Crop'
        };
      }
      return land;
    }));
  };

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
      savedLands,
      activeLandId,
      setActiveLandId,
      addSavedLand,
      appendCropHistory,
      resetLandSeason,
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
      savedLands,
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
