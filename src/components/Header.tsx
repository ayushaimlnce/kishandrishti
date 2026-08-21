import React from 'react';
import {
  Sprout,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Globe,
  Bell,
  Sparkles,
} from 'lucide-react';
import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentLang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  isAudioMuted: boolean;
  onToggleMute: () => void;
  isOnline: boolean;
  isSimpleMode: boolean;
  onToggleSimpleMode: () => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentLang,
  onLanguageChange,
  isVoiceActive,
  onToggleVoice,
  isAudioMuted,
  onToggleMute,
  isOnline,
  isSimpleMode,
  onToggleSimpleMode,
  unreadAlertsCount,
  onOpenNotifications,
}) => {
  const navItems = [
    { id: 'diagnose', label: t('navDiagnose', currentLang) },
    { id: 'outbreaks', label: t('navOutbreaks', currentLang) },
    { id: 'community', label: t('navCommunity', currentLang) },
    { id: 'chat', label: t('navChat', currentLang) },
    { id: 'train', label: t('navTrain', currentLang) },
    { id: 'offline', label: t('navOffline', currentLang) },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs text-[#1B261C] border-b border-[#E0E7DE] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => onTabChange('diagnose')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D5A27] rounded-xl px-1 shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-[#1B261C] whitespace-nowrap">
              {t('appName', currentLang)}
            </span>
            <span className="text-[11px] bg-[#E9F2E7] text-[#2D5A27] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Pro
            </span>
          </div>
        </button>

        {/* Navigation Links Zone */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                currentTab === item.id
                  ? 'bg-[#2D5A27] text-white shadow-sm'
                  : 'text-[#5C6B5A] hover:text-[#1B261C] hover:bg-[#F0F4EF]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Primary Action Controls Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Simple / Audio Mode Toggle */}
          <button
            onClick={onToggleSimpleMode}
            title="Toggle Simple / Audio Mode for Low-Literacy Users"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all whitespace-nowrap shrink-0 ${
              isSimpleMode
                ? 'bg-amber-400 text-[#1B261C] border-amber-300 shadow-sm'
                : 'bg-[#F0F4EF] text-[#2D5A27] border-[#DDE4DC] hover:bg-[#E3ECE1]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#2D5A27]" />
            <span className="hidden sm:inline">{t('simpleMode', currentLang)}</span>
          </button>

          {/* Voice Recognition Mic Button */}
          <button
            onClick={onToggleVoice}
            title={isVoiceActive ? 'Disable hands-free voice assistant' : 'Enable hands-free voice assistant'}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              isVoiceActive
                ? 'bg-[#2D5A27] text-white shadow-md ring-2 ring-[#86C232]'
                : 'bg-[#F0F4EF] text-[#1B261C] border border-[#DDE4DC] hover:bg-[#E3ECE1]'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isVoiceActive ? 'bg-red-500 animate-pulse' : 'bg-[#5C6B5A]'
              }`}
            />
            {isVoiceActive ? (
              <span className="uppercase tracking-wider text-[11px]">Voice Active</span>
            ) : (
              <span className="hidden sm:inline text-[11px] text-[#5C6B5A]">Voice</span>
            )}
            {isVoiceActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-[#5C6B5A]" />}
          </button>

          {/* TTS Audio Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isAudioMuted ? 'Unmute voice readouts' : 'Mute voice readouts'}
            className="p-2 rounded-full border bg-[#F0F4EF] border-[#DDE4DC] text-[#1B261C] hover:bg-[#E3ECE1] transition-colors"
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-red-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#2D5A27]" />
            )}
          </button>

          {/* Notification Alerts Bell */}
          <button
            onClick={onOpenNotifications}
            title="Outbreak & Weather Alerts"
            className="relative p-2 rounded-full border bg-[#F0F4EF] border-[#DDE4DC] text-[#1B261C] hover:bg-[#E3ECE1] transition-colors"
          >
            <Bell className="w-4 h-4 text-[#1B261C]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-[#F0F4EF] border border-[#DDE4DC] rounded-full px-3 py-1.5 text-xs sm:text-sm text-[#1B261C]">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-[#2D5A27] shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
              className="bg-transparent text-[#1B261C] font-semibold focus:outline-none cursor-pointer pr-1"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-white text-[#1B261C]">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Offline/Online Status Pill */}
          <div
            title={isOnline ? 'Online with Real-time AI' : 'Offline Mode (Local Knowledge Base Active)'}
            className={`hidden md:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
              isOnline
                ? 'bg-[#E9F2E7] border-[#DDE4DC] text-[#2D5A27]'
                : 'bg-amber-100 border-amber-300 text-amber-800'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-[#2D5A27]" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="whitespace-nowrap">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center overflow-x-auto py-2 px-3 gap-1.5 border-t border-[#E0E7DE] bg-white scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
              currentTab === item.id
                ? 'bg-[#2D5A27] text-white'
                : 'bg-[#F0F4EF] text-[#5C6B5A] hover:bg-[#E3ECE1]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
