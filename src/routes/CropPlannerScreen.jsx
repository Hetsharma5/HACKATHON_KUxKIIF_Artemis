import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import CropCard from "../components/CropCard";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { formatNumber } from "../utils/format";

const ORIENTATIONS = [
  { value: "horizontal", label: "Horizontal" },
  { value: "vertical", label: "Vertical" },
  { value: "auto", label: "Auto" },
];

function CropPlannerScreen() {
  const navigate = useNavigate();
  const {
    cropsData,
    selectedCropKey,
    setSelectedCropKey,
    orientation,
    setOrientation,
    areaSummary,
    isBoundaryCompleted,
    isGenerating,
    setIsGenerating,
  } = usePlannerStore();

  const cropEntries = useMemo(() => Object.entries(cropsData), [cropsData]);
  const selectedCrop = cropsData[selectedCropKey];

  const generateLayout = () => {
    if (!selectedCrop || areaSummary.areaSqM <= 0 || isGenerating) {
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/results");
    }, 1100);
  };

  if (!isBoundaryCompleted) {
    return (
      <ScreenContainer
        backTo="/draw-field"
        title="Crop Planner"
        subtitle="Complete boundary first to continue"
      >
        <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4 text-sm text-earth-900">
          Boundary is not completed yet. Go back and complete at least 3 points
          on the field screen.
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backTo="/draw-field"
      title="Crop Planner"
      subtitle="Choose crop details and row orientation"
    >
      <div className="space-y-4">
        <section className="grid grid-cols-3 gap-3">
          <StatCard label="sqm" value={formatNumber(areaSummary.areaSqM, 0)} />
          <StatCard label="acres" value={formatNumber(areaSummary.areaAcres, 2)} />
          <StatCard
            label="hectares"
            value={formatNumber(areaSummary.areaHectares, 2)}
          />
        </section>

        <section className="space-y-3">
          {cropEntries.map(([key, crop]) => (
            <CropCard
              key={key}
              crop={crop}
              selected={selectedCropKey === key}
              onSelect={() => setSelectedCropKey(key)}
            />
          ))}
        </section>

        <section className="rounded-2xl border border-leaf-100 bg-white/90 p-4">
          <h3 className="font-heading text-base font-bold text-leaf-900">
            Orientation
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {ORIENTATIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setOrientation(item.value)}
                className={`min-h-11 rounded-xl border text-xs font-bold transition ${
                  orientation === item.value
                    ? "border-leaf-500 bg-leaf-100 text-leaf-900"
                    : "border-leaf-200 bg-white text-leaf-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-leaf-50 p-3 text-xs text-leaf-800">
            <p>Row spacing: {selectedCrop.rowSpacingCm} cm</p>
            <p>Plant spacing: {selectedCrop.plantSpacingCm} cm</p>
            <p>Seed rate: {selectedCrop.seedRateKgPerAcre} kg/acre</p>
            <p>Fertilizer: {selectedCrop.fertilizerKgPerAcre} kg/acre</p>
            <p>Expected yield: {selectedCrop.yieldQuintalPerAcre} q/acre</p>
          </div>
        </section>
      </div>

      <BottomActionBar>
        <AppButton className="w-full" onClick={generateLayout} disabled={isGenerating}>
          {isGenerating ? "Generating Layout..." : "Generate Layout"}
        </AppButton>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default CropPlannerScreen;
