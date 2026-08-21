import React from 'react';
import { Mic, Radio, Volume2, Sparkles, X } from 'lucide-react';
import { LanguageCode } from '../types';
import { t } from '../utils/translations';

interface VoiceAssistantBarProps {
  isListening: boolean;
  transcript: string;
  currentLang: LanguageCode;
  onClose: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export const VoiceAssistantBar: React.FC<VoiceAssistantBarProps> = ({
  isListening,
  transcript,
  currentLang,
  onClose,
  onExecuteCommand,
}) => {
  if (!isListening) return null;

  return (
    <div className="bg-[#1B261C] border-b border-[#2D5A27] text-white px-4 py-3 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-[#86C232] opacity-75"></span>
            <div className="w-8 h-8 rounded-full bg-[#2D5A27] flex items-center justify-center text-white shadow-md relative z-10 border border-[#86C232]">
              <Mic className="w-4 h-4 text-[#86C232]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#86C232] flex items-center gap-1 font-mono">
                <span className="w-2 h-2 bg-[#86C232] rounded-full animate-pulse"></span> LISTENING • HANDS-FREE ACTIVE
              </span>
            </div>
            <p className="text-sm font-semibold text-[#F4F7F2] truncate">
              {transcript ? (
                <span className="italic">"{transcript}"</span>
              ) : (
                <span className="text-[#A2B59F]">{t('voiceCommandHint', currentLang)}</span>
              )}
            </p>
          </div>
        </div>

        {/* Quick Voice Command Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-[#A2B59F] font-semibold whitespace-nowrap hidden lg:inline">Quick Say:</span>
          <button
            onClick={() => onExecuteCommand('NAV_DIAGNOSE')}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-white whitespace-nowrap border border-white/15 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#86C232]" /> "Scan Leaf"
          </button>
          <button
            onClick={() => onExecuteCommand('READ_REMEDIES')}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-white whitespace-nowrap border border-white/15 flex items-center gap-1 transition-colors"
          >
            <Volume2 className="w-3 h-3 text-[#86C232]" /> "Read Remedies"
          </button>
          <button
            onClick={() => onExecuteCommand('NAV_OUTBREAKS')}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-white whitespace-nowrap border border-white/15 transition-colors"
          >
            "Weather Alerts"
          </button>
          <button
            onClick={() => onExecuteCommand('NAV_CHAT')}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs font-semibold text-white whitespace-nowrap border border-white/15 transition-colors"
          >
            "Ask Doctor"
          </button>
          <button
            onClick={onClose}
            className="p-1 text-[#A2B59F] hover:text-white rounded-full hover:bg-white/10 shrink-0 ml-1"
            title="Dismiss voice banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
