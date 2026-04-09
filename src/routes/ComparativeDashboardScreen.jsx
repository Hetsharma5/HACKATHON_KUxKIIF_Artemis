import { useNavigate } from "react-router-dom";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import ScreenContainer from "../components/ScreenContainer";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { generatePlanMetrics } from "../utils/estimates";
import { formatCurrency, formatNumber } from "../utils/format";

function ComparativeDashboardScreen() {
  const navigate = useNavigate();
  const { fieldAreaSqM, cropsData } = usePlannerStore();

  const cropsToCompare = ["cotton", "wheat", "maize"];

  const scenarios = cropsToCompare.map(cropKey => {
    const crop = cropsData[cropKey];
    const metrics = generatePlanMetrics({ areaSqM: fieldAreaSqM, crop, orientation: "auto" });
    return {
      cropKey,
      cropName: crop.name,
      investment: metrics.estimatedCost,
      effort: crop.daysToHarvest || 100,
      marketValue: metrics.estimatedRevenue,
      roiAmount: metrics.estimatedProfit,
      roiPercent: metrics.estimatedCost > 0 ? (metrics.estimatedProfit / metrics.estimatedCost) * 100 : 0
    };
  });

  // Find winner
  const bestRoiCrop = scenarios.reduce((prev, current) => (prev.roiPercent > current.roiPercent) ? prev : current);

  return (
    <ScreenContainer
      backTo="/results"
      title="Yield Compare"
      subtitle="Compare AI estimates to maximize your return on investment."
    >
      <div className="space-y-6 pb-6 mt-4">
        {scenarios.map((scenario) => {
          const isWinner = scenario.cropKey === bestRoiCrop.cropKey;
          return (
            <div key={scenario.cropKey} className={`relative rounded-3xl border ${isWinner ? 'border-[#007AFF] shadow-[0_0_20px_rgba(0,122,255,0.15)] ring-1 ring-[#007AFF]' : 'border-gray-200 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)]'} bg-[#FFFFFF] p-6 overflow-hidden`}>
              
              {isWinner && (
                <div className="absolute top-0 right-0 bg-[#007AFF] text-white px-5 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest shadow-md">
                  Best ROI
                </div>
              )}

              <h2 className="text-2xl font-bold text-[#1F2937] mb-5">{scenario.cropName}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                  <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold">Est. Market Value</span>
                  <span className="text-xl font-bold text-[#10B981]">{formatCurrency(scenario.marketValue)}</span>
                </div>
                
                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                  <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold">Est. Investment</span>
                  <span className="text-lg font-bold text-[#EF4444]">{formatCurrency(scenario.investment)}</span>
                </div>

                <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                  <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold">Est. Effort</span>
                  <span className="text-lg font-bold text-[#1F2937]">Approx. {scenario.effort} Days</span>
                </div>
                
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs uppercase tracking-wider text-[#6B7280] font-bold">Predicted Profit</span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-[#1F2937] block">{formatCurrency(scenario.roiAmount)}</span>
                    <span className="text-sm font-extrabold text-[#007AFF]"> Est. {formatNumber(scenario.roiPercent, 1)}% ROI </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <BottomActionBar>
        <AppButton className="w-full" onClick={() => navigate("/results")}>
          Return to Details
        </AppButton>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default ComparativeDashboardScreen;
