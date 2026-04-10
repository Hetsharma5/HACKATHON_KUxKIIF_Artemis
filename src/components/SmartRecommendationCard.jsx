import React from 'react';
import { motion } from "framer-motion";
import { useTranslation } from '../hooks/useTranslation';

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
  const { t } = useTranslation();
  let recommendation = "";
  let message = "";
  let npk = { n: 100, p: 100, k: 100 };
  let statusBadge = "";

  const cropLower = lastCrop?.toLowerCase();

  if (cropLower === "cotton") {
    recommendation = t("rec_groundnut");
    message = t("rec_cotton_msg");
    npk = { n: 25, p: 60, k: 50 };
    statusBadge = t("nutrient_depleted");
  } else if (cropLower === "wheat" || cropLower === "maize") {
    recommendation = t("rec_soybean");
    message = t("rec_wheat_msg").replace("{0}", lastCrop);
    npk = { n: 40, p: 70, k: 60 };
    statusBadge = t("needs_rotation");
  } else if (cropLower === "cumin") {
    recommendation = t("rec_default");
    message = t("rec_cumin_msg");
    npk = { n: 15, p: 30, k: 40 };
    statusBadge = t("nutrient_depleted");
  } else if (cropLower === "groundnut") {
    recommendation = "Cotton or Cumin";
    message = t("rec_groundnut_msg");
    npk = { n: 90, p: 50, k: 70 };
    statusBadge = t("healthy");
  } else {
    recommendation = t("rec_default");
    message = t("rec_default_msg");
    npk = { n: 85, p: 90, k: 80 };
    statusBadge = t("healthy");
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-2xl border border-gray-100 bg-[#FFFFFF] p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">👨‍🌾</span>
          <h3 className="font-bold text-[#1F2937] text-sm uppercase tracking-wider">{t("wise_farmer")}</h3>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          statusBadge === t('healthy') ? 'bg-[#D1FAE5] text-[#047857]' : 'bg-[#FEF3C7] text-[#B45309]'
        }`}>
          {statusBadge}
        </span>
      </div>
      
      <p className="text-[#1F2937] text-sm font-medium leading-relaxed mb-5 relative z-10">
        {message}
      </p>

      <div className="bg-[#F9FAFB] rounded-xl p-4 border border-gray-100 relative z-10">
        <h4 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">{t("est_soil_nutrients")}</h4>
        <NutrientBar label={t("nitrogen")} level={npk.n} color={npk.n < 40 ? "#EF4444" : "#10B981"} />
        <NutrientBar label={t("phosphorus")} level={npk.p} color={npk.p < 40 ? "#EF4444" : "#F59E0B"} />
        <NutrientBar label={t("potassium")} level={npk.k} color={npk.k < 40 ? "#EF4444" : "#3B82F6"} />
      </div>
    </motion.div>
  );
}

export default SmartRecommendationCard;
