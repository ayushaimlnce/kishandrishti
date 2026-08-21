import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  RefreshCw,
  CornerDownLeft,
} from 'lucide-react';
import { ChatMessage, LanguageCode, DiagnosisResultData } from '../types';
import { globalVoiceController } from '../utils/speech';

interface AgronomistChatProps {
  currentLang: LanguageCode;
  currentDiagnosis?: DiagnosisResultData | null;
  cropContext?: string;
}

export const AgronomistChat: React.FC<AgronomistChatProps> = ({
  currentLang,
  currentDiagnosis,
  cropContext = 'General Crops',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: `Namaste Kisan Bhai! 🙏 I am **Dr. Kisan**, your 24/7 AI Agricultural Scientist & KVK Consultant. Ask me anything about crop diseases, organic spray recipes, bio-fertilizers, or field pest management in your language!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat-agronomist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentDiagnosis: currentDiagnosis || null,
          cropContext: currentDiagnosis?.cropName || cropContext,
          language: currentLang,
        }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Please apply 5% neem oil solution and ensure adequate drainage.',
        audioText: data.audioText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-read response if speech synthesis is ready
      if (data.audioText) {
        setSpeakingMessageId(assistantMessage.id);
        globalVoiceController.speak(data.audioText, currentLang, () => {
          setSpeakingMessageId(null);
        });
      }
    } catch (e) {
      console.warn('Chat error:', e);
      const fallbackMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content:
          'For organic crop health: spray 5 ml neem oil per liter with mild soap water in late afternoon, and ensure good soil drainage.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceInput = () => {
    if (isRecording) {
      globalVoiceController.stopListening();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      globalVoiceController.startListening(
        (transcript, isFinal) => {
          setInputValue(transcript);
          if (isFinal) {
            setIsRecording(false);
            globalVoiceController.stopListening();
          }
        }
      );
    }
  };

  const handlePlayMessageAudio = (msg: ChatMessage) => {
    if (speakingMessageId === msg.id) {
      globalVoiceController.stopSpeaking();
      setSpeakingMessageId(null);
    } else {
      setSpeakingMessageId(msg.id);
      globalVoiceController.speak(msg.audioText || msg.content, currentLang, () => {
        setSpeakingMessageId(null);
      });
    }
  };

  const quickQuestions = [
    'How to prepare Neem Seed Kernel Extract (NSKE)?',
    'Is it safe to spray during flowering stage?',
    'Organic remedy for yellowing leaves in paddy',
    'How to control whiteflies without toxic chemicals?',
  ];

  return (
    <div className="bg-white border border-[#E0E7DE] rounded-3xl shadow-xs overflow-hidden flex flex-col h-[75vh] max-h-[750px]">
      {/* Chat Top Banner */}
      <div className="p-4 sm:p-5 border-b border-[#E0E7DE] bg-[#F0F4EF] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2D5A27] flex items-center justify-center text-white shadow-xs border border-[#2D5A27]/40">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-[#1B261C]">Dr. Kisan AI Agronomist</h2>
              <span className="w-2.5 h-2.5 rounded-full bg-[#86C232] animate-pulse" />
            </div>
            <p className="text-xs text-[#5C6B5A] font-medium">
              Active Context:{' '}
              <strong className="text-[#2D5A27] font-bold">
                {currentDiagnosis?.cropName || cropContext}
              </strong>{' '}
              {currentDiagnosis ? `(${currentDiagnosis.diseaseName})` : ''}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-[#2D5A27] bg-[#E9F2E7] px-3 py-1 rounded-full border border-[#DDE4DC] hidden sm:inline">
          KVK & ICAR Calibrated
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#F4F7F2]/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                  isUser ? 'bg-[#5C6B5A]' : 'bg-[#2D5A27]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#2D5A27] text-white rounded-tr-none'
                    : 'bg-white text-[#1B261C] border border-[#E0E7DE] rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                    isUser ? 'text-[#E9F2E7]' : 'text-[#5C6B5A]'
                  }`}
                >
                  <span className="font-semibold">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handlePlayMessageAudio(msg)}
                      className="flex items-center gap-1 font-bold text-[#2D5A27] hover:text-[#1B261C] transition-colors"
                      title="Listen"
                    >
                      {speakingMessageId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-red-600" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                      <span>{speakingMessageId === msg.id ? 'Stop' : 'Listen'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-[#5C6B5A] text-xs py-2 font-medium">
            <div className="w-8 h-8 rounded-xl bg-[#2D5A27] flex items-center justify-center text-white">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <span>Dr. Kisan is analyzing your query with agricultural literature...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Questions */}
      <div className="px-4 py-2.5 bg-[#F0F4EF] border-t border-[#E0E7DE] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
        <span className="text-[#5C6B5A] font-bold whitespace-nowrap text-[10px] uppercase">
          Quick Ask:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-3 py-1 rounded-full bg-white hover:bg-[#E3ECE1] text-[#1B261C] font-semibold whitespace-nowrap border border-[#DDE4DC] transition-colors shadow-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E0E7DE]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Mic */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-2xl border transition-all shrink-0 ${
              isRecording
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-[#F0F4EF] border-[#DDE4DC] text-[#1B261C] hover:bg-[#E3ECE1]'
            }`}
            title="Speak your question hands-free"
          >
            {isRecording ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to your voice...'
                : 'Ask Dr. Kisan (e.g. How much neem oil per 15L pump?)...'
            }
            className="flex-1 bg-[#F0F4EF] border border-[#DDE4DC] rounded-2xl px-4 py-3 text-[#1B261C] placeholder-[#5C6B5A] text-xs sm:text-sm focus:ring-2 focus:ring-[#2D5A27] focus:outline-none font-medium"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-3 rounded-2xl bg-[#2D5A27] hover:bg-[#23471f] text-white font-bold transition-all disabled:opacity-50 shrink-0 shadow-xs"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
