import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import StaticFieldMap from "../components/StaticFieldMap";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { formatCurrency, formatNumber } from "../utils/format";

function ResultsScreen() {
  const navigate = useNavigate();
  const { crop, estimates, points } = usePlannerStore();

  if (!estimates || estimates.areaSqM <= 0) {
    return (
      <ScreenContainer
        backTo="/crop-planner"
        title="Results"
        subtitle="No layout yet"
      >
        <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4 text-sm text-earth-900">
          Generate layout from Crop Planner to view output.
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backTo="/crop-planner"
      title={`${crop.name} Blueprint`}
      subtitle="UI-first results panel with preview lines"
    >
      <div className="space-y-4">
        <StaticFieldMap showRows previewLines={estimates.previewLines} points={points} />

        <div className="rounded-2xl border border-leaf-100 bg-white/90 p-4">
          <h3 className="font-heading text-base font-bold text-leaf-900">
            Plan Summary
          </h3>
          <p className="text-xs text-leaf-700">
            Orientation selected: {estimates.resolvedOrientation}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatCard
              label="Total Area"
              value={`${formatNumber(estimates.areaSqM, 0)} sqm`}
            />
            <StatCard
              label="Usable Area"
              value={`${formatNumber(estimates.usableAreaSqM, 0)} sqm`}
            />
            <StatCard label="Rows" value={formatNumber(estimates.rowCount, 0)} />
            <StatCard
              label="Total Plants"
              value={formatNumber(estimates.estimatedTotalPlants, 0)}
            />
            <StatCard
              label="Seed"
              value={`${formatNumber(estimates.seedRequiredKg, 1)} kg`}
            />
            <StatCard
              label="Fertilizer"
              value={`${formatNumber(estimates.fertilizerRequiredKg, 1)} kg`}
            />
            <StatCard
              label="Yield"
              value={`${formatNumber(estimates.expectedYieldQuintal, 1)} q`}
            />
            <StatCard
              label="Revenue"
              value={formatCurrency(estimates.estimatedRevenue)}
            />
            <StatCard
              label="Cost"
              value={formatCurrency(estimates.estimatedCost)}
            />
            <StatCard
              label="Profit"
              value={formatCurrency(estimates.estimatedProfit)}
              hint="Revenue - Total Cost"
            />
          </div>
        </div>
      </div>

      <BottomActionBar>
        <div className="grid grid-cols-2 gap-2">
          <AppButton variant="secondary" onClick={() => navigate("/crop-planner")}>
            Try Another Crop
          </AppButton>
          <AppButton variant="ghost" onClick={() => navigate("/draw-field")}>
            Back to Field
          </AppButton>
        </div>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default ResultsScreen;
