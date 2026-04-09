import React from 'react';
import { motion } from "framer-motion";

function NutrientBar({ label, level, color }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-[#6B7280] mb-1">
        <span>{label}</span>
        <span>{level}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, type: "spring" }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function SmartRecommendationCard({ lastCrop }) {
  let recommendation = "";
  let message = "";
  let npk = { n: 100, p: 100, k: 100 };
  let statusBadge = "";

  if (lastCrop?.toLowerCase() === "cotton") {
    recommendation = "Groundnut or Legumes";
    message = "Based on your previous Cotton harvest, we suggest Groundnut or Legumes for the upcoming season to naturally restore Nitrogen levels in your soil.";
    npk = { n: 25, p: 60, k: 50 }; // Depleted N
    statusBadge = "Nutrient Depleted";
  } else if (lastCrop?.toLowerCase() === "wheat" || lastCrop?.toLowerCase() === "maize") {
    recommendation = "Soybean or Pulses";
    message = `Based on your previous ${lastCrop} harvest, integrating Soybean or Pulses will help balance the soil profile.`;
    npk = { n: 40, p: 70, k: 60 };
    statusBadge = "Needs Rotation";
  } else {
    recommendation = "Wheat or Cotton";
    message = "Your soil health looks strong! A cash crop like Wheat or Cotton is highly recommended this season.";
    npk = { n: 85, p: 90, k: 80 };
    statusBadge = "Healthy";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl border border-gray-100 bg-[#FFFFFF] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">👨‍🌾</span>
          <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider">Wise Farmer</h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          statusBadge === 'Healthy' ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#FEF3C7] text-[#B45309]'
        }`}>
          {statusBadge}
        </span>
      </div>
      
      <p className="text-[#1F2937] text-sm font-medium leading-relaxed mb-5 relative z-10">
        {message}
      </p>

      <div className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100 relative z-10">
        <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">Est. Soil Nutrients (Post-Harvest)</h4>
        <NutrientBar label="Nitrogen (N)" level={npk.n} color={npk.n < 40 ? "#EF4444" : "#10B981"} />
        <NutrientBar label="Phosphorus (P)" level={npk.p} color={npk.p < 40 ? "#EF4444" : "#F59E0B"} />
        <NutrientBar label="Potassium (K)" level={npk.k} color={npk.k < 40 ? "#EF4444" : "#3B82F6"} />
      </div>
    </motion.div>
  );
}

export default SmartRecommendationCard;
