import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import DrawField from "../components/DrawField";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { getAreaFromPolygonPoints } from "../utils/area";
import { formatNumber } from "../utils/format";

function DrawFieldScreen() {
  const navigate = useNavigate();
  const {
    pointsCount,
    setPointsCount,
    setFieldAreaSqM,
    areaSummary,
    setIsBoundaryCompleted,
    points,
    setPoints,
  } = usePlannerStore();

  useEffect(() => {
    const nextCount = points.length;
    setPointsCount(nextCount);
    setFieldAreaSqM(getAreaFromPolygonPoints(points));
    if (nextCount < 3) {
      setIsBoundaryCompleted(false);
    }
  }, [points, setPointsCount, setFieldAreaSqM, setIsBoundaryCompleted]);

  const addPoint = (latlng) => {
    setPoints((prev) => [...prev, latlng]);
  };

  const undoPoint = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  const clearPoints = () => {
    setPoints([]);
  };

  const completeBoundary = () => {
    if (points.length < 3) {
      return;
    }
    setIsBoundaryCompleted(true);
    navigate("/crop-planner");
  };

  return (
    <ScreenContainer
      backTo="/"
      title="Draw Field"
      subtitle="Tap the map to draw real boundary points."
    >
      <div className="space-y-4">
        <DrawField points={points} onAddPoint={addPoint} />

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Points" value={pointsCount} hint="Need at least 3" />
          <StatCard
            label="Area (sqm)"
            value={formatNumber(areaSummary.areaSqM, 0)}
            hint="Real estimate"
          />
          <StatCard
            label="Area (acre)"
            value={formatNumber(areaSummary.areaAcres, 2)}
            hint="Auto converted"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Hectares"
            value={formatNumber(areaSummary.areaHectares, 2)}
          />
          <article className="rounded-2xl border border-dashed border-leaf-300 bg-white/80 p-3 text-xs text-leaf-800">
            Tap on the interactive map to plot actual boundary coordinates.
            <br />
            Calculate precise area automatically!
          </article>
        </div>
      </div>

      <BottomActionBar>
        <div className="grid grid-cols-3 gap-2">
          <AppButton variant="secondary" onClick={undoPoint} disabled={pointsCount < 1}>
            Undo
          </AppButton>
          <AppButton variant="danger" onClick={clearPoints} disabled={pointsCount < 1}>
            Clear
          </AppButton>
          <AppButton onClick={completeBoundary} disabled={pointsCount < 3}>
            Complete Boundary
          </AppButton>
        </div>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default DrawFieldScreen;
