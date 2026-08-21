import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from './translations';

// Check browser SpeechRecognition support
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

export class VoiceController {
  private recognition: any = null;
  private isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onCommandCallback: ((command: string) => void) | null = null;
  private currentLanguage: LanguageCode = 'en';

  constructor() {
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text && this.onTranscriptCallback) {
          this.onTranscriptCallback(text, Boolean(finalTranscript));
        }

        if (finalTranscript) {
          this.parseVoiceCommand(finalTranscript.toLowerCase());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
      };

      this.recognition.onend = () => {
        // Auto-restart if user still wants hands-free mode
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
          }
        }
      };
    }
  }

  public setLanguage(lang: LanguageCode) {
    this.currentLanguage = lang;
    if (this.recognition) {
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
      this.recognition.lang = match ? match.speechCode : 'en-IN';
    }
  }

  public startListening(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onCommand?: (command: string) => void
  ) {
    if (!this.recognition) {
      console.warn('Speech Recognition not supported in this browser.');
      return false;
    }

    this.onTranscriptCallback = onTranscript;
    if (onCommand) this.onCommandCallback = onCommand;
    this.setLanguage(this.currentLanguage);

    try {
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (e) {
      console.error('Error starting recognition:', e);
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public isSupported(): boolean {
    return Boolean(SpeechRecognition);
  }

  private parseVoiceCommand(text: string) {
    if (!this.onCommandCallback) return;

    // Diagnosing / Scanning
    if (
      text.includes('diagnose') ||
      text.includes('scan') ||
      text.includes('check') ||
      text.includes('जांच') ||
      text.includes('पत्ती') ||
      text.includes('ਫੋਟੋ') ||
      text.includes('পরীক্ষা') ||
      text.includes('तपास')
    ) {
      this.onCommandCallback('NAV_DIAGNOSE');
    }
    // Remedies / Treatment
    else if (
      text.includes('remedy') ||
      text.includes('treatment') ||
      text.includes('organic') ||
      text.includes('उपाय') ||
      text.includes('दवा') ||
      text.includes('ਇਲਾਜ') ||
      text.includes('ঔষধ')
    ) {
      this.onCommandCallback('READ_REMEDIES');
    }
    // Outbreaks / Weather
    else if (
      text.includes('outbreak') ||
      text.includes('weather') ||
      text.includes('alert') ||
      text.includes('मौसम') ||
      text.includes('अलर्ट') ||
      text.includes('ਮੌਸਮ') ||
      text.includes('হাওয়া')
    ) {
      this.onCommandCallback('NAV_OUTBREAKS');
    }
    // Community
    else if (
      text.includes('community') ||
      text.includes('advice') ||
      text.includes('farmer') ||
      text.includes('समुदाय') ||
      text.includes('ਭਾਈਚਾਰਾ')
    ) {
      this.onCommandCallback('NAV_COMMUNITY');
    }
    // Chat / Doctor
    else if (
      text.includes('doctor') ||
      text.includes('ask') ||
      text.includes('expert') ||
      text.includes('डॉक्टर') ||
      text.includes('सलाह') ||
      text.includes('ਡਾਕਟਰ')
    ) {
      this.onCommandCallback('NAV_CHAT');
    }
    // Train Model
    else if (
      text.includes('train') ||
      text.includes('model') ||
      text.includes('feedback') ||
      text.includes('ट्रेनिंग')
    ) {
      this.onCommandCallback('NAV_TRAIN');
    }
    // Offline
    else if (text.includes('offline') || text.includes('ऑफलाइन')) {
      this.onCommandCallback('NAV_OFFLINE');
    }
  }

  // Text to Speech playback
  public speak(text: string, lang: LanguageCode = 'en', onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown characters
    const cleanText = text.replace(/[*#_`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    utterance.lang = langInfo ? langInfo.speechCode : 'en-IN';
    utterance.rate = 0.95; // slightly slower for better farmer comprehension
    utterance.pitch = 1.0;

    // Try to find a matching natural voice
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(
      (v) => v.lang === utterance.lang || v.lang.startsWith(lang)
    );
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
}

export const globalVoiceController = new VoiceController();
