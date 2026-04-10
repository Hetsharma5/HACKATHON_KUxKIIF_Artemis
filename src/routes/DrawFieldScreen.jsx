import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import DrawField from "../components/DrawField";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { useTranslation } from "../hooks/useTranslation";
import { getAreaFromPolygonPoints } from "../utils/area";
import { formatNumber } from "../utils/format";

function DrawFieldScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
      title={t("draw_field_title")}
      subtitle={t("draw_field_subtitle")}
    >
      <div className="space-y-4">
        <DrawField points={points} onAddPoint={addPoint} />

        <div className="grid grid-cols-3 gap-3">
          <StatCard label={t("points")} value={pointsCount} hint={t("points_hint")} />
          <StatCard
            label={`${t("area")} (${t("sqm")})`}
            value={formatNumber(areaSummary.areaSqM, 0)}
            hint={t("real_estimate")}
          />
          <StatCard
            label={`${t("area")} (${t("acres")})`}
            value={formatNumber(areaSummary.areaAcres, 2)}
            hint={t("auto_converted")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label={t("hectares")}
            value={formatNumber(areaSummary.areaHectares, 2)}
          />
          <article className="rounded-2xl border border-dashed border-leaf-300 bg-white/80 p-3 text-xs text-leaf-800">
            {t("draw_hint")}
            <br />
            {t("draw_hint2")}
          </article>
        </div>
      </div>

      <BottomActionBar>
        <div className="grid grid-cols-3 gap-2">
          <AppButton variant="secondary" onClick={undoPoint} disabled={pointsCount < 1}>
            {t("undo_point")}
          </AppButton>
          <AppButton variant="danger" onClick={clearPoints} disabled={pointsCount < 1}>
            {t("clear_points")}
          </AppButton>
          <AppButton onClick={completeBoundary} disabled={pointsCount < 3}>
            {t("complete_boundary")}
          </AppButton>
        </div>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default DrawFieldScreen;
