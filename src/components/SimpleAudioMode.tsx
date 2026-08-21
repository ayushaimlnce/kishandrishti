import React from 'react';
import {
  Camera,
  Mic,
  ShieldAlert,
  PhoneCall,
  Volume2,
  Leaf,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { globalVoiceController } from '../utils/speech';

interface SimpleAudioModeProps {
  currentLang: LanguageCode;
  onOpenScanner: () => void;
  onOpenVoiceChat: () => void;
  onOpenOutbreaks: () => void;
}

export const SimpleAudioMode: React.FC<SimpleAudioModeProps> = ({
  currentLang,
  onOpenScanner,
  onOpenVoiceChat,
  onOpenOutbreaks,
}) => {
  const handlePlayVoiceIntro = () => {
    const text =
      currentLang === 'hi'
        ? 'नमस्ते किसान भाई! पत्ती की जांच के लिए हरा कैमरा बटन दबाएं, डॉक्टर से बात करने के लिए लाल माइक बटन दबाएं, या मौसम अलर्ट के लिए पीला बटन दबाएं।'
        : 'Welcome! Tap the green camera button to scan a leaf, tap the red mic button to talk with Dr. Kisan, or tap yellow button for weather alerts.';
    globalVoiceController.speak(text, currentLang);
  };

  const handleCallHelpline = () => {
    const helplineAudio =
      currentLang === 'hi'
        ? 'किसान कॉल सेंटर टोल-फ्री नंबर 1800-180-1551 पर सुबह 6 बजे से रात 10 बजे तक मुफ्त कृषि सलाह उपलब्ध है।'
        : 'Kisan Call Center Toll-Free number 1800-180-1551 is available daily from 6 AM to 10 PM for free expert agricultural guidance.';
    globalVoiceController.speak(helplineAudio, currentLang);
  };

  return (
    <div className="space-y-6">
      {/* High-Contrast Voice Welcome Card */}
      <div className="bg-[#2D5A27] text-white rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#2D5A27]">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="px-3.5 py-1 bg-[#86C232] text-[#1B261C] rounded-full text-xs font-black uppercase tracking-wider inline-block">
            सरल ऑडियो मोड • EASY VOICE MODE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentLang === 'hi' ? 'आसान किसान सहायक' : 'Hands-Free Farmer Hub'}
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#E9F2E7]">
            {currentLang === 'hi'
              ? 'बटन दबाकर बोलें या आवाज में इलाज सुनें'
              : 'Big buttons designed for field use and voice readout.'}
          </p>
        </div>

        <button
          onClick={handlePlayVoiceIntro}
          className="flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-[#F0F4EF] text-[#2D5A27] font-black text-base shadow-xs transition-transform active:scale-95 shrink-0"
        >
          <Volume2 className="w-6 h-6 animate-pulse text-[#2D5A27]" />
          <span>{currentLang === 'hi' ? 'निर्देश सुनें' : 'Listen Instructions'}</span>
        </button>
      </div>

      {/* 4 Big High-Contrast Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* 1. Camera Leaf Scan */}
        <button
          onClick={onOpenScanner}
          className="bg-white hover:bg-[#F0F4EF] text-[#1B261C] rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-[#2D5A27] flex flex-col items-center text-center justify-between gap-4 transition-all transform active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#86C232]/50 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#E9F2E7] flex items-center justify-center text-[#2D5A27] border border-[#DDE4DC] shadow-xs group-hover:scale-105 transition-transform">
            <Camera className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-[#2D5A27] block">
              ACTION 1
            </span>
            <h2 className="text-2xl font-black mt-1">
              {currentLang === 'hi' ? 'पत्ती का फोटो लें' : 'Scan Crop Leaf'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B5A] mt-1 font-medium">
              {currentLang === 'hi'
                ? 'बीमारी की तुरंत पहचान व जैविक इलाज'
                : 'AI Disease Detection & Organic Remedies'}
            </p>
          </div>
        </button>

        {/* 2. Voice Consultation */}
        <button
          onClick={onOpenVoiceChat}
          className="bg-white hover:bg-[#F0F4EF] text-[#1B261C] rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-red-400 flex flex-col items-center text-center justify-between gap-4 transition-all transform active:scale-95 group focus:outline-none focus:ring-4 focus:ring-red-200 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center text-red-700 border border-red-200 shadow-xs group-hover:scale-105 transition-transform">
            <Mic className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-red-700 block">
              ACTION 2
            </span>
            <h2 className="text-2xl font-black mt-1">
              {currentLang === 'hi' ? 'बोलकर डॉक्टर से पूछें' : 'Voice Krishi Doctor'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B5A] mt-1 font-medium">
              {currentLang === 'hi'
                ? 'माइक में सवाल बोलें और जवाब सुनें'
                : 'Hands-free voice consultation'}
            </p>
          </div>
        </button>

        {/* 3. Weather & Outbreaks */}
        <button
          onClick={onOpenOutbreaks}
          className="bg-white hover:bg-[#F0F4EF] text-[#1B261C] rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-amber-400 flex flex-col items-center text-center justify-between gap-4 transition-all transform active:scale-95 group focus:outline-none focus:ring-4 focus:ring-amber-200 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 border border-amber-200 shadow-xs group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-10 h-10 text-amber-800" />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-amber-800 block">
              ACTION 3
            </span>
            <h2 className="text-2xl font-black mt-1">
              {currentLang === 'hi' ? 'मौसम व रोग अलर्ट' : 'Weather Alerts'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6B5A] mt-1 font-medium">
              {currentLang === 'hi'
                ? 'नमी व कीट प्रकोप की जानकारी'
                : 'Humidity and pest outbreak alerts'}
            </p>
          </div>
        </button>

        {/* 4. Kisan Call Center */}
        <button
          onClick={handleCallHelpline}
          className="bg-white hover:bg-[#F0F4EF] text-[#1B261C] rounded-3xl p-6 sm:p-8 shadow-xs border-2 border-[#DDE4DC] flex flex-col items-center text-center justify-between gap-4 transition-all transform active:scale-95 group focus:outline-none focus:ring-4 focus:ring-[#86C232]/50 min-h-[220px]"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#F0F4EF] flex items-center justify-center text-[#2D5A27] border border-[#DDE4DC] shadow-xs group-hover:scale-105 transition-transform">
            <PhoneCall className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs uppercase font-black tracking-widest text-[#5C6B5A] block">
              ACTION 4
            </span>
            <h2 className="text-2xl font-black mt-1 text-[#2D5A27]">1800-180-1551</h2>
            <p className="text-xs sm:text-sm text-[#5C6B5A] mt-1 font-medium">
              {currentLang === 'hi'
                ? 'मुफ्त किसान हेल्पलाइन (टोल फ्री)'
                : 'Toll-Free Government Kisan Helpline'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
