import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Sparkles,
  Leaf,
  MapPin,
  HelpCircle,
  Video,
  X,
  Volume2,
} from 'lucide-react';
import { SAMPLE_LEAVES } from '../data/sampleLeaves';
import { SampleLeaf, LanguageCode } from '../types';
import { t } from '../utils/translations';
import { globalVoiceController } from '../utils/speech';

interface LeafScannerProps {
  onDiagnoseImage: (
    imageBase64: string,
    cropHint: string,
    region: string,
    notes: string
  ) => void;
  isLoading: boolean;
  currentLang: LanguageCode;
  onSelectSample: (sample: SampleLeaf) => void;
}

export const LeafScanner: React.FC<LeafScannerProps> = ({
  onDiagnoseImage,
  isLoading,
  currentLang,
  onSelectSample,
}) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cropHint, setCropHint] = useState<string>('auto');
  const [region, setRegion] = useState<string>('Northern / Central Plains');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Stop camera when unmounting
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setPreviewImage(reader.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    setPreviewImage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Unable to open camera. Please check camera permissions or upload an image file.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleTriggerDiagnosis = () => {
    if (previewImage) {
      onDiagnoseImage(previewImage, cropHint, region, farmerNotes);
    }
  };

  const handleSampleClick = (sample: SampleLeaf) => {
    setPreviewImage(sample.thumbnailUrl);
    setCropHint(sample.cropName);
    onSelectSample(sample);
  };

  const playVoiceInstruction = () => {
    const text =
      currentLang === 'hi'
        ? 'कृपया संक्रमित पत्ती का साफ फोटो लें या नीचे दिए गए नमूने चुनें।'
        : 'Please take a clear photo of the diseased leaf or try sample leaves below.';
    globalVoiceController.speak(text, currentLang);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Audio Help */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2D5A27] via-[#86C232] to-[#2D5A27]"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#E9F2E7] text-[#2D5A27] flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#1B261C]">
                  {t('uploadTitle', currentLang)}
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-[#5C6B5A]">
                  Instant AI Leaf Pathology, Zero-Residue Organic Recipes & Active Learning
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={playVoiceInstruction}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#2D5A27] text-xs sm:text-sm font-bold border border-[#DDE4DC] transition-colors shrink-0"
          >
            <Volume2 className="w-4 h-4 text-[#2D5A27]" />
            <span>Voice Guide</span>
          </button>
        </div>

        {/* Crop & Region Context Pickers */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-4 border-t border-[#E0E7DE] text-sm">
          <div>
            <label className="block text-xs font-bold text-[#2D5A27] mb-1.5 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Crop Type
            </label>
            <select
              value={cropHint}
              onChange={(e) => setCropHint(e.target.value)}
              className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] font-medium focus:ring-2 focus:ring-[#2D5A27] focus:outline-none cursor-pointer"
            >
              <option value="auto">Auto-Detect from Leaf Image</option>
              <option value="Tomato">Tomato (टमाटर)</option>
              <option value="Paddy / Rice">Paddy / Rice (धान)</option>
              <option value="Wheat">Wheat (गेहूं)</option>
              <option value="Cotton">Cotton (कपास)</option>
              <option value="Potato">Potato (आलू)</option>
              <option value="Chilli">Chilli (मिर्च)</option>
              <option value="Maize">Maize / Corn (मक्का)</option>
              <option value="Sugarcane">Sugarcane (गन्ना)</option>
              <option value="Groundnut">Groundnut (मूंगफली)</option>
              <option value="Citrus / Lemon">Citrus / Lemon (नींबू)</option>
              <option value="Soybean">Soybean (सोयाबीन)</option>
              <option value="Mustard">Mustard (सरसों)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D5A27] mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Farming Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] font-medium focus:ring-2 focus:ring-[#2D5A27] focus:outline-none cursor-pointer"
            >
              <option value="Punjab / Haryana (Indo-Gangetic)">Punjab / Haryana (Indo-Gangetic)</option>
              <option value="Maharashtra / Gujarat (Western)">Maharashtra / Gujarat (Western)</option>
              <option value="Uttar Pradesh / Bihar (Eastern Plains)">Uttar Pradesh / Bihar (Eastern Plains)</option>
              <option value="Andhra Pradesh / Telangana (Deccan)">Andhra Pradesh / Telangana (Deccan)</option>
              <option value="Tamil Nadu / Kerala (Southern)">Tamil Nadu / Kerala (Southern)</option>
              <option value="West Bengal / Odisha / Assam">West Bengal / Odisha / Assam</option>
              <option value="Madhya Pradesh / Rajasthan">Madhya Pradesh / Rajasthan</option>
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-[#2D5A27] mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Farmer Symptoms Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Yellow spots appeared after heavy rain"
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] placeholder-[#5C6B5A]/70 font-medium focus:ring-2 focus:ring-[#2D5A27] focus:outline-none text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Upload / Camera Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scanner Bento Tile */}
        <div className="lg:col-span-7 bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div className="relative min-h-[320px] sm:min-h-[360px] bg-[#F0F4EF] rounded-2xl overflow-hidden border-2 border-dashed border-[#2D5A27]/25 flex items-center justify-center">
            {/* Live Camera View */}
            {isCameraActive && (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover max-h-[360px]"
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-[#2D5A27]/60 rounded-xl m-6 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed border-[#86C232] rounded-full animate-pulse opacity-90" />
                  <span className="absolute bottom-3 text-xs font-bold bg-[#1B261C]/90 text-[#86C232] px-3.5 py-1 rounded-full border border-[#2D5A27]">
                    Align leaf inside frame
                  </span>
                </div>
                <div className="absolute bottom-4 flex items-center gap-3">
                  <button
                    onClick={capturePhoto}
                    className="px-6 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all transform active:scale-95"
                  >
                    <Camera className="w-5 h-5" /> Take Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="p-3 rounded-2xl bg-[#1B261C] hover:bg-black text-white shadow-md"
                    title="Cancel Camera"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Preview of Selected Image */}
            {!isCameraActive && previewImage && (
              <div className="relative w-full h-full flex items-center justify-center p-3">
                <img
                  src={previewImage}
                  alt="Captured Crop Leaf"
                  className="max-h-[360px] w-auto max-w-full object-contain rounded-xl shadow-md"
                />
                <button
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-4 right-4 p-2 bg-[#1B261C]/80 hover:bg-[#1B261C] text-white rounded-full shadow-lg"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 bg-[#1B261C]/90 px-3.5 py-1.5 rounded-xl text-xs text-white flex items-center gap-2 font-medium">
                  <Leaf className="w-3.5 h-3.5 text-[#86C232]" />
                  <span>Leaf Image Ready for Diagnosis</span>
                </div>
              </div>
            )}

            {/* Empty State / Initial Prompts */}
            {!isCameraActive && !previewImage && (
              <div className="text-center p-8 space-y-4 max-w-md">
                <div className="w-20 h-20 rounded-full bg-[#E9F2E7] border-4 border-dashed border-[#2D5A27]/20 flex items-center justify-center text-[#2D5A27] mx-auto shadow-inner">
                  <Leaf className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1B261C]">Scan Your Crop Leaf</h2>
                  <p className="text-xs sm:text-sm text-[#5C6B5A] mt-1.5">
                    Take a live field photo, upload from device, or tap any tested sample on the right.
                  </p>
                </div>
                {cameraError && (
                  <p className="text-xs text-amber-900 bg-amber-100 p-3 rounded-xl border border-amber-200 font-medium">
                    {cameraError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-5 pt-4 border-t border-[#E0E7DE] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-sm transition-all shadow-sm disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{t('cameraBtn', currentLang)}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#2D5A27] font-bold text-sm border-2 border-[#2D5A27] transition-all disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{t('galleryBtn', currentLang)}</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* AI Diagnose Action Button */}
            <button
              onClick={handleTriggerDiagnosis}
              disabled={!previewImage || isLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black shadow-md transition-all ${
                previewImage && !isLoading
                  ? 'bg-[#1B261C] hover:bg-black text-white shadow-xl shadow-[#1B261C]/20 scale-[1.02]'
                  : 'bg-[#F0F4EF] text-[#5C6B5A]/60 border border-[#DDE4DC] cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{t('diagnosing', currentLang)}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#86C232]" />
                  <span>Diagnose with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pre-loaded Sample Leaves Bento Tile */}
        <div className="lg:col-span-5 bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E0E7DE]">
              <div>
                <h2 className="text-sm font-bold text-[#1B261C] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#2D5A27]" /> {t('testSampleBtn', currentLang)}
                </h2>
                <p className="text-xs text-[#5C6B5A]">Tap any leaf specimen for instant AI pathology</p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9F2E7] text-[#2D5A27] px-2.5 py-1 rounded-full border border-[#DDE4DC]">
                1-Click Test
              </span>
            </div>

            <div className="mt-3.5 space-y-2.5 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
              {SAMPLE_LEAVES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample)}
                  className="w-full text-left p-3 rounded-2xl bg-[#F0F4EF] hover:bg-[#E6EDE4] border border-[#DDE4DC] hover:border-[#2D5A27]/50 transition-all flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#2D5A27]"
                >
                  <div className="w-14 h-14 rounded-xl bg-white overflow-hidden border border-[#DDE4DC] shrink-0 flex items-center justify-center shadow-xs">
                    <img
                      src={sample.thumbnailUrl}
                      alt={sample.diseaseName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#2D5A27]">{sample.cropName}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          sample.severity === 'Critical'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : sample.severity === 'High'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : sample.severity === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC]'
                        }`}
                      >
                        {sample.severity}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#1B261C] truncate mt-0.5">
                      {sample.diseaseName}
                    </p>
                    <p className="text-[11px] text-[#5C6B5A] truncate">{sample.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E0E7DE] text-[11px] text-[#5C6B5A] text-center font-medium">
            🌱 Calibrated against ICAR & PlantVillage agricultural pathology datasets.
          </div>
        </div>
      </div>
    </div>
  );
};
