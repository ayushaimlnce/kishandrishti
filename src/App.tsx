import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceAssistantBar } from './components/VoiceAssistantBar';
import { NotificationModal } from './components/NotificationModal';
import { LeafScanner } from './components/LeafScanner';
import { DiagnosisResult } from './components/DiagnosisResult';
import { ActiveLearningTrainer } from './components/ActiveLearningTrainer';
import { OutbreakDashboard } from './components/OutbreakDashboard';
import { CommunityHub } from './components/CommunityHub';
import { AgronomistChat } from './components/AgronomistChat';
import { OfflineLibrary } from './components/OfflineLibrary';
import { SimpleAudioMode } from './components/SimpleAudioMode';
import {
  LanguageCode,
  DiagnosisResultData,
  SampleLeaf,
  PushNotification,
} from './types';
import { globalVoiceController } from './utils/speech';
import { saveOfflineScan, saveDiagnosisToHistory, OfflinePendingScan } from './utils/offlineDb';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('diagnose');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResultData | null>(null);
  const [chatCropContext, setChatCropContext] = useState<string>('General Crops');

  // Notifications State
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<PushNotification[]>([
    {
      id: 'notif-1',
      title: '🚨 Humidity Spike Alert: Late Blight Warning',
      message: 'Persistent 88% humidity in Northern plains increases Potato/Tomato Late Blight risk. Spray Trichoderma or Copper oxychloride preventive cover.',
      timestamp: new Date().toISOString(),
      type: 'pest_alert',
      urgent: true,
      read: false,
      audioText: 'Alert: High humidity detected in your region. Inspect tomato and potato leaves for dark water-soaked blight patches.',
    },
    {
      id: 'notif-2',
      title: '🌧️ Heavy Monsoon Showers Expected Tomorrow',
      message: 'Avoid applying foliar pesticide sprays within 6 hours before forecasted rains to prevent runoff wash-away.',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      type: 'weather',
      urgent: false,
      read: false,
      audioText: 'Weather Advisory: Postpone foliar spraying until after heavy rain.',
    },
  ]);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync Voice Controller Language
  useEffect(() => {
    globalVoiceController.setLanguage(currentLang);
  }, [currentLang]);

  // Handle Voice Toggle
  const handleToggleVoice = () => {
    if (isVoiceActive) {
      globalVoiceController.stopListening();
      setIsVoiceActive(false);
      setVoiceTranscript('');
    } else {
      const started = globalVoiceController.startListening(
        (transcript, isFinal) => {
          setVoiceTranscript(transcript);
        },
        (command) => {
          handleVoiceCommand(command);
        }
      );
      if (started) {
        setIsVoiceActive(true);
      }
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command === 'NAV_DIAGNOSE') {
      setCurrentTab('diagnose');
    } else if (command === 'NAV_OUTBREAKS') {
      setCurrentTab('outbreaks');
    } else if (command === 'NAV_COMMUNITY') {
      setCurrentTab('community');
    } else if (command === 'NAV_CHAT') {
      setCurrentTab('chat');
    } else if (command === 'NAV_TRAIN') {
      setCurrentTab('train');
    } else if (command === 'NAV_OFFLINE') {
      setCurrentTab('offline');
    } else if (command === 'READ_REMEDIES') {
      if (diagnosisResult) {
        const text = diagnosisResult.voiceAudioScript || diagnosisResult.quickSummary;
        globalVoiceController.speak(text, currentLang);
      }
    }
  };

  const handleToggleMute = () => {
    if (!isAudioMuted) {
      globalVoiceController.stopSpeaking();
      setIsAudioMuted(true);
    } else {
      setIsAudioMuted(false);
    }
  };

  // Diagnose Image via Full-Stack Express API
  const handleDiagnoseImage = async (
    imageBase64: string,
    cropHint: string,
    region: string,
    notes: string
  ) => {
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    // If offline, save to field queue and notify
    if (!navigator.onLine) {
      saveOfflineScan(imageBase64, cropHint, notes);
      setIsDiagnosing(false);
      setCurrentTab('offline');
      globalVoiceController.speak(
        'Scan saved to offline queue. It will automatically process when connection is restored.',
        currentLang
      );
      return;
    }

    try {
      const response = await fetch('/api/diagnose-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          cropType: cropHint,
          language: currentLang,
          userNotes: notes,
          region,
        }),
      });

      const result: DiagnosisResultData = await response.json();
      result.capturedImage = imageBase64;
      result.timestamp = new Date().toISOString();

      setDiagnosisResult(result);
      setChatCropContext(result.cropName);
      saveDiagnosisToHistory(result);

      // Speak key summary in selected language
      if (!isAudioMuted) {
        const speech = result.voiceAudioScript || result.translatedSummary || result.quickSummary;
        globalVoiceController.speak(speech, currentLang);
      }
    } catch (error) {
      console.warn('Diagnosis error:', error);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleSelectSample = (sample: SampleLeaf) => {
    if (sample.fullData) {
      const completeData: DiagnosisResultData = {
        cropName: sample.fullData.cropName || sample.cropName,
        isHealthy: sample.fullData.isHealthy ?? false,
        diseaseName: sample.fullData.diseaseName || sample.diseaseName,
        scientificName: sample.fullData.scientificName || '',
        pathogenType: sample.fullData.pathogenType || sample.category,
        severityLevel: sample.fullData.severityLevel || sample.severity,
        affectedAreaPercent: sample.fullData.affectedAreaPercent || 30,
        confidenceScore: sample.fullData.confidenceScore || 98.0,
        quickSummary: sample.fullData.quickSummary || sample.description,
        translatedSummary: sample.fullData.translatedSummary || '',
        symptoms: sample.fullData.symptoms || [],
        visualMarkers: sample.fullData.visualMarkers || [],
        environmentalTriggers: sample.fullData.environmentalTriggers || '',
        organicRemedies: sample.fullData.organicRemedies || [],
        biologicalControls: sample.fullData.biologicalControls || [],
        chemicalTreatment: sample.fullData.chemicalTreatment,
        preventivePractices: sample.fullData.preventivePractices || [],
        voiceAudioScript: sample.fullData.voiceAudioScript || sample.description,
        capturedImage: sample.thumbnailUrl,
        timestamp: new Date().toISOString(),
      };

      setDiagnosisResult(completeData);
      setChatCropContext(completeData.cropName);
      saveDiagnosisToHistory(completeData);

      if (!isAudioMuted) {
        const speech = completeData.voiceAudioScript || completeData.quickSummary;
        globalVoiceController.speak(speech, currentLang);
      }
    }
  };

  const handleRetrainFeedback = async (
    isAccurate: boolean,
    correctedLabel: string,
    notes: string
  ) => {
    if (!diagnosisResult) return;
    try {
      await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: diagnosisResult.cropName,
          detectedDisease: diagnosisResult.diseaseName,
          correctedDisease: correctedLabel,
          isCorrect: isAccurate,
          farmerNote: notes,
          contributorName: 'Field Practitioner',
          contributorRole: 'farmer',
          region: 'Field Scan',
          imageUrl: diagnosisResult.capturedImage,
        }),
      });
    } catch (e) {
      console.warn('Feedback submit error:', e);
    }
  };

  const handleSyncOfflineScan = (scan: OfflinePendingScan) => {
    handleDiagnoseImage(scan.imageBase64, scan.cropHint, 'Field Sync', scan.notes);
    setCurrentTab('diagnose');
  };

  const handleSimulateAlert = (title: string, msg: string, type: 'pest_alert' | 'weather') => {
    const newAlert: PushNotification = {
      id: `alert-${Date.now()}`,
      title,
      message: msg,
      timestamp: new Date().toISOString(),
      type,
      urgent: true,
      read: false,
      audioText: `${title}. ${msg}`,
    };
    setNotifications((prev) => [newAlert, ...prev]);
    setIsNotificationOpen(true);
    if (!isAudioMuted) {
      globalVoiceController.speak(newAlert.audioText, currentLang);
    }
  };

  const unreadAlertsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F4F7F2] text-[#1B261C] flex flex-col selection:bg-[#86C232] selection:text-[#1B261C] font-sans">
      {/* Universal Top Bar */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab === 'diagnose') {
            // Keep previous diagnosis or fresh
          }
        }}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        isVoiceActive={isVoiceActive}
        onToggleVoice={handleToggleVoice}
        isAudioMuted={isAudioMuted}
        onToggleMute={handleToggleMute}
        isOnline={isOnline}
        isSimpleMode={isSimpleMode}
        onToggleSimpleMode={() => setIsSimpleMode(!isSimpleMode)}
        unreadAlertsCount={unreadAlertsCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Real-time Hands-free Voice Assistant Banner */}
      <VoiceAssistantBar
        isListening={isVoiceActive}
        transcript={voiceTranscript}
        currentLang={currentLang}
        onClose={() => setIsVoiceActive(false)}
        onExecuteCommand={handleVoiceCommand}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {isSimpleMode ? (
          <SimpleAudioMode
            currentLang={currentLang}
            onOpenScanner={() => {
              setIsSimpleMode(false);
              setCurrentTab('diagnose');
            }}
            onOpenVoiceChat={() => {
              setIsSimpleMode(false);
              setCurrentTab('chat');
            }}
            onOpenOutbreaks={() => {
              setIsSimpleMode(false);
              setCurrentTab('outbreaks');
            }}
          />
        ) : (
          <>
            {currentTab === 'diagnose' && (
              <div className="space-y-6">
                <LeafScanner
                  onDiagnoseImage={handleDiagnoseImage}
                  isLoading={isDiagnosing}
                  currentLang={currentLang}
                  onSelectSample={handleSelectSample}
                />

                {diagnosisResult && (
                  <DiagnosisResult
                    data={diagnosisResult}
                    currentLang={currentLang}
                    onRetrainFeedback={handleRetrainFeedback}
                    onAskAgronomist={(crop) => {
                      setChatCropContext(crop);
                      setCurrentTab('chat');
                    }}
                  />
                )}
              </div>
            )}

            {currentTab === 'train' && (
              <ActiveLearningTrainer currentLang={currentLang} />
            )}

            {currentTab === 'outbreaks' && (
              <OutbreakDashboard
                currentLang={currentLang}
                onSimulateAlert={handleSimulateAlert}
              />
            )}

            {currentTab === 'community' && (
              <CommunityHub currentLang={currentLang} />
            )}

            {currentTab === 'chat' && (
              <AgronomistChat
                currentLang={currentLang}
                currentDiagnosis={diagnosisResult}
                cropContext={chatCropContext}
              />
            )}

            {currentTab === 'offline' && (
              <OfflineLibrary
                currentLang={currentLang}
                onSyncScan={handleSyncOfflineScan}
              />
            )}
          </>
        )}
      </main>

      {/* Push Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onClearAll={() => setNotifications([])}
        onSimulateNewAlert={() =>
          handleSimulateAlert(
            '🚨 Whitefly Pest Surge Warning',
            'Dry warm spell has triggered severe Whitefly migration in cotton & chilli crops. Install yellow sticky traps & apply Agniastra.',
            'pest_alert'
          )
        }
        currentLang={currentLang}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-[#E0E7DE] text-[#5C6B5A] py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1B261C]">KisanDrishti AgriGuard</span>
            <span className="bg-[#E9F2E7] text-[#2D5A27] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Bento AI
            </span>
            <span>• Smart India Hackathon Agritech Platform</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#5C6B5A]">
            <span>• ICAR / KVK Advisory Norms</span>
            <span>• 100% Zero-Residue Organic Formulations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
