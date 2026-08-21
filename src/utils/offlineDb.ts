import { OfflineDiseaseItem, DiagnosisResultData } from '../types';

export const OFFLINE_DISEASE_CATALOG: OfflineDiseaseItem[] = [
  {
    id: 'off-1',
    crop: 'Tomato',
    disease: 'Early Blight (Alternaria solani)',
    symptoms: 'Target-like brown concentric rings on older leaves with yellow halos.',
    organicRemedy: 'Neem oil (5ml/L) + liquid soap spray, or Sour buttermilk copper decoction every 7 days.',
    dosage: '5 ml / Litre water',
    pathogen: 'Fungal',
    severity: 'Moderate',
    imagePlaceholder: '🍅',
  },
  {
    id: 'off-2',
    crop: 'Tomato',
    disease: 'Late Blight (Phytophthora infestans)',
    symptoms: 'Water-soaked greasy dark lesions with white fungal downy mold under leaf surfaces.',
    organicRemedy: 'Trichoderma harzianum soil drenching + 0.5% Bordeaux mixture / Copper oxychloride.',
    dosage: '2.5g / Litre water',
    pathogen: 'Fungal',
    severity: 'Critical',
    imagePlaceholder: '🍅',
  },
  {
    id: 'off-3',
    crop: 'Paddy / Rice',
    disease: 'Rice Blast (Magnaporthe oryzae)',
    symptoms: 'Spindle/diamond-shaped lesions with gray centers and reddish-brown borders.',
    organicRemedy: 'Pseudomonas fluorescens foliar spray + Fermented cow urine decoction (Neemastra).',
    dosage: '10g / Litre water',
    pathogen: 'Fungal',
    severity: 'Critical',
    imagePlaceholder: '🌾',
  },
  {
    id: 'off-4',
    crop: 'Paddy / Rice',
    disease: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
    symptoms: 'Wavy yellowish-green margins turning straw-colored starting from leaf tips.',
    organicRemedy: 'Fresh cow dung extract (20%) supernatant spray + Plant ash dusting on dew.',
    dosage: '200g cow dung stirred in 10L water, strained',
    pathogen: 'Bacterial',
    severity: 'High',
    imagePlaceholder: '🌾',
  },
  {
    id: 'off-5',
    crop: 'Wheat',
    disease: 'Yellow Stripe Rust (Puccinia striiformis)',
    symptoms: 'Parallel linear lines of bright yellow powdery fungal spores along leaf veins.',
    organicRemedy: 'Sour fermented buttermilk (khatta lassi) fermented with copper wire (5L in 100L water).',
    dosage: '50 ml / Litre water',
    pathogen: 'Fungal',
    severity: 'High',
    imagePlaceholder: '🌾',
  },
  {
    id: 'off-6',
    crop: 'Cotton',
    disease: 'Cotton Leaf Curl Virus (CLCuV)',
    symptoms: 'Upward leaf curling, thick veins, enations on leaf underside spread by whitefly.',
    organicRemedy: 'Agniastra (chilli-garlic-neem in cow urine) + Yellow sticky traps (10/acre).',
    dosage: '20 ml / Litre water',
    pathogen: 'Viral',
    severity: 'High',
    imagePlaceholder: '🌿',
  },
  {
    id: 'off-7',
    crop: 'Potato',
    disease: 'Black Scurf & Stem Canker (Rhizoctonia)',
    symptoms: 'Dark brown hard sclerotia on tubers, aerial tubering and wilting foliage.',
    organicRemedy: 'Seed tuber treatment with Trichoderma viride + Crop rotation with legumes.',
    dosage: '10g / kg tuber seed',
    pathogen: 'Fungal',
    severity: 'Moderate',
    imagePlaceholder: '🥔',
  },
  {
    id: 'off-8',
    crop: 'Chilli',
    disease: 'Anthracnose & Dieback (Colletotrichum)',
    symptoms: 'Sunken necrotic spots on fruit and dark tip-dieback on twigs and leaves.',
    organicRemedy: 'Panchagavya (3%) foliar spray + Neem cake soil application at planting.',
    dosage: '30 ml Panchagavya / Litre water',
    pathogen: 'Fungal',
    severity: 'High',
    imagePlaceholder: '🌶️',
  },
  {
    id: 'off-9',
    crop: 'Maize / Corn',
    disease: 'Fall Armyworm (Spodoptera frugiperda)',
    symptoms: 'Window-paning of young leaves, sawdust-like frass in leaf whorl.',
    organicRemedy: 'Sand + Wood ash + dry neem seed powder poured directly into the central plant whorl.',
    dosage: '1 teaspoon per plant whorl',
    pathogen: 'Pest/Insect',
    severity: 'Critical',
    imagePlaceholder: '🌽',
  },
  {
    id: 'off-10',
    crop: 'Sugarcane',
    disease: 'Red Rot (Colletotrichum falcatum)',
    symptoms: 'Third or fourth leaf wilting and drying; split cane shows red interior with white cross patches.',
    organicRemedy: 'Sett treatment with Trichoderma viride @ 20g/L water for 30 mins before planting.',
    dosage: 'Dip sets for 30 minutes',
    pathogen: 'Fungal',
    severity: 'Critical',
    imagePlaceholder: '🎋',
  },
  {
    id: 'off-11',
    crop: 'Groundnut / Peanut',
    disease: 'Tikka Leaf Spot (Cercospora personata)',
    symptoms: 'Small, circular dark brown to black spots with bright yellow rings on leaves.',
    organicRemedy: 'Neem seed kernel extract (NSKE 5%) + Wood ash dusting on morning dew.',
    dosage: '50 ml / Litre water',
    pathogen: 'Fungal',
    severity: 'Moderate',
    imagePlaceholder: '🥜',
  },
  {
    id: 'off-12',
    crop: 'Citrus / Lemon',
    disease: 'Citrus Canker (Xanthomonas citri)',
    symptoms: 'Raised, corky, crater-like lesions with yellow halos on leaves, twigs, and fruit.',
    organicRemedy: 'Prune infected twigs before monsoon + Copper hydroxide / Streptocycline alternative.',
    dosage: 'Prune 10cm below lesion',
    pathogen: 'Bacterial',
    severity: 'Moderate',
    imagePlaceholder: '🍋',
  },
];

