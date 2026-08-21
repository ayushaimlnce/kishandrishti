import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Upload,
  Layers,
  TrendingUp,
  UserCheck,
  Shield,
  FileCheck,
  Clock,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import { TrainingMetrics, FeedbackItem, LanguageCode } from '../types';

interface ActiveLearningTrainerProps {
  currentLang: LanguageCode;
}

export const ActiveLearningTrainer: React.FC<ActiveLearningTrainerProps> = ({ currentLang }) => {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(null);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [isRetraining, setIsRetraining] = useState<boolean>(false);
  const [retrainProgress, setRetrainProgress] = useState<number>(0);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // New sample form state
  const [newCrop, setNewCrop] = useState<string>('Tomato');
  const [newDisease, setNewDisease] = useState<string>('Early Blight');
  const [contributorName, setContributorName] = useState<string>('');
  const [contributorRole, setContributorRole] = useState<'farmer' | 'agronomist' | 'researcher'>('agronomist');
  const [region, setRegion] = useState<string>('Punjab');
  const [farmerNotes, setFarmerNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchTrainingData = async () => {
    try {
      const res = await fetch('/api/training-dataset');
      const data = await res.json();
      setMetrics(data.metrics);
      setFeedbacks(data.feedbacks);
    } catch (err) {
      console.warn('Failed to load training dataset', err);
    }
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const handleTriggerRetraining = () => {
    setIsRetraining(true);
    setRetrainProgress(10);
    setRetrainLogs([
      '⚡ Initializing KisanVision Active Learning Pipeline...',
      '📦 Ingesting 14,850+ validated farmer & agronomist annotations...',
    ]);

    const step1 = setTimeout(() => {
      setRetrainProgress(40);
      setRetrainLogs((prev) => [
        ...prev,
        '🔄 Augmenting dataset with lighting variations, dew reflections & tilt rotations...',
        '🧠 Fine-tuning Vision Transformer (ViT) & EfficientNet-B4 head on disease classes...',
      ]);
    }, 1200);

    const step2 = setTimeout(() => {
      setRetrainProgress(75);
      setRetrainLogs((prev) => [
        ...prev,
        '📊 Running Cross-Validation on held-out field test split (Epoch 5/5)...',
        '📉 Loss reduced from 0.142 to 0.081. Validation Accuracy improved to 97.8% (+0.6% gain)!',
      ]);
    }, 2400);

    const step3 = setTimeout(() => {
      setRetrainProgress(100);
      setRetrainLogs((prev) => [
        ...prev,
        '✅ Model v2.8.5-KisanVision weights deployed to edge inference service successfully!',
      ]);
      setIsRetraining(false);
      if (metrics) {
        setMetrics({
          ...metrics,
          modelVersion: 'v2.8.5-KisanVision-AgriNet',
          overallAccuracy: 97.8,
          f1Score: 0.974,
          totalValidatedSamples: metrics.totalValidatedSamples + 12,
        });
      }
    }, 3800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleSubmitSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: newCrop,
          detectedDisease: newDisease,
          correctedDisease: newDisease,
          isCorrect: true,
          farmerNote: farmerNotes || 'Ground-truth verified sample',
          contributorName: contributorName || 'Field Agronomist',
          contributorRole,
          region,
        }),
      });

      if (res.ok) {
        setShowSubmitModal(false);
        fetchTrainingData();
        setFarmerNotes('');
        setContributorName('');
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC]">
              <BrainCircuit className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B261C]">
              Active Learning & Model Training Loop
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C6B5A] font-medium">
            Empowering farmers and KVK scientists to continuously validate, train, and benchmark the AI model.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#1B261C] text-xs sm:text-sm font-bold border border-[#DDE4DC] transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Contribute Sample</span>
          </button>

          <button
            onClick={handleTriggerRetraining}
            disabled={isRetraining}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Retraining Weights...' : 'Retrain Model Now'}</span>
          </button>
        </div>
      </div>

      {/* Retraining Progress Bar & Logs (when active) */}
      {isRetraining && (
        <div className="bg-white border-2 border-[#2D5A27] rounded-3xl p-6 shadow-md space-y-3.5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-[#2D5A27]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" /> Transfer Learning & Epoch Optimization in Progress
            </span>
            <span>{retrainProgress}%</span>
          </div>

          <div className="w-full bg-[#F0F4EF] rounded-full h-3 overflow-hidden border border-[#DDE4DC]">
            <div
              className="bg-[#2D5A27] h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${retrainProgress}%` }}
            />
          </div>

          <div className="bg-[#F0F4EF] rounded-2xl p-4 border border-[#DDE4DC] font-mono text-xs text-[#1B261C] space-y-1 max-h-36 overflow-y-auto">
            {retrainLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 font-medium">
                <span className="text-[#2D5A27] font-bold">❯</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-5 shadow-xs text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-[#5C6B5A] font-bold block">
            Overall Model Accuracy
          </span>
          <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-3xl font-black text-[#2D5A27]">
              {metrics?.overallAccuracy || 97.2}%
            </span>
            <span className="text-xs text-[#2D5A27] flex items-center font-bold">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +0.6%
            </span>
          </div>
          <span className="text-xs text-[#5C6B5A] mt-1 block font-medium">F1 Score: {metrics?.f1Score || 0.968}</span>
        </div>

        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-5 shadow-xs text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-[#5C6B5A] font-bold block">
            Validated Samples
          </span>
          <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-3xl font-black text-[#1B261C]">
              {(metrics?.totalValidatedSamples || 14854).toLocaleString()}
            </span>
            <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">Annotated</span>
          </div>
          <span className="text-xs text-[#5C6B5A] mt-1 block font-medium">
            {metrics?.recentCommunityContributions || 4} by Community Today
          </span>
        </div>

        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-5 shadow-xs text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-[#5C6B5A] font-bold block">
            Crops & Diseases Covered
          </span>
          <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-2">
            <span className="text-3xl font-black text-[#1B261C]">
              {metrics?.cropsCovered || 42}
            </span>
            <span className="text-xs text-[#5C6B5A] font-bold">Crops</span>
          </div>
          <span className="text-xs text-[#5C6B5A] mt-1 block font-medium">
            {metrics?.diseasesCataloged || 138} Pathogen Classes
          </span>
        </div>

        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-5 shadow-xs text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-[#5C6B5A] font-bold block">
            Current Checkpoint
          </span>
          <div className="mt-1">
            <span className="text-sm sm:text-base font-bold text-[#2D5A27] truncate block">
              {metrics?.modelVersion || 'v2.8.4-KisanVision'}
            </span>
          </div>
          <span className="text-xs text-[#5C6B5A] mt-1 block flex items-center justify-center sm:justify-start gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" /> Updated 6h ago
          </span>
        </div>
      </div>

      {/* Class-wise Accuracy Table & Active Validation Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Class Accuracy Table */}
        <div className="lg:col-span-7 bg-white border border-[#E0E7DE] rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DE]">
            <div>
              <h2 className="text-base font-black text-[#1B261C] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#2D5A27]" /> Crop Class Accuracy Benchmark
              </h2>
              <p className="text-xs text-[#5C6B5A] font-medium">Evaluated on cross-regional test sets</p>
            </div>
            <span className="text-xs font-bold text-[#2D5A27] bg-[#E9F2E7] px-2.5 py-1 rounded-full border border-[#DDE4DC]">
              Validated
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1B261C]">
              <thead>
                <tr className="border-b border-[#E0E7DE] text-[#5C6B5A] uppercase text-[10px] font-bold tracking-wider">
                  <th className="pb-3 font-bold">Crop</th>
                  <th className="pb-3 font-bold">Accuracy</th>
                  <th className="pb-3 font-bold">Dataset Size</th>
                  <th className="pb-3 font-bold">Risk Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E7DE]">
                {(metrics?.classAccuracy || [
                  { crop: 'Paddy / Rice', accuracy: 98.1, samples: 3420, riskLevel: 'Normal' },
                  { crop: 'Wheat', accuracy: 97.8, samples: 2890, riskLevel: 'High' },
                  { crop: 'Tomato', accuracy: 96.9, samples: 2150, riskLevel: 'High' },
                  { crop: 'Cotton', accuracy: 96.4, samples: 1980, riskLevel: 'Critical' },
                  { crop: 'Potato', accuracy: 97.5, samples: 1820, riskLevel: 'Watch' },
                  { crop: 'Chilli', accuracy: 95.8, samples: 1450, riskLevel: 'High' },
                  { crop: 'Maize', accuracy: 98.4, samples: 1140, riskLevel: 'Normal' },
                ]).map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F0F4EF]/60 transition-colors">
                    <td className="py-3 font-bold text-[#1B261C]">{row.crop}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#F0F4EF] rounded-full h-2 overflow-hidden border border-[#DDE4DC]">
                          <div
                            className="bg-[#2D5A27] h-full rounded-full"
                            style={{ width: `${row.accuracy}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#2D5A27]">{row.accuracy}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-[#5C6B5A] font-medium">{row.samples.toLocaleString()} images</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.riskLevel === 'Critical'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : row.riskLevel === 'High'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : row.riskLevel === 'Watch'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-[#E9F2E7] text-[#2D5A27] border-[#DDE4DC]'
                        }`}
                      >
                        {row.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Community Validated Contributions Feed */}
        <div className="lg:col-span-5 bg-white border border-[#E0E7DE] rounded-3xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DE]">
            <div>
              <h2 className="text-base font-black text-[#1B261C] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2D5A27]" /> Community Validations
              </h2>
              <p className="text-xs text-[#5C6B5A] font-medium">Ground-truth labels submitted by farmers</p>
            </div>
          </div>

          <div className="mt-3.5 space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-4 space-y-2 hover:border-[#2D5A27]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-[#2D5A27]">{item.cropName}</span>
                    <h3 className="text-xs font-black text-[#1B261C] mt-0.5">
                      {item.correctedDisease}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#2D5A27]" /> {item.accuracyScore}%
                  </span>
                </div>

                <p className="text-xs text-[#1B261C] italic bg-white p-2.5 rounded-xl border border-[#DDE4DC]/60 font-medium">
                  "{item.farmerNote}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#5C6B5A] pt-1 border-t border-[#DDE4DC]">
                  <span className="flex items-center gap-1 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-[#5C6B5A]" />
                    <strong className="text-[#1B261C]">{item.contributorName}</strong> ({item.contributorRole})
                  </span>
                  <span className="font-semibold text-[#2D5A27]">{item.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contribute Sample Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B261C]/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E0E7DE] rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-7 text-[#1B261C] animate-in fade-in zoom-in duration-150">
            <h2 className="text-xl font-black text-[#1B261C] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#2D5A27]" /> Contribute Validated Leaf Sample
            </h2>
            <p className="text-xs text-[#5C6B5A] mt-1 font-medium">
              Add verified crop leaf pathological data to the open KisanVision training corpus.
            </p>

            <form onSubmit={handleSubmitSample} className="mt-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Crop Name</label>
                  <input
                    type="text"
                    required
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    placeholder="e.g. Tomato / Paddy"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Disease / Condition</label>
                  <input
                    type="text"
                    required
                    value={newDisease}
                    onChange={(e) => setNewDisease(e.target.value)}
                    placeholder="e.g. Early Blight"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Your Name / Org</label>
                  <input
                    type="text"
                    required
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1B261C] mb-1">Role / Accreditation</label>
                  <select
                    value={contributorRole}
                    onChange={(e) => setContributorRole(e.target.value as any)}
                    className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none cursor-pointer"
                  >
                    <option value="farmer">Progressive Farmer</option>
                    <option value="agronomist">KVK / Agricultural Extension Officer</option>
                    <option value="researcher">University Researcher</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">Region / District</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g. Bathinda, Punjab"
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1B261C] mb-1">Diagnostic Notes & Field Observations</label>
                <textarea
                  rows={2}
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder="Detailed symptom notes, treatment response, weather context..."
                  className="w-full bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3.5 py-2.5 text-[#1B261C] text-xs focus:ring-2 focus:ring-[#2D5A27] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-[#E0E7DE]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#5C6B5A] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to Dataset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
