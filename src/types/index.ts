export type LanguageCode =
  | 'en'
  | 'hi'
  | 'pa'
  | 'bn'
  | 'te'
  | 'ta'
  | 'mr'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'or';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  speechCode: string;
}

export type PathogenType =
  | 'Fungal'
  | 'Bacterial'
  | 'Viral'
  | 'Pest/Insect'
  | 'Nutrient Deficiency'
  | 'Physiological Disorder'
  | 'Healthy';

export type SeverityLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface VisualMarker {
  label: string;
  box: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages (0-100)
  color: string;
}

export interface OrganicRemedy {
  title: string;
  dosage: string;
  preparation: string;
  applicationMethod: string;
  frequency: string;
}

export interface ChemicalTreatment {
  chemicalName: string;
  dosage: string;
  waitingPeriod: string;
  safetyWarning: string;
}

export interface DiagnosisResultData {
  cropName: string;
  isHealthy: boolean;
  diseaseName: string;
  scientificName: string;
  pathogenType: PathogenType;
  severityLevel: SeverityLevel;
  affectedAreaPercent: number;
  confidenceScore: number;
  quickSummary: string;
  translatedSummary: string;
  symptoms: string[];
  visualMarkers: VisualMarker[];
  environmentalTriggers: string;
  organicRemedies: OrganicRemedy[];
  biologicalControls: string[];
  chemicalTreatment?: ChemicalTreatment;
  preventivePractices: string[];
  voiceAudioScript: string;
  capturedImage?: string;
  timestamp?: string;
}

export interface FeedbackItem {
  id: string;
  timestamp: string;
  cropName: string;
  detectedDisease: string;
  correctedDisease: string;
  isCorrect: boolean;
  farmerNote: string;
  contributorName: string;
  contributorRole: 'farmer' | 'agronomist' | 'researcher' | 'student';
  region: string;
  imageUrl?: string;
  status: 'verified' | 'pending' | 'flagged';
  accuracyScore: number;
}

export interface TrainingMetrics {
  modelVersion: string;
  lastRetrained: string;
  overallAccuracy: number;
  f1Score: number;
  totalValidatedSamples: number;
  recentCommunityContributions: number;
  cropsCovered: number;
  diseasesCataloged: number;
  classAccuracy: Array<{
    crop: string;
    accuracy: number;
    samples: number;
    riskLevel: string;
  }>;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorRole: string;
  region: string;
  crop: string;
  diseaseTitle: string;
  remedyDescription: string;
  ingredients: string[];
  preparationTime: string;
  applicationFrequency: string;
  upvotes: number;
  commentsCount: number;
  verifiedByKVK: boolean;
  createdAt: string;
  tags: string[];
}

export interface OutbreakAlert {
  id: string;
  state: string;
  crop: string;
  threat: string;
  severity: 'High Alert' | 'Critical Alert' | 'Watch Alert' | 'Advisory';
  affectedDistricts: string[];
  triggerFactor: string;
  recommendedAction: string;
  farmerAdvisoryAudio: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  audioText?: string;
}

export interface SampleLeaf {
  id: string;
  cropName: string;
  diseaseName: string;
  severity: SeverityLevel;
  thumbnailUrl: string;
  description: string;
  category: PathogenType;
  fullData: Partial<DiagnosisResultData>;
}

export interface OfflineDiseaseItem {
  id: string;
  crop: string;
  disease: string;
  symptoms: string;
  organicRemedy: string;
  dosage: string;
  pathogen: PathogenType;
  severity: SeverityLevel;
  imagePlaceholder: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'weather' | 'pest_alert' | 'remedy_reminder' | 'community';
  urgent: boolean;
  read: boolean;
  audioText: string;
}