const SCAN_QUEUE_KEY = 'kisandrishti_offline_scans_v1';
const HISTORY_KEY = 'kisandrishti_scan_history_v1';

export interface OfflinePendingScan {
  id: string;
  timestamp: string;
  imageBase64: string;
  cropHint: string;
  notes: string;
  synced: boolean;
}

export function saveOfflineScan(imageBase64: string, cropHint: string, notes: string): OfflinePendingScan {
  const scans: OfflinePendingScan[] = getOfflineScans();
  const newScan: OfflinePendingScan = {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageBase64,
    cropHint,
    notes,
    synced: false,
  };
  scans.unshift(newScan);
  try {
    localStorage.setItem(SCAN_QUEUE_KEY, JSON.stringify(scans.slice(0, 50)));
  } catch (e) {
    console.warn('LocalStorage quota exceeded for offline scans');
  }
  return newScan;
}

export function getOfflineScans(): OfflinePendingScan[] {
  try {
    const raw = localStorage.getItem(SCAN_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeOfflineScan(id: string) {
  const scans = getOfflineScans().filter((s) => s.id !== id);
  localStorage.setItem(SCAN_QUEUE_KEY, JSON.stringify(scans));
}

export function saveDiagnosisToHistory(diagnosis: DiagnosisResultData) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: DiagnosisResultData[] = raw ? JSON.parse(raw) : [];
    // Keep image thumbnail compact to save storage
    const compactItem = {
      ...diagnosis,
      timestamp: diagnosis.timestamp || new Date().toISOString(),
    };
    history.unshift(compactItem);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 25)));
  } catch (e) {
    console.warn('Failed to save diagnosis history', e);
  }
}

export function getDiagnosisHistory(): DiagnosisResultData[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
