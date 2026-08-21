import React, { useState } from 'react';
import {
  Leaf,
  Volume2,
  VolumeX,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  Bug,
  Calendar,
  Sparkles,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  Info,
  ChevronRight,
  Share2,
  Download,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';
import { DiagnosisResultData, LanguageCode } from '../types';
import { t } from '../utils/translations';
import { globalVoiceController } from '../utils/speech';

interface DiagnosisResultProps {
  data: DiagnosisResultData;
  currentLang: LanguageCode;
  onRetrainFeedback: (isAccurate: boolean, correctedLabel: string, notes: string) => void;
  onAskAgronomist: (cropContext: string) => void;
}

export const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  data,
  currentLang,
  onRetrainFeedback,
  onAskAgronomist,
}) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'biological' | 'chemical' | 'prevention'>('organic');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [showCorrectionForm, setShowCorrectionForm] = useState<boolean>(false);
  const [correctedName, setCorrectedName] = useState<string>('');
  const [correctionNote, setCorrectionNote] = useState<string>('');
  const [userRole, setUserRole] = useState<'farmer' | 'agronomist' | 'researcher'>('farmer');

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      globalVoiceController.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const speechText =
        data.voiceAudioScript ||
        data.translatedSummary ||
        `${data.cropName}. ${data.diseaseName}. ${data.quickSummary}`;

      setIsPlayingAudio(true);
      globalVoiceController.speak(speechText, currentLang, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handlePositiveFeedback = () => {
    onRetrainFeedback(true, data.diseaseName, 'Diagnosis verified by user in field');
    setFeedbackSubmitted(true);
  };

  const handleNegativeFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRetrainFeedback(false, correctedName || 'Corrected condition', correctionNote);
    setFeedbackSubmitted(true);
    setShowCorrectionForm(false);
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-[#E9F2E7] text-[#2D5A27] border-[#DDE4DC]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Diagnosis Card */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-[#E0E7DE]">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
                data.isHealthy ? 'bg-[#2D5A27]' : 'bg-amber-600'
              }`}
            >
              {data.isHealthy ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A27]">
                  {data.cropName}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${getSeverityBadgeClass(
                    data.severityLevel
                  )}`}
                >
                  {data.severityLevel} Severity
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#F0F4EF] text-[#1B261C] border border-[#DDE4DC]">
                  {data.pathogenType}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1B261C] mt-1">
                {data.diseaseName}
              </h2>
              {data.scientificName && (
                <p className="text-xs italic text-[#5C6B5A] mt-0.5">Pathogen: {data.scientificName}</p>
              )}
            </div>
          </div>

          {/* Voice Audio Listen Button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-md transition-all shrink-0 ${
              isPlayingAudio
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
                : 'bg-[#2D5A27] hover:bg-[#23471f] text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span>{t('stopAudio', currentLang)}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span>{t('listenAudio', currentLang)}</span>
              </>
            )}
          </button>
        </div>

        {/* Translated & Quick Summary */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 space-y-3">
            {data.translatedSummary && (
              <div className="p-4 rounded-2xl bg-[#E9F2E7] border border-[#DDE4DC] text-[#1B261C] text-sm font-semibold leading-relaxed">
                🌾 {data.translatedSummary}
              </div>
            )}
            <p className="text-sm text-[#5C6B5A] leading-relaxed font-medium">{data.quickSummary}</p>
          </div>

          {/* Metrics Card */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2 bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] text-center">
            <div className="p-2">
              <span className="text-xs text-[#5C6B5A] block font-semibold">Affected Area</span>
              <span className="text-2xl font-black text-amber-700 mt-1 block">
                {data.affectedAreaPercent}%
              </span>
            </div>
            <div className="p-2 border-l border-[#DDE4DC]">
              <span className="text-xs text-[#5C6B5A] block font-semibold">AI Confidence</span>
              <span className="text-2xl font-black text-[#2D5A27] mt-1 block">
                {data.confidenceScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms Bullet List */}
        {data.symptoms && data.symptoms.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#E0E7DE]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#2D5A27] mb-2.5">
              Observed Leaf Pathological Symptoms:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#1B261C]">
              {data.symptoms.map((symptom, i) => (
                <li key={i} className="flex items-start gap-2 bg-[#F0F4EF] p-2.5 rounded-xl border border-[#DDE4DC]/60">
                  <span className="w-2 h-2 rounded-full bg-[#2D5A27] mt-1.5 shrink-0" />
                  <span className="font-medium">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Interactive Visual Lesion Marker Overlay & Environmental Triggers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaf with interactive bounding boxes */}
        {data.capturedImage && (
          <div className="lg:col-span-5 bg-white border border-[#E0E7DE] rounded-3xl p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DE] text-xs">
              <span className="font-bold text-[#1B261C] flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#2D5A27]" /> Lesion Symptom Map
              </span>
              <button
                onClick={() => setShowMarkers(!showMarkers)}
                className="flex items-center gap-1 text-[#2D5A27] hover:text-[#1B261C] text-xs font-bold"
              >
                {showMarkers ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showMarkers ? 'Hide Markers' : 'Show Markers'}</span>
              </button>
            </div>

            <div className="relative my-3 rounded-2xl overflow-hidden bg-[#F0F4EF] flex items-center justify-center max-h-[340px] border border-[#DDE4DC]">
              <img
                src={data.capturedImage}
                alt="Analyzed Leaf"
                className="w-full h-full object-contain rounded-xl"
              />

              {/* Bounding box overlays */}
              {showMarkers &&
                data.visualMarkers &&
                data.visualMarkers.map((marker, idx) => {
                  const [ymin, xmin, ymax, xmax] = marker.box;
                  return (
                    <div
                      key={idx}
                      style={{
                        top: `${ymin}%`,
                        left: `${xmin}%`,
                        width: `${Math.max(xmax - xmin, 15)}%`,
                        height: `${Math.max(ymax - ymin, 15)}%`,
                        borderColor: marker.color || '#ef4444',
                      }}
                      className="absolute border-2 rounded-lg border-dashed pointer-events-none transition-all shadow-sm"
                    >
                      <span
                        style={{ backgroundColor: marker.color || '#ef4444' }}
                        className="absolute -top-5 left-0 text-[10px] text-white font-black px-2 py-0.5 rounded shadow whitespace-nowrap"
                      >
                        {marker.label}
                      </span>
                    </div>
                  );
                })}
            </div>

            <div className="text-[11px] text-[#5C6B5A] text-center font-medium">
              Targeted necrotic patches detected by Computer Vision Model
            </div>
          </div>
        )}

        {/* Environmental Triggers & Ask Doctor Button */}
        <div className={`${data.capturedImage ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-4`}>
          {data.environmentalTriggers && (
            <div className="bg-white border border-[#E0E7DE] rounded-3xl p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Environmental Triggers & Cause
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#1B261C] leading-relaxed font-medium">
                {data.environmentalTriggers}
              </p>
            </div>
          )}

          {/* Quick Doctor Consultation Action */}
          <div className="bg-[#E9F2E7] border border-[#DDE4DC] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-[#1B261C]">Need specific field guidance?</h3>
              <p className="text-xs text-[#5C6B5A] mt-0.5 font-medium">
                Consult with our multilingual AI Agronomist for exact spray timing and tank-mix compatibility.
              </p>
            </div>
            <button
              onClick={() => onAskAgronomist(data.cropName)}
              className="px-5 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs sm:text-sm font-bold transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Ask Krishi Doctor</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation for Treatments */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl overflow-hidden shadow-xs">
        <div className="flex border-b border-[#E0E7DE] overflow-x-auto scrollbar-none bg-[#F0F4EF] p-2 gap-2">
          <button
            onClick={() => setActiveTab('organic')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'organic'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C] hover:bg-white/60'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t('organicRemediesTab', currentLang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('biological')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'biological'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C] hover:bg-white/60'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>{t('biologicalTab', currentLang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('chemical')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'chemical'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C] hover:bg-white/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t('chemicalTab', currentLang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('prevention')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'prevention'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C] hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('preventionTab', currentLang)}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 sm:p-7">
          {/* 1. Organic Remedies */}
          {activeTab === 'organic' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[#1B261C] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#2D5A27]" /> Zero-Residue Organic Formulations & Recipes
                </h3>
                <span className="text-[11px] font-bold text-[#2D5A27] bg-[#E9F2E7] px-3 py-1 rounded-full border border-[#DDE4DC]">
                  Eco-friendly
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.organicRemedies &&
                  data.organicRemedies.map((remedy, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-5 flex flex-col justify-between hover:border-[#2D5A27]/50 transition-colors shadow-xs"
                    >
                      <div>
                        <span className="w-7 h-7 rounded-xl bg-[#2D5A27] text-white font-black text-xs flex items-center justify-center mb-2.5 shadow-xs">
                          {idx + 1}
                        </span>
                        <h4 className="font-black text-base text-[#1B261C]">{remedy.title}</h4>

                        <div className="mt-3.5 space-y-2.5 text-xs">
                          <div className="bg-white p-2.5 rounded-xl border border-[#DDE4DC]">
                            <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold tracking-wider">
                              Dosage / Rate
                            </span>
                            <span className="text-[#2D5A27] font-black text-sm">{remedy.dosage}</span>
                          </div>

                          <div>
                            <span className="text-[#1B261C] font-bold">Preparation:</span>
                            <p className="text-[#5C6B5A] mt-0.5 font-medium">{remedy.preparation}</p>
                          </div>

                          <div>
                            <span className="text-[#1B261C] font-bold">Application Method:</span>
                            <p className="text-[#5C6B5A] mt-0.5 font-medium">{remedy.applicationMethod}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-[#DDE4DC] text-xs text-[#2D5A27] flex items-center justify-between font-bold">
                        <span>Frequency:</span>
                        <span>{remedy.frequency}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 2. Biological Controls */}
          {activeTab === 'biological' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-[#1B261C]">
                Beneficial Microbes & Biological Control Agents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.biologicalControls &&
                  data.biologicalControls.map((bio, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-5 flex items-start gap-3.5"
                    >
                      <div className="p-2.5 rounded-xl bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC] shrink-0 font-bold">
                        <Bug className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-[#2D5A27] uppercase tracking-wider">
                          Bio-Control Strategy #{idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-[#1B261C] mt-1 leading-relaxed font-medium">
                          {bio}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 3. Chemical Treatment */}
          {activeTab === 'chemical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Judicious Chemical Application:</strong> Use chemical treatments strictly as an emergency intervention when pest/disease severity surpasses the Economic Threshold Level (ETL). Always observe recommended waiting periods.
                </p>
              </div>

              {data.chemicalTreatment ? (
                <div className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-5 space-y-3.5">
                  <div>
                    <span className="text-xs font-bold text-[#5C6B5A]">Chemical Formulation:</span>
                    <h4 className="text-lg font-black text-[#1B261C]">
                      {data.chemicalTreatment.chemicalName}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4DC]">
                      <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">Recommended Dosage</span>
                      <span className="text-amber-800 font-black text-sm">
                        {data.chemicalTreatment.dosage}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4DC]">
                      <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">
                        Pre-Harvest Interval (Waiting Period)
                      </span>
                      <span className="text-[#2D5A27] font-black text-sm">
                        {data.chemicalTreatment.waitingPeriod}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DDE4DC] text-xs text-red-700 font-medium">
                    <strong>Safety & Operator Protection:</strong> {data.chemicalTreatment.safetyWarning}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#5C6B5A]">
                  No chemical intervention is required for this condition; organic management is sufficient.
                </p>
              )}
            </div>
          )}

          {/* 4. Preventive Practices */}
          {activeTab === 'prevention' && (
            <div className="space-y-4">
              <h3 className="text-base font-black text-[#1B261C]">
                Cultural Practices & Disease Prevention Schedule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.preventivePractices &&
                  data.preventivePractices.map((practice, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-4 flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-[#2D5A27] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-[#1B261C] font-medium">{practice}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Learning & Model Retraining Feedback Loop (SIH Highlight) */}
      <div className="bg-white border-2 border-[#2D5A27]/30 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2D5A27]" />
              <h3 className="text-lg font-black text-[#1B261C]">{t('trainPrompt', currentLang)}</h3>
            </div>
            <p className="text-xs text-[#5C6B5A] mt-1 font-medium">
              {t('confirmDiagnosis', currentLang)} Your validation actively trains the AI model.
            </p>
          </div>

          {feedbackSubmitted ? (
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E9F2E7] border border-[#DDE4DC] text-[#2D5A27] text-xs sm:text-sm font-bold">
              <CheckCircle className="w-4 h-4 text-[#2D5A27]" />
              <span>Feedback Incorporated into AI Training Repository</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePositiveFeedback}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Yes, Accurate</span>
              </button>

              <button
                onClick={() => setShowCorrectionForm(!showCorrectionForm)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#1B261C] text-xs sm:text-sm font-bold border border-[#DDE4DC] transition-colors"
              >
                <ThumbsDown className="w-4 h-4 text-amber-600" />
                <span>Submit Correction</span>
              </button>
            </div>
          )}
        </div>

        {/* Correction form */}
        {showCorrectionForm && !feedbackSubmitted && (
          <form onSubmit={handleNegativeFeedbackSubmit} className="mt-4 pt-4 border-t border-[#E0E7DE] space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#1B261C] mb-1">
                  Correct Disease / Pathogen Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brown Spot (Bipolaris oryzae)"
                  value={correctedName}
                  onChange={(e) => setCorrectedName(e.target.value)}
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">Your Role / Accreditation:</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none cursor-pointer"
                >
                  <option value="farmer">Progressive Farmer</option>
                  <option value="agronomist">KVK Agronomist / Extension Officer</option>
                  <option value="researcher">Agricultural University Researcher</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B261C] mb-1">
                Diagnostic Observations / Notes:
              </label>
              <textarea
                rows={2}
                placeholder="Explain why this diagnosis differed (e.g., center of lesion was gray rather than brown, indicating potash deficiency)."
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] text-xs focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCorrectionForm(false)}
                className="px-4 py-2 rounded-xl bg-[#F0F4EF] text-[#5C6B5A] text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-xs shadow-xs"
              >
                Submit to Retraining Queue
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
