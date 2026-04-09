import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import StaticFieldMap from "../components/StaticFieldMap";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { createDemoAreaFromPoints } from "../utils/area";
import { formatNumber } from "../utils/format";

function DrawFieldScreen() {
  const navigate = useNavigate();
  const {
    pointsCount,
    setPointsCount,
    setFieldAreaSqM,
    areaSummary,
    setIsBoundaryCompleted,
  } = usePlannerStore();

  const addDemoPoint = () => {
    const nextCount = pointsCount + 1;
    setPointsCount(nextCount);
    setFieldAreaSqM(createDemoAreaFromPoints(nextCount));
  };

  const undoPoint = () => {
    const nextCount = Math.max(pointsCount - 1, 0);
    setPointsCount(nextCount);
    setFieldAreaSqM(createDemoAreaFromPoints(nextCount));
    if (nextCount < 3) {
      setIsBoundaryCompleted(false);
    }
  };

  const clearPoints = () => {
    setPointsCount(0);
    setFieldAreaSqM(0);
    setIsBoundaryCompleted(false);
  };

  const completeBoundary = () => {
    if (pointsCount < 3) {
      return;
    }
    setIsBoundaryCompleted(true);
    navigate("/crop-planner");
  };

  return (
    <ScreenContainer
      backTo="/"
      title="Draw Field"
      subtitle="Tap the map to add boundary points. This version uses demo tap simulation."
    >
      <div className="space-y-4">
        <StaticFieldMap onDemoTap={addDemoPoint} />

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Points" value={pointsCount} hint="Need at least 3" />
          <StatCard
            label="Area (sqm)"
            value={formatNumber(areaSummary.areaSqM, 0)}
            hint="Demo estimate"
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
            Tap inside map to add points in this UI version.
            <br />
            Undo and Clear are active for navigation testing.
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
