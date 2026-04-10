import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import StaticFieldMap from "../components/StaticFieldMap";
import FinancialForecastChart from "../components/FinancialForecastChart";
import ActionPlanGenerator from "../components/ActionPlanGenerator";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { useTranslation } from "../hooks/useTranslation";
import { formatCurrency, formatNumber } from "../utils/format";

function ResultsScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { crop, estimates, points, addSavedLand } = usePlannerStore();

  useEffect(() => {
    if (estimates && estimates.areaSqM > 0) {
      setTimeout(() => {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#007AFF', '#10B981', '#F59E0B'],
          disableForReducedMotion: true,
          zIndex: 100,
          opacity: 0.6
        });
      }, 300);
    }
  }, [estimates]);

  if (!estimates || estimates.areaSqM <= 0) {
    return (
      <ScreenContainer
        backTo="/crop-planner"
        title={t("results_title")}
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
      title={`${crop.name} ${t("results_title")}`}
      subtitle={t("results_subtitle")}
    >
      <div className="space-y-4 pb-32">
        <StaticFieldMap showRows previewLines={estimates.previewLines} points={points} />

        {/* Quick Glance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] bg-[#F0FDF4] p-6 border border-[#BBF7D0]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">{t("est_revenue")}</p>
            <p className="mt-1 text-2xl font-bold text-[#166534]">
              {formatCurrency(estimates.estimatedRevenue * 0.9)} - {formatCurrency(estimates.estimatedRevenue * 1.1)}
            </p>
          </div>
          <div className="rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] bg-[#DCFCE7] p-6 border border-[#86EFAC]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#166534]">{t("est_profit")}</p>
            <p className="mt-1 text-2xl font-bold text-[#166534]">
              {estimates.estimatedCost > 0 ? `${Math.floor((estimates.estimatedProfit / estimates.estimatedCost) * 85)}% - ${Math.ceil((estimates.estimatedProfit / estimates.estimatedCost) * 115)}%` : "N/A"}
            </p>
          </div>
        </div>

        <div 
          className="rounded-3xl bg-[#FFFFFF] p-6 border border-gray-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)]"
        >
          <h3 className="text-lg font-bold text-[#1F2937] text-left">
            {t("plan_summary")}
          </h3>
          <p className="text-[10px] text-green-700 mt-1 text-left font-bold uppercase tracking-widest">
            {t("orientation_selected")} {t(estimates.resolvedOrientation.toLowerCase())}
          </p>
          <div className="mt-4 mb-5 grid grid-cols-2 gap-4 border-b border-gray-100 pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold flex items-center gap-1">
                <span>🗺️</span> {t("total_area")}
              </p>
              <p className="mt-1 text-3xl font-bold text-[#1F2937] flex items-baseline">
                {formatNumber(estimates.areaSqM, 0)}
                <span className="ml-1 text-xs font-bold text-[#6B7280]">{t("sqm")}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold flex items-center gap-1">
                <span>🗺️</span> {t("usable_area")}
              </p>
              <p className="mt-1 text-3xl font-bold text-[#1F2937] flex items-baseline">
                {formatNumber(estimates.usableAreaSqM, 0)}
                <span className="ml-1 text-xs font-bold text-[#6B7280]">{t("sqm")}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t("rows")} value={formatNumber(estimates.rowCount, 0)} />
            <StatCard
              label={t("total_plants")}
              value={formatNumber(estimates.estimatedTotalPlants, 0)}
            />
          </div>
        </div>

        {/* Resource Blueprint */}
        <div className="mt-2">
          <h3 className="text-lg font-bold text-[#1F2937] mb-3 text-left pl-1">Resource Needs</h3>
          <div className="rounded-3xl shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] bg-white border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌱</span>
                <span className="font-bold text-[#1F2937] text-sm">{t("seed")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1F2937] text-sm tracking-tight">{formatNumber(estimates.seedRequiredKg * 0.9, 1)} - {formatNumber(estimates.seedRequiredKg * 1.1, 1)} kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🧪</span>
                <span className="font-bold text-[#1F2937] text-sm">{t("fertilizer")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1F2937] text-sm tracking-tight">{formatNumber(estimates.fertilizerRequiredKg * 0.9, 1)} - {formatNumber(estimates.fertilizerRequiredKg * 1.1, 1)} kg</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌾</span>
                <span className="font-bold text-[#1F2937] text-sm">{t("yield")}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#1F2937] text-sm tracking-tight">{formatNumber(estimates.expectedYieldQuintal * 0.85, 1)} - {formatNumber(estimates.expectedYieldQuintal * 1.15, 1)} q</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <FinancialForecastChart cost={estimates.estimatedCost} revenue={estimates.estimatedRevenue} />
          <div className="mt-3 mx-2 rounded-xl bg-[#007AFF]/10 p-3 flex gap-3 items-center border border-[#007AFF]/20">
            <span className="text-lg">🎯</span>
            <p className="text-[#007AFF] text-xs font-bold leading-snug">
              Precision Sarthi estimates a <span className="underline">5-8% reduction</span> in seed waste due to optimized spacing.
            </p>
          </div>
        </div>
        
        <ActionPlanGenerator cropName={crop.name} daysToHarvest={crop.daysToHarvest} />

      </div>

      <BottomActionBar>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <AppButton variant="primary" onClick={() => navigate("/compare")}>
              Compare Yields
            </AppButton>
            <AppButton variant="secondary" onClick={() => {
              addSavedLand(`${crop.name} Plot`, crop.name, points);
              navigate("/my-lands");
            }}>
              Save to Library 
            </AppButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <AppButton variant="ghost" onClick={() => navigate("/crop-planner")}>
              Change Crop
            </AppButton>
            <AppButton variant="ghost" onClick={() => navigate("/draw-field")}>
              Redraw Field
            </AppButton>
          </div>
        </div>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default ResultsScreen;
