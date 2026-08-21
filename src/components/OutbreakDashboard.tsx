import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  Thermometer,
  Droplets,
  Wind,
  MapPin,
  Volume2,
  Bell,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { OutbreakAlert, LanguageCode } from '../types';
import { globalVoiceController } from '../utils/speech';

interface OutbreakDashboardProps {
  currentLang: LanguageCode;
  onSimulateAlert: (title: string, msg: string, type: 'pest_alert' | 'weather') => void;
}

export const OutbreakDashboard: React.FC<OutbreakDashboardProps> = ({
  currentLang,
  onSimulateAlert,
}) => {
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>([]);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [activeCropFilter, setActiveCropFilter] = useState<string>('All');
  const [weatherData, setWeatherData] = useState({
    humidity: '84%',
    temperature: '29°C',
    rainfallChance: '65%',
    windSpeed: '12 km/h',
    riskSummary: 'High Fungal Spore Germination Window (80%+ Humidity & Warm Nights)',
  });

  useEffect(() => {
    fetch('/api/regional-outbreaks')
      .then((res) => res.json())
      .then((data) => {
        if (data.outbreaks) {
          setOutbreaks(data.outbreaks);
        }
      })
      .catch((e) => console.warn(e));
  }, []);

  const handlePlayOutbreakAudio = (audioText: string) => {
    globalVoiceController.speak(audioText, currentLang);
  };

  const filteredOutbreaks = outbreaks.filter((ob) => {
    const matchState = selectedState === 'All' || ob.state.toLowerCase().includes(selectedState.toLowerCase());
    const matchCrop = activeCropFilter === 'All' || ob.crop.toLowerCase().includes(activeCropFilter.toLowerCase());
    return matchState && matchCrop;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Weather Risk Widget */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-[#E0E7DE]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-2xl bg-red-100 text-red-700 border border-red-200">
                <ShieldAlert className="w-6 h-6" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1B261C]">
                Regional Outbreak & Weather Risk Radar
              </h1>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#5C6B5A] font-medium">
              Live disease trajectory tracking, humidity spore indexes, and timely district push alerts.
            </p>
          </div>

          {/* Simulate Push Alert Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onSimulateAlert(
                  '🚨 Yellow Rust Outbreak Alert (Punjab & Haryana)',
                  'Night dew >90% RH with 12°C temperature has triggered high Yellow Rust sporulation risk in wheat belts. Inspect lower leaves immediately.',
                  'pest_alert'
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              <Bell className="w-4 h-4" />
              <span>Simulate Threat Alert</span>
            </button>
          </div>
        </div>

        {/* Real-time Weather & Risk Matrix */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3.5 text-xs">
          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">Relative Humidity</span>
              <span className="text-xl font-black text-blue-800">{weatherData.humidity}</span>
              <span className="text-[10px] text-red-700 font-black block">Fungal Risk High</span>
            </div>
          </div>

          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 border border-amber-200">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">Temperature</span>
              <span className="text-xl font-black text-amber-800">{weatherData.temperature}</span>
              <span className="text-[10px] text-[#2D5A27] font-bold block">Normal Growth</span>
            </div>
          </div>

          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 border border-sky-200">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">Rain Probability</span>
              <span className="text-xl font-black text-sky-800">{weatherData.rainfallChance}</span>
              <span className="text-[10px] text-[#5C6B5A] font-medium block">Afternoon showers</span>
            </div>
          </div>

          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#E9F2E7] text-[#2D5A27] border border-[#DDE4DC]">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">Wind & Dispersal</span>
              <span className="text-xl font-black text-[#2D5A27]">{weatherData.windSpeed}</span>
              <span className="text-[10px] text-[#5C6B5A] font-medium block">Low Spore Drift</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2.5 font-medium">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-bold">Agro-Meteorological Advisory:</strong> {weatherData.riskSummary}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#E0E7DE] text-xs shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="font-bold text-[#5C6B5A] uppercase text-[10px] tracking-wider whitespace-nowrap">
            Filter Region:
          </span>
          {['All', 'Punjab', 'Maharashtra', 'Uttar Pradesh', 'Andhra', 'Bengal'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
                selectedState === st
                  ? 'bg-[#2D5A27] text-white shadow-xs'
                  : 'bg-[#F0F4EF] text-[#1B261C] hover:bg-[#E3ECE1]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#5C6B5A] font-bold">Crop:</span>
          <select
            value={activeCropFilter}
            onChange={(e) => setActiveCropFilter(e.target.value)}
            className="bg-[#F0F4EF] border border-[#DDE4DC] rounded-xl px-3 py-1.5 text-[#1B261C] font-semibold focus:outline-none cursor-pointer"
          >
            <option value="All">All Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Cotton">Cotton</option>
            <option value="Tomato">Tomato</option>
            <option value="Chilli">Chilli</option>
            <option value="Paddy">Paddy / Rice</option>
          </select>
        </div>
      </div>

      {/* Outbreak Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOutbreaks.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white border rounded-3xl p-6 shadow-xs space-y-3.5 transition-all hover:border-[#2D5A27]/40 ${
              alert.severity === 'Critical Alert'
                ? 'border-red-300 ring-1 ring-red-100'
                : alert.severity === 'High Alert'
                ? 'border-amber-300'
                : 'border-[#E0E7DE]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2D5A27] shrink-0" />
                  <span className="text-xs font-bold text-[#1B261C]">{alert.state}</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#E9F2E7] text-[#2D5A27] font-bold border border-[#DDE4DC]">
                    {alert.crop}
                  </span>
                </div>
                <h3 className="text-lg font-black text-[#1B261C] mt-1.5">{alert.threat}</h3>
              </div>

              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                  alert.severity === 'Critical Alert'
                    ? 'bg-red-100 text-red-800 border-red-200'
                    : alert.severity === 'High Alert'
                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}
              >
                {alert.severity}
              </span>
            </div>

            {/* Affected Districts */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-[#5C6B5A] font-bold">Hotspot Districts:</span>
              {alert.affectedDistricts.map((d, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg bg-[#F0F4EF] text-[#1B261C] border border-[#DDE4DC] text-[11px] font-semibold"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Trigger Factor */}
            <div className="bg-[#F0F4EF] p-3.5 rounded-2xl border border-[#DDE4DC] text-xs space-y-1">
              <span className="text-[#5C6B5A] block text-[10px] uppercase font-bold">
                Environmental Trigger:
              </span>
              <p className="text-[#1B261C] font-medium">{alert.triggerFactor}</p>
            </div>

            {/* Recommended Action */}
            <div className="text-xs space-y-1">
              <span className="text-[#2D5A27] font-bold">Immediate Advisory Action:</span>
              <p className="text-[#5C6B5A] leading-relaxed font-medium">{alert.recommendedAction}</p>
            </div>

            {/* Listen Audio Button */}
            <div className="pt-2 border-t border-[#E0E7DE] flex justify-end">
              <button
                onClick={() => handlePlayOutbreakAudio(alert.farmerAdvisoryAudio || alert.recommendedAction)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0F4EF] hover:bg-[#E3ECE1] text-[#2D5A27] text-xs font-bold transition-colors border border-[#DDE4DC]"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen Audio Advisory</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal Pest Calendar Guide */}
      <div className="bg-white border border-[#E0E7DE] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-[#1B261C] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D5A27]" /> Seasonal Crop Vulnerability Calendar
            </h2>
            <p className="text-xs text-[#5C6B5A] font-medium">Pest and disease probability by crop lifecycle stages</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] space-y-2">
            <span className="font-bold text-amber-800 block text-sm">Kharif (Monsoon Season)</span>
            <ul className="space-y-1.5 text-[#1B261C] font-medium">
              <li>• Paddy: Rice Blast, Sheath Blight & BPH</li>
              <li>• Cotton: Whitefly, Jassids, Leaf Curl Virus</li>
              <li>• Soybean: Yellow Mosaic Virus & Rust</li>
            </ul>
          </div>

          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] space-y-2">
            <span className="font-bold text-[#2D5A27] block text-sm">Rabi (Winter Season)</span>
            <ul className="space-y-1.5 text-[#1B261C] font-medium">
              <li>• Wheat: Yellow & Brown Rust, Loose Smut</li>
              <li>• Potato/Tomato: Early & Late Blight</li>
              <li>• Mustard: White Rust & Aphid Infestation</li>
            </ul>
          </div>

          <div className="bg-[#F0F4EF] p-4 rounded-2xl border border-[#DDE4DC] space-y-2">
            <span className="font-bold text-sky-800 block text-sm">Zaid (Summer Season)</span>
            <ul className="space-y-1.5 text-[#1B261C] font-medium">
              <li>• Vegetables: Powdery Mildew, Mites & Thrips</li>
              <li>• Pulses (Moong/Urad): Leaf Crinkle & Root Rot</li>
              <li>• Cucurbits: Downy Mildew & Fruit Fly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
