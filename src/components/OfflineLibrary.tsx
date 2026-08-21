import React, { useState, useEffect } from 'react';
import {
  WifiOff,
  Database,
  RefreshCw,
  Search,
  BookOpen,
  Volume2,
  CheckCircle2,
  Trash2,
  Leaf,
  History,
} from 'lucide-react';
import {
  OFFLINE_DISEASE_CATALOG,
  getOfflineScans,
  removeOfflineScan,
  getDiagnosisHistory,
  OfflinePendingScan,
} from '../utils/offlineDb';
import { OfflineDiseaseItem, DiagnosisResultData, LanguageCode } from '../types';
import { globalVoiceController } from '../utils/speech';

interface OfflineLibraryProps {
  currentLang: LanguageCode;
  onSyncScan: (scan: OfflinePendingScan) => void;
}

export const OfflineLibrary: React.FC<OfflineLibraryProps> = ({
  currentLang,
  onSyncScan,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [pendingScans, setPendingScans] = useState<OfflinePendingScan[]>([]);
  const [history, setHistory] = useState<DiagnosisResultData[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'queue' | 'history'>('catalog');

  const refreshOfflineData = () => {
    setPendingScans(getOfflineScans());
    setHistory(getDiagnosisHistory());
  };

  useEffect(() => {
    refreshOfflineData();
  }, []);

  const handlePlayAudio = (item: OfflineDiseaseItem) => {
    const text = `${item.crop}. ${item.disease}. Symptoms: ${item.symptoms}. Organic Remedy: ${item.organicRemedy}. Dosage: ${item.dosage}.`;
    globalVoiceController.speak(text, currentLang);
  };

  const handleDeletePendingScan = (id: string) => {
    removeOfflineScan(id);
    refreshOfflineData();
  };

  const filteredCatalog = OFFLINE_DISEASE_CATALOG.filter((item) => {
    const matchesCrop = selectedCrop === 'All' || item.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200">
              <WifiOff className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1B261C]">
              Offline Disease Guide & Field Sync Queue
            </h1>
          </div>
          <p className="mt-1.5 text-xs sm:text-sm text-[#5C6B5A] font-medium">
            Access 30+ crop pathology guides and manage scans captured in remote fields with zero internet connectivity.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-[#F0F4EF] p-1.5 rounded-2xl border border-[#DDE4DC] text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'catalog'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C]'
            }`}
          >
            Offline Encyclopedia ({OFFLINE_DISEASE_CATALOG.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C]'
            }`}
          >
            <span>Field Queue</span>
            {pendingScans.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                {pendingScans.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-colors ${
              activeTab === 'history'
                ? 'bg-[#2D5A27] text-white shadow-xs'
                : 'text-[#5C6B5A] hover:text-[#1B261C]'
            }`}
          >
            Scan History
          </button>
        </div>
      </div>

      {/* 1. Offline Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-[#5C6B5A] absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search offline diseases, symptoms, crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E0E7DE] rounded-2xl pl-10 pr-4 py-3 text-[#1B261C] placeholder-[#5C6B5A] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] font-medium shadow-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-white border border-[#E0E7DE] rounded-2xl px-3.5 py-3 text-[#1B261C] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] font-semibold cursor-pointer shadow-xs"
              >
                <option value="All">All Crops</option>
                <option value="Tomato">Tomato</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Potato">Potato</option>
                <option value="Chilli">Chilli</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Citrus">Citrus / Lemon</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E0E7DE] rounded-3xl p-6 shadow-xs space-y-3 hover:border-[#2D5A27]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.imagePlaceholder}</span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        item.severity === 'Critical'
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : item.severity === 'High'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#2D5A27]">{item.crop}</span>
                    <h3 className="text-base font-black text-[#1B261C] mt-0.5">{item.disease}</h3>
                  </div>

                  <div className="space-y-2 text-xs text-[#5C6B5A]">
                    <div>
                      <span className="text-[11px] font-bold text-[#1B261C] block">Symptoms:</span>
                      <p className="mt-0.5 leading-relaxed">{item.symptoms}</p>
                    </div>

                    <div className="bg-[#F0F4EF] p-3 rounded-2xl border border-[#DDE4DC] space-y-1">
                      <span className="text-[11px] font-bold text-[#2D5A27] block">
                        🌿 Organic Remedy:
                      </span>
                      <p className="text-[#1B261C] font-medium leading-relaxed">{item.organicRemedy}</p>
                      <span className="text-[10px] text-amber-800 font-bold block pt-1">
                        Dosage: {item.dosage}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#E0E7DE] flex justify-end">
                  <button
                    onClick={() => handlePlayAudio(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#2D5A27] text-xs font-bold transition-colors border border-[#DDE4DC]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen Offline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Field Queue Tab */}
      {activeTab === 'queue' && (
        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DE]">
            <div>
              <h2 className="text-base font-black text-[#1B261C] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#2D5A27]" /> Offline Scans Awaiting Cloud Sync
              </h2>
              <p className="text-xs text-[#5C6B5A] font-medium">
                Photos taken in zero-connectivity field zones will automatically process when online.
              </p>
            </div>
          </div>

          {pendingScans.length === 0 ? (
            <div className="py-12 text-center text-[#5C6B5A] space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#2D5A27] mx-auto opacity-80" />
              <p className="text-base font-black text-[#1B261C]">No Pending Field Scans</p>
              <p className="text-xs">All leaf scans have been synced with the cloud server.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingScans.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-white overflow-hidden border border-[#DDE4DC] shrink-0">
                      <img
                        src={scan.imageBase64}
                        alt="Queued leaf"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#2D5A27]">
                        {scan.cropHint || 'Auto Crop'}
                      </span>
                      <p className="text-[11px] text-[#5C6B5A] font-medium">
                        Captured on {new Date(scan.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSyncScan(scan)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2D5A27] hover:bg-[#23471f] text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync & Diagnose</span>
                    </button>

                    <button
                      onClick={() => handleDeletePendingScan(scan.id)}
                      className="p-2 rounded-xl text-[#5C6B5A] hover:text-red-600 hover:bg-white transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E7DE]">
            <div>
              <h2 className="text-base font-black text-[#1B261C] flex items-center gap-2">
                <History className="w-5 h-5 text-[#2D5A27]" /> Recent Diagnostic Reports
              </h2>
              <p className="text-xs text-[#5C6B5A] font-medium">Locally saved field diagnoses for quick review</p>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="py-12 text-center text-[#5C6B5A] space-y-2">
              <Leaf className="w-12 h-12 text-[#2D5A27]/40 mx-auto" />
              <p className="text-base font-black text-[#1B261C]">No Diagnosis History Found</p>
              <p className="text-xs">Scan or test sample leaves to build your farm diagnostic history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#2D5A27]">{item.cropName}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#1B261C] border border-[#DDE4DC] font-bold">
                        {item.severityLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#1B261C] mt-0.5">{item.diseaseName}</h3>
                    <p className="text-xs text-[#5C6B5A] mt-0.5 font-medium">{item.quickSummary}</p>
                  </div>

                  <span className="text-[11px] text-[#5C6B5A] font-semibold whitespace-nowrap">
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
