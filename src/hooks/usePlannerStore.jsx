import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import cropsData from "../data/crops.json";
import { getAreaSummary } from "../utils/area";
import { generatePlanMetrics } from "../utils/estimates";
import { useAuth } from "./useAuth";
import * as api from "../utils/api";

const PlannerContext = createContext(null);

const INITIAL_SQ_M = 0;

export function PlannerProvider({ children }) {
  const { user } = useAuth();
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

  // Fetch lands from API on user login
  useEffect(() => {
    if (user?._id) {
      api.fetchLands(user._id).then(({ lands }) => {
        setSavedLands(lands);
      }).catch((err) => {
        console.error("Failed to load lands:", err);
      });
    } else {
      setSavedLands([]);
    }
  }, [user]);

  // Compute previous crop based on activeLandId
  const activeLand = savedLands.find(l => (l._id || l.id) === activeLandId);
  const previousCrop = activeLand?.history?.length > 0 
    ? activeLand.history[activeLand.history.length - 1].crop 
    : null;

  const estimates = generatePlanMetrics({
    areaSqM: fieldAreaSqM,
    points,
    crop,
    orientation,
    previousCrop,
  });

  const addSavedLand = useCallback(async (landName, cropName, fieldPoints) => {
    const landData = {
      userId: user?._id,
      name: landName || `New Parcel ${savedLands.length + 1}`,
      points: fieldPoints,
      areaSqM: fieldAreaSqM,
      currentCrop: cropName || "None",
      status: cropName && cropName !== 'None' ? "In Progress" : "Awaiting Crop",
      history: cropName && cropName !== 'None' ? [
        { year: new Date().getFullYear(), crop: cropName, status: "In Progress" }
      ] : [],
    };

    try {
      const { land } = await api.createLand(landData);
      setSavedLands(prev => [land, ...prev]);
    } catch (err) {
      console.error("Failed to save land:", err);
      // Fallback: add locally
      const localLand = {
        ...landData,
        id: `land-${Date.now()}`,
        lastMappedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };
      setSavedLands(prev => [localLand, ...prev]);
    }
  }, [user, savedLands.length, fieldAreaSqM]);

  const appendCropHistory = useCallback(async (landId, year, cropName) => {
    try {
      const { land } = await api.appendHistory(landId, year, cropName);
      setSavedLands(prev => prev.map(l => ((l._id || l.id) === landId ? land : l)));
    } catch (err) {
      console.error("Failed to append history:", err);
      // Fallback local update
      setSavedLands(prev => prev.map(land => {
        if ((land._id || land.id) === landId) {
          return {
            ...land,
            history: [...land.history, { year, crop: cropName, status: "Harvested" }].sort((a, b) => a.year - b.year)
          };
        }
        return land;
      }));
    }
  }, []);

  const resetLandSeason = useCallback(async (landId) => {
    try {
      const { land } = await api.updateLand(landId, { currentCrop: "None", status: "Awaiting Crop" });
      setSavedLands(prev => prev.map(l => ((l._id || l.id) === landId ? land : l)));
    } catch (err) {
      console.error("Failed to reset season:", err);
      setSavedLands(prev => prev.map(land => {
        if ((land._id || land.id) === landId) {
          return { ...land, currentCrop: 'None', status: 'Awaiting Crop' };
        }
        return land;
      }));
    }
  }, []);

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
      activeLandId,
      addSavedLand,
      appendCropHistory,
      resetLandSeason,
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
