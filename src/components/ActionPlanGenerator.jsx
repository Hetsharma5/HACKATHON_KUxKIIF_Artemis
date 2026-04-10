import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

function ActionPlanGenerator({ cropName, daysToHarvest }) {
  const [activeTip, setActiveTip] = useState(null);
  const { t, lang } = useTranslation();

  const today = new Date();
  
  const sowingDate = new Date(today);
  sowingDate.setDate(today.getDate() + 7);

  const growthDate = new Date(today);
  growthDate.setDate(today.getDate() + 45);

  const harvestDate = new Date(today);
  harvestDate.setDate(today.getDate() + (daysToHarvest || 100));

  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString(lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "gu-IN", { month: "short", day: "numeric" });
  };

  const toIcsDate = (dateObj) => {
    return dateObj.toISOString().replace(/-|:|\.\d+/g, '').split('T')[0] + 'T090000Z';
  };

  const handleSaveToCalendar = () => {
    const startStr = toIcsDate(sowingDate);
    const fertStr = toIcsDate(growthDate);
    const harvStr = toIcsDate(harvestDate);

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KisanSarthi//ActionPlan//${lang.toUpperCase()}
BEGIN:VEVENT
DTSTAMP:${startStr}
DTSTART:${startStr}
DTEND:${startStr}
SUMMARY:${t("est_sowing_window")} (${cropName})
DESCRIPTION:${t("sowing_hint")}
END:VEVENT
BEGIN:VEVENT
DTSTAMP:${fertStr}
DTSTART:${fertStr}
DTEND:${fertStr}
SUMMARY:${t("apply_nitrogen")}
DESCRIPTION:${t("nitrogen_hint")}
END:VEVENT
BEGIN:VEVENT
DTSTAMP:${harvStr}
DTSTART:${harvStr}
DTEND:${harvStr}
SUMMARY:${t("est_harvest_window")} (${cropName})
DESCRIPTION:${t("harvest_hint")}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Crop_Schedule_${cropName}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleTip = (tipId) => {
    setActiveTip(activeTip === tipId ? null : tipId);
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-[#FFFFFF] p-6 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] mt-4">
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-[#1F2937]">{t("est_schedule")}</h3>
        <button 
          onClick={handleSaveToCalendar}
          className="bg-[#007AFF] hover:bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full border border-blue-600 transition-colors shadow-sm tracking-wider uppercase"
        >
          {t("add_to_calendar")}
        </button>
      </div>

      <div className="space-y-4">
        
        {/* Sowing */}
        <div className="flex gap-4 cursor-pointer" onClick={() => toggleTip('sowing')}>
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#007AFF] mt-1.5 ring-4 ring-blue-50"></div>
            <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#007AFF] uppercase tracking-widest">{formatDate(sowingDate)}</p>
              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">{t("stage")} 1</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937] mt-0.5">{t("est_sowing_window")}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{t("sowing_hint")}</p>
            <AnimatePresence>
              {activeTip === 'sowing' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 text-xs bg-blue-50 text-blue-800 p-2 rounded-lg font-medium shadow-inner">
                  💡 {t("sowing_tip")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Growth */}
        <div className="flex gap-4 cursor-pointer" onClick={() => toggleTip('growth')}>
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] mt-1.5 ring-4 ring-green-50"></div>
            <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest">{formatDate(growthDate)}</p>
              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">{t("stage")} 2</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937] mt-0.5">{t("apply_nitrogen")}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{t("nitrogen_hint")}</p>
            <AnimatePresence>
              {activeTip === 'growth' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 text-xs bg-green-50 text-green-800 p-2 rounded-lg font-medium shadow-inner">
                  💡 {t("nitrogen_tip")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Harvest */}
        <div className="flex gap-4 cursor-pointer" onClick={() => toggleTip('harvest')}>
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] mt-1.5 ring-4 ring-amber-50"></div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-widest">{formatDate(harvestDate)}</p>
              <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">{t("stage")} 3</span>
            </div>
            <p className="text-sm font-semibold text-[#1F2937] mt-0.5">{t("est_harvest_window")}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{t("harvest_hint")}</p>
            <AnimatePresence>
              {activeTip === 'harvest' && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 text-xs bg-amber-50 text-amber-800 p-2 rounded-lg font-medium shadow-inner">
                  💡 {t("harvest_tip")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActionPlanGenerator;
