import React from 'react';
import { Bell, AlertTriangle, CloudRain, ShieldAlert, CheckCircle, Volume2, X, Sparkles } from 'lucide-react';
import { PushNotification, LanguageCode } from '../types';
import { globalVoiceController } from '../utils/speech';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSimulateNewAlert: () => void;
  currentLang: LanguageCode;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll,
  onSimulateNewAlert,
  currentLang,
}) => {
  if (!isOpen) return null;

  const handlePlayAudio = (text: string) => {
    globalVoiceController.speak(text, currentLang);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B261C]/50 backdrop-blur-xs">
      <div className="bg-white border border-[#E0E7DE] rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-[#1B261C] animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#E0E7DE] flex items-center justify-between bg-[#F0F4EF]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1B261C]">Pest & Weather Outbreak Alerts</h2>
              <p className="text-xs text-[#5C6B5A] font-medium">Timely Push Warnings for Your Agricultural Zone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C6B5A] hover:text-[#1B261C] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action toolbar */}
        <div className="px-4 py-2.5 bg-white border-b border-[#E0E7DE] flex items-center justify-between gap-2 text-xs">
          <button
            onClick={onSimulateNewAlert}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simulate Real-time Threat Alert
          </button>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-[#5C6B5A] hover:text-[#1B261C] font-semibold underline"
            >
              Clear all alerts
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-[#5C6B5A] space-y-3">
              <CheckCircle className="w-12 h-12 text-[#2D5A27] mx-auto opacity-80" />
              <p className="text-base font-black text-[#1B261C]">No Active Threat Alerts</p>
              <p className="text-xs max-w-sm mx-auto text-[#5C6B5A]">
                Weather conditions are stable and no high-risk pest outbreaks are currently active in your nearby districts.
              </p>
            </div>
          ) : (
            notifications.map((alert) => {
              const isPest = alert.type === 'pest_alert';
              const isWeather = alert.type === 'weather';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    alert.urgent
                      ? 'bg-red-50 border-red-200 shadow-xs'
                      : alert.read
                      ? 'bg-[#F0F4EF]/60 border-[#E0E7DE] opacity-80'
                      : 'bg-[#F0F4EF] border-[#DDE4DC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isPest && <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />}
                      {isWeather && <CloudRain className="w-5 h-5 text-sky-600 shrink-0" />}
                      {!isPest && !isWeather && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
                      <span className="font-black text-sm text-[#1B261C]">{alert.title}</span>
                    </div>
                    {alert.urgent && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white uppercase tracking-wider">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-[#5C6B5A] leading-relaxed font-medium">{alert.message}</p>

                  <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-[#DDE4DC] text-xs">
                    <span className="text-[11px] text-[#5C6B5A] font-medium">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayAudio(alert.audioText || alert.message)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-[#E3ECE1] text-[#2D5A27] font-bold border border-[#DDE4DC] transition-colors"
                        title="Listen to audio warning"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen
                      </button>
                      {!alert.read && (
                        <button
                          onClick={() => onMarkAsRead(alert.id)}
                          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#E3ECE1] text-[#5C6B5A] font-semibold border border-[#DDE4DC]"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F0F4EF] border-t border-[#E0E7DE] text-center">
          <p className="text-[11px] text-[#5C6B5A] font-medium">
            🌾 Outbreak warnings are synchronized with ICAR, KVK advisory bulletins, and regional meteorological stations.
          </p>
        </div>
      </div>
    </div>
  );
};
