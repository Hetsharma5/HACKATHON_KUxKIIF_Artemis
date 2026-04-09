import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScreenContainer from "../components/ScreenContainer";
import StaticFieldMap from "../components/StaticFieldMap";
import { usePlannerStore } from "../hooks/usePlannerStore";
import SmartRecommendationCard from "../components/SmartRecommendationCard";
import AppButton from "../components/AppButton";

function LandProfileCard({ land, isExpanded, onToggle, onAddHistory, navigate, setActiveLandId, resetLandSeason, setPoints, setFieldAreaSqM, setIsBoundaryCompleted }) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const submitHistory = () => {
    if(!selectedCrop || !selectedYear) return;
    setLoading(true);
    setTimeout(() => {
      onAddHistory(land.id, parseInt(selectedYear), selectedCrop);
      setLoading(false);
      setIsAdding(false);
      setSelectedCrop('');
      setSelectedYear('');
    }, 1500);
  };

  const handleClick = () => {
    if(land.currentCrop === 'None' || !land.currentCrop) {
      setActiveLandId(land.id);
      setPoints(land.points);
      setFieldAreaSqM(land.areaSqM || 100);
      setIsBoundaryCompleted(true);
      navigate('/crop-planner');
    } else {
      onToggle();
    }
  };

  return (
    <motion.div 
      layout
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-3xl border border-gray-200 bg-[#FFFFFF] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden mb-6"
    >
      <div className="h-44 w-full pointer-events-none relative border-b border-gray-100">
        <StaticFieldMap points={land.points} />
        <div className="absolute top-3 right-3 z-[1000]">
          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-sm backdrop-blur-md ${
            land.status === 'Healthy' ? 'bg-[#D1FAE5]/90 text-[#047857]' : 'bg-[#FEF3C7]/90 text-[#B45309]'
          }`}>
            {land.status}
          </span>
        </div>
      </div>
      
      <div className="p-6 cursor-pointer flex justify-between items-center bg-white hover:bg-gray-50 transition-colors" onClick={handleClick}>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#1F2937]">{land.name}</h2>
          <p className="text-[10px] font-bold text-[#6B7280] mt-1 tracking-widest uppercase">
            Mapped: {land.lastMappedDate}
          </p>
        </div>
        <div className="text-right flex-1 flex flex-col items-end">
          {land.currentCrop && land.currentCrop !== 'None' ? (
            <div className="w-full pl-4">
              <div className="flex justify-between items-center mb-1">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981]">{land.currentCrop}</span>
                 <span className="text-[10px] font-bold text-[#6B7280]">Est. 60 Days left</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="h-full bg-[#10B981] rounded-full"
                />
              </div>
            </div>
          ) : (
            <span className="inline-block rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#007AFF] border border-blue-100">
              Ready for Planting
            </span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-[#F9FAFB] overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Crop Timeline</h3>
                <div className="flex gap-2">
                  <button onClick={() => setIsAdding(!isAdding)} className="text-[10px] bg-white border border-[#E5E7EB] text-[#6B7280] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all hover:bg-gray-50 shadow-sm">
                    + Log History
                  </button>
                  {land.currentCrop && land.currentCrop !== 'None' && (
                    <button onClick={() => resetLandSeason(land.id)} className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all hover:bg-red-100 shadow-sm">
                      Reset Season
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isAdding && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, height: 0 }} 
                    animate={{ opacity: 1, y: 0, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-5 overflow-hidden"
                  >
                    <h4 className="text-xs font-bold text-[#1F2937] mb-3 uppercase tracking-wider">Log Soil History</h4>
                    <div className="flex gap-2 mb-4">
                      <select className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-xs p-2.5 font-semibold text-[#1F2937] outline-none focus:border-blue-300" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                        <option value="">Year</option>
                        {[2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <select className="flex-1 bg-gray-50 border border-gray-200 rounded-lg text-xs p-2.5 font-semibold text-[#1F2937] outline-none focus:border-blue-300" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
                        <option value="">Crop</option>
                        <option value="Cotton">Cotton</option>
                        <option value="Wheat">Wheat</option>
                        <option value="Maize">Maize</option>
                        <option value="Groundnut">Groundnut</option>
                      </select>
                    </div>
                    <button 
                      onClick={submitHistory} 
                      className="w-full bg-[#007AFF] text-white rounded-xl text-xs font-bold py-2.5 flex justify-center items-center h-10 transition-colors hover:bg-blue-600"
                    >
                      {loading ? <span className="animate-pulse">Analyzing soil exhaustion...</span> : "Analyze Soil"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3 mb-6">
                {land.history.map((season, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex flex-col items-center mt-1">
                      <div className={`w-3 h-3 rounded-full ${season.status === 'In Progress' ? 'bg-[#3B82F6] ring-4 ring-blue-50' : 'bg-[#10B981] ring-4 ring-green-50'}`}></div>
                      {idx !== land.history.length - 1 && <div className="w-0.5 h-10 bg-gray-200 my-1"></div>}
                    </div>
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-between items-center">
                      <div>
                        <span className="text-[#1F2937] font-bold block text-sm">{season.crop}</span>
                        <span className="text-[#6B7280] text-[10px] font-bold uppercase tracking-wider mt-0.5 block">{season.year}</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {season.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {land.history.length > 0 && (
                <SmartRecommendationCard lastCrop={land.history[land.history.length - 1]?.crop} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function MyLandsScreen() {
  const navigate = useNavigate();
  const { savedLands, appendCropHistory, setActiveLandId, resetLandSeason, setPoints, setFieldAreaSqM, setIsBoundaryCompleted } = usePlannerStore();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <ScreenContainer
      backTo="/"
      title="My Fields"
      subtitle="Your digital registry and smart crop history."
    >
      <div className="mx-6 border-b border-[#E5E7EB] mb-6"></div>
      
      <div className="pb-6">
        {savedLands.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-6 text-center"
          >
            <span className="text-6xl mb-4">🌾</span>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">Your farm starts here</h3>
            <p className="text-sm text-[#6B7280] mb-8">Map your first field to unlock AI crop planning and local insights.</p>
            <AppButton onClick={() => navigate("/draw-field")} className="w-3/4">
              Map First Field
            </AppButton>
          </motion.div>
        ) : (
          savedLands.map(land => (
            <LandProfileCard 
              key={land.id} 
              land={land} 
              isExpanded={expandedId === land.id}
              onToggle={() => toggleExpand(land.id)}
              onAddHistory={appendCropHistory}
              navigate={navigate}
              setActiveLandId={setActiveLandId}
              resetLandSeason={resetLandSeason}
              setPoints={setPoints}
              setFieldAreaSqM={setFieldAreaSqM}
              setIsBoundaryCompleted={setIsBoundaryCompleted}
            />
          ))
        )}
      </div>
    </ScreenContainer>
  );
}

export default MyLandsScreen;
