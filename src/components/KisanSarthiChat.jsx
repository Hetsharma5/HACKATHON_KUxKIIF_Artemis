import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKisanSarthiChat } from '../hooks/useKisanSarthiChat';

const PREDEFINED_CHIPS = {
  cotton: [
    "Is my yield realistic?",
    "How to prevent Bollworm?",
    "When is the best market price?"
  ],
  default: [
    "Is it too cold to sow?",
    "Weed management tips",
    "Market outlook"
  ]
};

const GUJARATI_CHIPS = {
  cotton: [
    "શું મારી ઉપજ વાસ્તવિક છે?",
    "ઇયળને કેવી રીતે અટકાવવી?",
    "વેચાણ માટે શ્રેષ્ઠ સમય કયો છે?"
  ],
  default: [
    "શું વાવણી માટે ખૂબ ઠંડી છે?",
    "નિંદામણ વ્યવસ્થાપન ટિપ્સ",
    "બજાર નો માહોલ કેવો છે?"
  ]
};

function KisanSarthiChat({ cropName, fieldData }) {
  const [chatLanguage, setChatLanguage] = useState('en');
  const [isOnline, setIsOnline] = useState(false);
  const chatEndRef = useRef(null);

  // Get chat hook
  const { messages, isLoading, sendMessage, resetChat } = useKisanSarthiChat(fieldData, chatLanguage);

  // Ping localhost:11434 to check if local AI is online
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:11434/', {
          method: 'GET',
          // Use a short timeout
          signal: AbortSignal.timeout(2000)
        });
        if (res.ok) setIsOnline(true);
        else setIsOnline(false);
      } catch (e) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // Wipes context if cropName changes (like hitting reset or back)
  useEffect(() => {
    resetChat();
  }, [cropName, chatLanguage, resetChat]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text) => {
    sendMessage(text);
  };

  const getChips = () => {
    const isCotton = cropName?.toLowerCase() === 'cotton';
    if (chatLanguage === 'gu') {
      return isCotton ? GUJARATI_CHIPS.cotton : GUJARATI_CHIPS.default;
    }
    return isCotton ? PREDEFINED_CHIPS.cotton : PREDEFINED_CHIPS.default;
  };

  const chips = getChips();

  // Filter out the "system" message for the visual UI
  const displayMessages = messages.filter(m => m.role !== 'system');

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="mt-6 rounded-3xl bg-[#FFFFFF] border border-gray-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="bg-[#F9FAFB] border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <h3 className="font-bold text-[#1F2937] text-sm tracking-wide">KisanSarthi System</h3>
          <div className="flex items-center gap-1 ml-2">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'} shadow-sm`}></div>
            <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">
              {isOnline ? 'Online & Local' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-gray-200 rounded-full p-1 cursor-pointer" onClick={() => setChatLanguage(prev => prev === 'en' ? 'gu' : 'en')}>
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${chatLanguage === 'en' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>EN</div>
          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors ${chatLanguage === 'gu' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}>ગુજ</div>
        </div>
      </div>

      {/* Chat History */}
      <div className="p-4 max-h-[300px] overflow-y-auto flex flex-col gap-3 bg-[#FAFAFA]">
        {displayMessages.length === 0 ? (
          <div className="text-center text-xs text-gray-400 italic py-4">
            {chatLanguage === 'en' ? 'Ask anything about your crop layout...' : 'તમારા પાક વિશે કંઈપણ પૂછો...'}
          </div>
        ) : (
          displayMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#E0F2FE] text-[#0369A1] rounded-tr-sm' 
                    : 'bg-white border border-gray-100 shadow-sm text-gray-700 rounded-tl-sm'
                }`}
              >
                {msg.content === '' && msg.role === 'assistant' ? (
                  <span className="animate-pulse">Thinking...</span>
                ) : (
                  msg.content
                )}
              </motion.div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Anxiety Chips (Frictionless UI) */}
      <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 bg-white">
        <AnimatePresence mode="popLayout">
          {chips.map((chip, idx) => (
            <motion.button
              key={chip}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSend(chip)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] active:scale-95 transition-all text-[#4B5563] text-xs font-medium text-left border border-gray-200 disabled:opacity-50"
            >
              {chip}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Local Notice Footer */}
      <div className="bg-[#1F2937] px-4 py-1.5 w-full text-center">
        <p className="text-[9px] text-gray-400 tracking-wider">
          Powered by Gemma:2b (Running locally on this device)
        </p>
      </div>
    </motion.div>
  );
}

export default KisanSarthiChat;
