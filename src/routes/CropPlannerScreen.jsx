import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppButton from "../components/AppButton";
import BottomActionBar from "../components/BottomActionBar";
import CropCard from "../components/CropCard";
import ScreenContainer from "../components/ScreenContainer";
import StatCard from "../components/StatCard";
import StaticFieldMap from "../components/StaticFieldMap";
import { usePlannerStore } from "../hooks/usePlannerStore";
import { useTranslation } from "../hooks/useTranslation";
import { formatNumber } from "../utils/format";

function CropPlannerScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const ORIENTATIONS = [
    { value: "horizontal", label: t("horizontal") },
    { value: "vertical", label: t("vertical") },
    { value: "auto", label: t("auto") },
  ];

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
    activeLandId,
    savedLands,
    estimates,
    points
  } = usePlannerStore();

  const cropEntries = useMemo(() => Object.entries(cropsData), [cropsData]);
  const selectedCrop = cropsData[selectedCropKey];

  const activeLand = savedLands.find(l => (l._id ?? l.id) === activeLandId);
  const previousCrop = activeLand?.history?.length > 0 ? activeLand.history[activeLand.history.length - 1].crop : null;

  const getAlternativeCrop = (crop) => {
    if(crop.toLowerCase() === 'cotton') return t('crop_groundnut_full');
    if(crop.toLowerCase() === 'wheat' || crop.toLowerCase() === 'maize') return t('crop_soybean_full');
    return t('crop_legumes_full');
  };

  const isRotationWarning = previousCrop && previousCrop.toLowerCase() === selectedCropKey;

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
        title={t("crop_planner_title")}
        subtitle={t("boundary_incomplete")}
      >
        <div className="rounded-2xl border border-earth-200 bg-earth-50 p-4 text-sm text-earth-900">
          {t("boundary_incomplete_msg")}
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backTo="/draw-field"
      title={t("crop_planner_title")}
      subtitle={t("crop_planner_subtitle")}
    >
      <div className="space-y-4 pb-32">
        <section className="grid grid-cols-3 gap-3">
          <StatCard label={t("sqm")} value={formatNumber(areaSummary.areaSqM, 0)} />
          <StatCard label={t("acres")} value={formatNumber(areaSummary.areaAcres, 2)} />
          <StatCard
            label={t("hectares")}
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
            {t("orientation")}
          </h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {ORIENTATIONS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setOrientation(item.value)}
                className={`min-h-11 rounded-xl border text-xs font-bold transition flex justify-center items-center ${
                  orientation === item.value
                    ? "border-blue-500 bg-blue-50 text-[#007AFF] shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-[#F9FAFB] p-4 text-xs font-medium text-[#1F2937] border border-gray-100 shadow-sm leading-relaxed">
            <p className="flex justify-between border-b border-gray-200 pb-1 mb-1"><span className="text-[#6B7280]">{t("row_spacing")}</span> <span>{selectedCrop.rowSpacingCm} cm</span></p>
            <p className="flex justify-between border-b border-gray-200 pb-1 mb-1"><span className="text-[#6B7280]">{t("plant_spacing")}</span> <span>{selectedCrop.plantSpacingCm} cm</span></p>
            <p className="flex justify-between border-b border-gray-200 pb-1 mb-1"><span className="text-[#6B7280]">{t("est_seed_rate")}</span> <span>{selectedCrop.seedRateKgPerAcre} kg/acre</span></p>
            <p className="flex justify-between border-b border-gray-200 pb-1 mb-1"><span className="text-[#6B7280]">{t("fertilizer")}</span> <span>{selectedCrop.fertilizerKgPerAcre} kg/acre</span></p>
            <p className="flex justify-between"><span className="text-[#6B7280]">{t("potential_yield")}</span> <span className="text-[#10B981] font-bold">{selectedCrop.yieldQuintalPerAcre} q/acre</span></p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
             <h3 className="font-heading text-sm font-bold text-leaf-900 mb-2">
               {t("live_preview")}
             </h3>
             <div className="h-64 sm:h-72 w-full overflow-hidden rounded-xl border border-leaf-200 shadow-sm relative">
               <StaticFieldMap showRows={true} previewLines={estimates?.previewLines || []} points={points} />
             </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isRotationWarning && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-[88px] left-4 right-4 z-50 rounded-2xl bg-orange-50 border border-orange-200 p-4 shadow-lg flex items-start gap-3"
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-bold text-orange-800">{t("rotation_alert")}</p>
              <p className="text-xs text-orange-700 mt-1">
                {t("rotation_msg_pre")} {t(`crop_${selectedCropKey}`)} {t("rotation_msg_mid")} <span className="font-bold border-b border-orange-700">{getAlternativeCrop(selectedCrop.name)}</span> {t("rotation_msg_post")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomActionBar>
        <AppButton className="w-full" onClick={generateLayout} disabled={isGenerating}>
          {isGenerating ? t("processing_maps") : t("generate_preview")}
        </AppButton>
      </BottomActionBar>
    </ScreenContainer>
  );
}

export default CropPlannerScreen;
