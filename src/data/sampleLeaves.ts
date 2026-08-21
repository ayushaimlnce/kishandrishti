import { SampleLeaf } from '../types';

// High-fidelity SVG Leaf Image Generators for Instant Testing
function createLeafSvgDataUri(type: 'tomato_early_blight' | 'wheat_rust' | 'cotton_curl' | 'paddy_blast' | 'potato_late_blight' | 'chilli_curl' | 'healthy_paddy'): string {
  let innerSvg = '';

  if (type === 'tomato_early_blight') {
    innerSvg = `
      <defs>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="60%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <!-- Background Leaf Shape -->
      <path d="M 200 40 C 290 80, 340 180, 310 290 C 270 380, 180 430, 200 490 C 120 440, 50 350, 60 250 C 70 140, 130 60, 200 40 Z" fill="url(#leafGrad)" stroke="#166534" stroke-width="4"/>
      <!-- Main Veins -->
      <path d="M 200 40 Q 195 260 200 490" stroke="#86efac" stroke-width="5" fill="none"/>
      <path d="M 197 140 Q 250 170 300 190" stroke="#86efac" stroke-width="3" fill="none"/>
      <path d="M 198 220 Q 140 250 80 270" stroke="#86efac" stroke-width="3" fill="none"/>
      <path d="M 198 310 Q 260 340 290 370" stroke="#86efac" stroke-width="3" fill="none"/>
      <!-- Target Board Rings (Early Blight Lesion 1) -->
      <circle cx="240" cy="210" r="38" fill="#fef08a" opacity="0.85" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="240" cy="210" r="28" fill="#78350f" opacity="0.9"/>
      <circle cx="240" cy="210" r="20" fill="none" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="240" cy="210" r="12" fill="#451a03"/>
      <circle cx="240" cy="210" r="5" fill="#1c1917"/>
      <!-- Lesion 2 -->
      <circle cx="130" cy="310" r="32" fill="#fef08a" opacity="0.8" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="130" cy="310" r="24" fill="#78350f" opacity="0.9"/>
      <circle cx="130" cy="310" r="16" fill="none" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="130" cy="310" r="8" fill="#451a03"/>
      <!-- Marginal chlorosis -->
      <path d="M 290 280 Q 320 330 280 380 Q 260 330 290 280" fill="#eab308" opacity="0.75"/>
    `;
  } else if (type === 'wheat_rust') {
    innerSvg = `
      <defs>
        <linearGradient id="wheatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <!-- Slender Wheat Blade -->
      <path d="M 170 30 C 230 180, 240 340, 210 500 C 180 500, 160 340, 150 180 Z" fill="url(#wheatGrad)" stroke="#166534" stroke-width="3"/>
      <path d="M 185 30 L 195 500" stroke="#bbf7d0" stroke-width="3" fill="none"/>
      <!-- Yellow Rust Stripe Pustules -->
      <line x1="175" y1="120" x2="175" y2="380" stroke="#eab308" stroke-width="6" stroke-dasharray="8 4"/>
      <line x1="182" y1="90" x2="182" y2="420" stroke="#f59e0b" stroke-width="7" stroke-dasharray="10 5"/>
      <line x1="205" y1="150" x2="205" y2="400" stroke="#eab308" stroke-width="6" stroke-dasharray="8 4"/>
      <line x1="215" y1="200" x2="215" y2="360" stroke="#d97706" stroke-width="5" stroke-dasharray="6 3"/>
      <!-- Chlorotic yellow bands -->
      <rect x="160" y="220" width="65" height="120" fill="#fde047" opacity="0.35" rx="10"/>
    `;
  } else if (type === 'cotton_curl') {
    innerSvg = `
      <defs>
        <linearGradient id="cottonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="100%" stop-color="#14532d"/>
        </linearGradient>
      </defs>
      <!-- Multi-lobed Palmate Cotton Leaf with Upward Cupping distortion -->
      <path d="M 200 70 Q 250 140 330 130 Q 300 220 370 290 Q 280 310 290 410 Q 200 370 190 470 Q 180 370 110 410 Q 120 310 40 280 Q 100 220 70 130 Q 150 140 200 70 Z" fill="url(#cottonGrad)" stroke="#052e16" stroke-width="4"/>
      <!-- Prominently swollen veins -->
      <path d="M 195 460 Q 198 250 200 70" stroke="#ecfdf5" stroke-width="8" fill="none"/>
      <path d="M 198 260 Q 270 200 340 140" stroke="#ecfdf5" stroke-width="7" fill="none"/>
      <path d="M 198 260 Q 130 200 60 140" stroke="#ecfdf5" stroke-width="7" fill="none"/>
      <path d="M 198 320 Q 270 300 350 300" stroke="#ecfdf5" stroke-width="6" fill="none"/>
      <path d="M 198 320 Q 130 300 50 290" stroke="#ecfdf5" stroke-width="6" fill="none"/>
      <!-- Enation bumps on lower lobes -->
      <ellipse cx="250" cy="240" rx="14" ry="10" fill="#a7f3d0" stroke="#047857" stroke-width="2"/>
      <ellipse cx="140" cy="250" rx="12" ry="9" fill="#a7f3d0" stroke="#047857" stroke-width="2"/>
      <!-- Curled crumpled margin shadow -->
      <path d="M 330 130 C 350 170, 370 240, 365 285" stroke="#064e3b" stroke-width="12" fill="none" opacity="0.6"/>
    `;
  } else if (type === 'paddy_blast') {
    innerSvg = `
      <defs>
        <linearGradient id="paddyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#86efac"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <!-- Rice blade -->
      <path d="M 200 30 C 260 160, 270 340, 230 490 C 170 490, 140 340, 150 160 Z" fill="url(#paddyGrad)" stroke="#14532d" stroke-width="3"/>
      <path d="M 200 30 L 205 490" stroke="#bbf7d0" stroke-width="3" fill="none"/>
      <!-- Diamond Spindle Blast Lesion 1 -->
      <path d="M 205 180 Q 235 220 205 260 Q 175 220 205 180 Z" fill="#9ca3af" stroke="#7f1d1d" stroke-width="3"/>
      <ellipse cx="205" cy="220" rx="6" ry="12" fill="#374151"/>
      <path d="M 205 170 Q 245 220 205 270 Q 165 220 205 170 Z" fill="none" stroke="#facc15" stroke-width="2" opacity="0.8"/>
      <!-- Diamond Spindle Blast Lesion 2 -->
      <path d="M 185 310 Q 210 345 185 380 Q 160 345 185 310 Z" fill="#9ca3af" stroke="#7f1d1d" stroke-width="3"/>
      <ellipse cx="185" cy="345" rx="5" ry="10" fill="#374151"/>
    `;
  } else if (type === 'potato_late_blight') {
    innerSvg = `
      <defs>
        <linearGradient id="potatoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <path d="M 200 50 C 300 90, 330 220, 290 330 C 250 420, 180 440, 190 490 C 130 440, 70 380, 80 260 C 90 140, 140 70, 200 50 Z" fill="url(#potatoGrad)" stroke="#166534" stroke-width="4"/>
      <!-- Water-soaked necrotic rotting margins -->
      <path d="M 280 160 Q 320 240 270 320 Q 230 270 240 200 Q 250 160 280 160 Z" fill="#3f2e1a" stroke="#713f12" stroke-width="3"/>
      <path d="M 90 220 Q 130 250 120 320 Q 70 310 90 220 Z" fill="#3f2e1a" stroke="#713f12" stroke-width="2"/>
      <!-- White downy mold halo -->
      <path d="M 235 195 Q 225 260 265 310" stroke="#f3f4f6" stroke-width="4" stroke-dasharray="4 2" fill="none"/>
    `;
  } else {
    // Healthy Paddy
    innerSvg = `
      <defs>
        <linearGradient id="healthyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#16a34a"/>
        </linearGradient>
      </defs>
      <path d="M 200 40 C 280 120, 310 260, 280 380 C 240 450, 180 460, 190 490 C 140 450, 90 380, 100 260 C 110 140, 150 70, 200 40 Z" fill="url(#healthyGrad)" stroke="#15803d" stroke-width="4"/>
      <path d="M 197 40 Q 195 260 190 490" stroke="#bbf7d0" stroke-width="4" fill="none"/>
      <path d="M 197 160 Q 250 190 290 230" stroke="#bbf7d0" stroke-width="2.5" fill="none"/>
      <path d="M 197 250 Q 140 280 110 320" stroke="#bbf7d0" stroke-width="2.5" fill="none"/>
    `;
  }

  const svgFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="400" height="520">
    <rect width="100%" height="100%" fill="#061c12"/>
    <!-- Farm Grid Background -->
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0d3322" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    ${innerSvg}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgFull)}`;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-tomato-early-blight',
    cropName: 'Tomato',
    diseaseName: 'Early Blight (Alternaria solani)',
    severity: 'Moderate',
    thumbnailUrl: createLeafSvgDataUri('tomato_early_blight'),
    description: 'Concentric rings with yellow halo on lower tomato foliage.',
    category: 'Fungal',
    fullData: {
      cropName: 'Tomato (Solanum lycopersicum)',
      isHealthy: false,
      diseaseName: 'Early Blight',
      scientificName: 'Alternaria solani',
      pathogenType: 'Fungal',
      severityLevel: 'Moderate',
      affectedAreaPercent: 32,
      confidenceScore: 98.4,
      quickSummary: 'Early Blight identified on tomato leaf. Concentric target-board rings on mature foliage.',
      translatedSummary: 'टमाटर में अगेती झुलसा (Early Blight) के लक्षण हैं। पत्तियों पर छल्लेदार धब्बे हैं।',
      symptoms: [
        'Concentric dark brown circular spots resembling a target board.',
        'Surrounding chlorotic yellow tissue causing premature defoliation.',
        'Progresses from lower canopy upwards.'
      ],
      visualMarkers: [
        { label: 'Target-board Ring', box: [25, 45, 52, 75], color: '#ef4444' },
        { label: 'Chlorotic Zone', box: [50, 18, 75, 48], color: '#f59e0b' }
      ],
      environmentalTriggers: 'High humidity (>80%), warm temperatures (24-28°C), and rain splash.',
      organicRemedies: [
        {
          title: 'Neem Oil (10,000 ppm) + Liquid Soap Emulsion',
          dosage: '5 ml Neem oil + 1 ml liquid soap per Liter water',
          preparation: 'Mix neem oil with soap in warm water, then stir into the knapsack tank.',
          applicationMethod: 'Foliar spray under and over leaf surfaces.',
          frequency: 'Repeat every 7 days'
        },
        {
          title: 'Sour Fermented Buttermilk & Copper Decoction',
          dosage: '1 Liter sour buttermilk in 10 Liters water',
          preparation: 'Ferment buttermilk in a copper pot for 5 days till greenish film develops.',
          applicationMethod: 'Fine mist spray in morning.',
          frequency: 'Once every 10 days'
        }
      ],
      biologicalControls: [
        'Apply Trichoderma harzianum @ 5g/L as a bio-agent against fungal spores.',
        'Use Bacillus subtilis foliar spray.'
      ],
      chemicalTreatment: {
        chemicalName: 'Mancozeb 75% WP or Copper Oxychloride 50% WP',
        dosage: '2.5 grams per Liter water',
        waitingPeriod: '7 days before harvest',
        safetyWarning: 'Wear mask and protective clothing. Do not spray in extreme heat.'
      },
      preventivePractices: [
        'Prune lower 30cm leaves touching the wet soil.',
        'Use drip irrigation instead of overhead sprinklers.',
        'Mulch soil bed with clean straw.'
      ],
      voiceAudioScript: 'Tomato Early Blight identified. Prune infected bottom leaves and spray 5 ml neem oil per liter water.'
    }
  },
  {
    id: 'sample-wheat-yellow-rust',
    cropName: 'Wheat',
    diseaseName: 'Yellow Stripe Rust',
    severity: 'High',
    thumbnailUrl: createLeafSvgDataUri('wheat_rust'),
    description: 'Parallel lines of bright yellow-orange powdery pustules.',
    category: 'Fungal',
    fullData: {
      cropName: 'Wheat (Triticum aestivum)',
      isHealthy: false,
      diseaseName: 'Yellow Stripe Rust',
      scientificName: 'Puccinia striiformis',
      pathogenType: 'Fungal',
      severityLevel: 'High',
      affectedAreaPercent: 46,
      confidenceScore: 97.6,
      quickSummary: 'Yellow stripe rust detected. Continuous yellow spore stripes along leaf veins.',
      translatedSummary: 'गेहूं में पीला रतुआ (Yellow Rust) पाया गया है। पत्तियों पर पीली धारियां हैं।',
      symptoms: [
        'Yellowish-orange powdery pustules arranged in parallel lines.',
        'Rapid chlorosis and tissue drying leading to poor grain development.'
      ],
      visualMarkers: [
        { label: 'Rust Stripe Pustules', box: [18, 38, 70, 62], color: '#eab308' },
        { label: 'Chlorotic Zone', box: [40, 32, 75, 68], color: '#f97316' }
      ],
      environmentalTriggers: 'Night temperatures 10-15°C with heavy morning dew and overcast skies.',
      organicRemedies: [
        {
          title: 'Fermented Wood Ash & Buttermilk Extract',
          dosage: '5 Liters fermented lassi + 1 kg sieved wood ash per 100L water',
          preparation: 'Soak ash in water overnight, strain and mix with sour buttermilk.',
          applicationMethod: 'Foliar spray on clear sunny morning.',
          frequency: 'Every 7 to 10 days'
        }
      ],
      biologicalControls: [
        'Seed treatment with Pseudomonas fluorescens.',
        'Foliar spray of Ampelomyces quisqualis hyperparasite.'
      ],
      chemicalTreatment: {
        chemicalName: 'Propiconazole 25% EC (Tilt)',
        dosage: '1 ml per Liter water (200 ml per acre)',
        waitingPeriod: '21 days before harvest',
        safetyWarning: 'Do not spray when wind speed exceeds 10 km/h.'
      },
      preventivePractices: [
        'Sow resistant varieties like DBW 187 or PBW 725.',
        'Avoid excess nitrogen fertilizer; maintain balanced NPK.'
      ],
      voiceAudioScript: 'Alert: Wheat Yellow Rust detected. Spray fermented buttermilk decoction or Propiconazole immediately.'
    }
  },
  {
    id: 'sample-cotton-leaf-curl',
    cropName: 'Cotton',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    severity: 'High',
    thumbnailUrl: createLeafSvgDataUri('cotton_curl'),
    description: 'Upward cupping, thickened veins, enation on leaf bottom.',
    category: 'Viral',
    fullData: {
      cropName: 'Cotton (Gossypium hirsutum)',
      isHealthy: false,
      diseaseName: 'Cotton Leaf Curl Virus',
      scientificName: 'Begomovirus / Whitefly vector',
      pathogenType: 'Viral',
      severityLevel: 'High',
      affectedAreaPercent: 39,
      confidenceScore: 96.8,
      quickSummary: 'Cotton leaf curl virus transmitted by whiteflies. Leaf cupping and vein thickening.',
      translatedSummary: 'कपास में लीफ कर्ल वायरस (पत्ता मरोड़) रोग है। सफेद मक्खी का तुरंत नियंत्रण करें।',
      symptoms: [
        'Upward rolling of leaf margins into cup shapes.',
        'Thickened dark green veins and enation outgrowths on underside.'
      ],
      visualMarkers: [
        { label: 'Vein Thickening', box: [20, 25, 60, 75], color: '#8b5cf6' },
        { label: 'Leaf Margin Curl', box: [15, 65, 55, 90], color: '#ef4444' }
      ],
      environmentalTriggers: 'High whitefly insect population in dry warm conditions.',
      organicRemedies: [
        {
          title: 'Agniastra (Fiery Decoction for Sucking Pests)',
          dosage: '250 ml per 15 Liters backpack sprayer pump',
          preparation: 'Boil green chillies, garlic, and neem leaves in cow urine.',
          applicationMethod: 'Target spray on leaf undersides.',
          frequency: 'Every 5 days'
        },
        {
          title: 'Yellow Sticky Traps',
          dosage: '10 to 12 traps per acre',
          preparation: 'Coat bright yellow sheets with castor oil or sticky glue.',
          applicationMethod: 'Install at crop canopy height.',
          frequency: 'Replace or clean weekly'
        }
      ],
      biologicalControls: [
        'Spray Verticillium lecanii bio-fungus @ 5g/L.',
        'Conserve green lacewings (Chrysoperla).'
      ],
      chemicalTreatment: {
        chemicalName: 'Diafenthiuron 50% WP',
        dosage: '1.2 grams per Liter water',
        waitingPeriod: '20 days before picking',
        safetyWarning: 'Rotate pesticide chemistries to avoid resistance.'
      },
      preventivePractices: [
        'Plant border rows of Bajra/Sorghum as natural physical barriers.',
        'Eradicate host weeds (Kanghi buti).'
      ],
      voiceAudioScript: 'Cotton Leaf Curl Virus identified. Install yellow sticky traps and spray Agniastra or Neem oil.'
    }
  },
  {
    id: 'sample-paddy-rice-blast',
    cropName: 'Paddy / Rice',
    diseaseName: 'Rice Blast (Magnaporthe oryzae)',
    severity: 'Critical',
    thumbnailUrl: createLeafSvgDataUri('paddy_blast'),
    description: 'Diamond spindle shaped lesions with gray ash centers.',
    category: 'Fungal',
    fullData: {
      cropName: 'Paddy / Rice (Oryza sativa)',
      isHealthy: false,
      diseaseName: 'Rice Blast',
      scientificName: 'Magnaporthe oryzae',
      pathogenType: 'Fungal',
      severityLevel: 'Critical',
      affectedAreaPercent: 54,
      confidenceScore: 98.7,
      quickSummary: 'Severe rice blast lesions with spindle shaped grey necrotic centers and yellow halos.',
      translatedSummary: 'धान में ब्लास्ट (झोंका) रोग है। पत्तियों पर नाव के आकार के धब्बे हैं।',
      symptoms: [
        'Spindle or diamond-shaped lesions with gray center and brown margin.',
        'Lesions coalesce causing complete leaf blighting.'
      ],
      visualMarkers: [
        { label: 'Spindle Blast Lesion', box: [28, 35, 52, 65], color: '#ef4444' },
        { label: 'Necrotic Grey Spot', box: [58, 30, 75, 55], color: '#6b7280' }
      ],
      environmentalTriggers: 'Excessive nitrogen fertilizer, cloudy weather, and high relative humidity (>90%).',
      organicRemedies: [
        {
          title: 'Pseudomonas fluorescens + Neemastra',
          dosage: '10g Pseudomonas + 200ml Neemastra per 10L water',
          preparation: 'Dilute in clean pond/well water with 1% rice starch as sticker.',
          applicationMethod: 'Foliar spray at tillering and panicle stage.',
          frequency: 'Every 8 days'
        }
      ],
      biologicalControls: [
        'Trichoderma viride application @ 2.5kg/ha mixed in compost.',
        'Seed treatment with bio-agents.'
      ],
      chemicalTreatment: {
        chemicalName: 'Tricyclazole 75% WP (Beam)',
        dosage: '0.6 grams per Liter water',
        waitingPeriod: '30 days before harvest',
        safetyWarning: 'Do not drain water into fish ponds after chemical spray.'
      },
      preventivePractices: [
        'Split nitrogen fertilizer into 3-4 doses; do not dump all urea at once.',
        'Drain field water for 3 days to reduce canopy humidity.'
      ],
      voiceAudioScript: 'Urgent: Paddy Rice Blast detected. Drain field water for 3 days and spray Pseudomonas or Tricyclazole.'
    }
  },
  {
    id: 'sample-potato-late-blight',
    cropName: 'Potato',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    severity: 'Critical',
    thumbnailUrl: createLeafSvgDataUri('potato_late_blight'),
    description: 'Water-soaked rotting lesions with white downy mold underneath.',
    category: 'Fungal',
    fullData: {
      cropName: 'Potato (Solanum tuberosum)',
      isHealthy: false,
      diseaseName: 'Late Blight',
      scientificName: 'Phytophthora infestans',
      pathogenType: 'Fungal',
      severityLevel: 'Critical',
      affectedAreaPercent: 48,
      confidenceScore: 99.1,
      quickSummary: 'Late blight causing rapid water-soaked necrosis with white sporulation on leaf margins.',
      translatedSummary: 'आलू में पछेती झुलसा (Late Blight) का गंभीर प्रकोप है। पत्तियां सड़ रही हैं।',
      symptoms: [
        'Irregular water-soaked dark brown to purplish-black lesions.',
        'White cottony downy fungal growth on underside of leaves in humid mornings.'
      ],
      visualMarkers: [
        { label: 'Water-soaked Necrosis', box: [25, 45, 62, 85], color: '#ef4444' },
        { label: 'Downy Mold Margin', box: [35, 15, 65, 38], color: '#f3f4f6' }
      ],
      environmentalTriggers: 'Foggy, cold, overcast weather with RH > 85% for 48 hours.',
      organicRemedies: [
        {
          title: 'Copper Hydroxide & Fermented Wood Ash Dusting',
          dosage: 'Dust 2 kg sieved wood ash per acre in morning dew',
          preparation: 'Sieve fine wood ash to coat leaf surfaces against spore germination.',
          applicationMethod: 'Gentle dusting early morning.',
          frequency: 'Twice a week during foggy periods'
        }
      ],
      biologicalControls: [
        'Trichoderma harzianum soil and foliar drenching.',
        'Bacillus subtilis bio-fungicide.'
      ],
      chemicalTreatment: {
        chemicalName: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate) or Metalaxyl',
        dosage: '2.5 grams per Liter water',
        waitingPeriod: '14 days before harvest',
        safetyWarning: 'Apply protective cover before fog sets in.'
      },
      preventivePractices: [
        'Destroy infected haulms/vines before digging tubers.',
        'Plant certified disease-free seed tubers.'
      ],
      voiceAudioScript: 'Critical Alert: Potato Late Blight found. Spray Curzate or Trichoderma immediately before rain.'
    }
  },
  {
    id: 'sample-healthy-paddy',
    cropName: 'Paddy / Rice',
    diseaseName: 'Healthy Crop (No Disease)',
    severity: 'Low',
    thumbnailUrl: createLeafSvgDataUri('healthy_paddy'),
    description: 'Vibrant green chlorophyll, clean leaf margins, zero infection.',
    category: 'Healthy',
    fullData: {
      cropName: 'Paddy / Rice (Oryza sativa)',
      isHealthy: true,
      diseaseName: 'Healthy Crop (No Pathogen Detected)',
      scientificName: 'Oryza sativa (Healthy)',
      pathogenType: 'Healthy',
      severityLevel: 'Low',
      affectedAreaPercent: 0,
      confidenceScore: 99.4,
      quickSummary: 'Leaf is healthy with optimal chlorophyll content and no visible disease or pest damage.',
      translatedSummary: 'आपकी फसल बिल्कुल स्वस्थ है। पत्तियों पर कोई रोग या कीट का लक्षण नहीं है।',
      symptoms: [
        'Uniform emerald green pigmentation.',
        'No lesions, chlorosis, fungal pustules, or insect bite marks.'
      ],
      visualMarkers: [],
      environmentalTriggers: 'Optimal growing conditions with balanced soil nutrition.',
      organicRemedies: [
        {
          title: 'Jeevamrit / Panchagavya Plant Tonic (Growth Booster)',
          dosage: '200 Liters Jeevamrit per acre through irrigation water',
          preparation: 'Ferment desi cow dung, cow urine, jaggery, gram flour, and virgin soil for 48 hours.',
          applicationMethod: 'Apply with canal/borewell irrigation or 10% foliar spray.',
          frequency: 'Once every 15 days'
        }
      ],
      biologicalControls: [
        'Maintain beneficial spiders and dragonflies in the field as natural pest predators.'
      ],
      preventivePractices: [
        'Continue regular weekly field scouting.',
        'Maintain balanced moisture and weed-free field bunds.'
      ],
      voiceAudioScript: 'Good news Kisan Bhai! Your crop leaf is completely healthy. Continue applying Jeevamrit for high yield.'
    }
  }
];
