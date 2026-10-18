import React, { useState, useRef } from 'react';
import { 
  Send, Lock, Play, Pause, Volume2, Image, Shield, AlertTriangle, 
  Sparkles, CheckCircle2, Ticket, Heart, Mic, Info, Maximize2 
} from 'lucide-react';

export function SecretMessenger({ 
  creator, 
  userState, 
  messages, 
  onSendMessage, 
  onOpenDonate,
  onOpenTiers 
}) {
  const [inputText, setInputText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [aiWarning, setAiWarning] = useState('');

  const isUnlocked = userState.tierLevel >= 3; // Gold Rabbit or higher

  // Real Web Audio cute sound synthesizer for Luna's voice note!
  const playCuteChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.35);
      });
    } catch (e) {
      console.log('Audio playback preview', e);
    }
  };

  const togglePlayAudio = () => {
    if (!isPlayingAudio) {
      playCuteChime();
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 3500);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (userState.tickets <= 0) {
      alert('보유한 소통 티켓이 부족합니다! 당근을 충전하여 티켓을 획득해주세요.');
      return;
    }

    // AI Safety Filter Simulation (Slide 6)
    const prohibitedWords = ['성희롱', '몸매', '주소', '만나줘', '전화번호', '사귀자', '개인카톡'];
    const hasViolation = prohibitedWords.some((word) => inputText.includes(word));

    if (hasViolation) {
      setAiWarning('⚠️ AI 클린봇 경고: 사생활 침해 또는 부적절한 단어가 감지되어 발송이 차단되었습니다.');
      return;
    }

    setAiWarning('');
    onSendMessage({
      id: `msg_${Date.now()}`,
      sender: `${userState.nickname} (당신)`,
      senderTier: userState.tierId,
      isCreator: false,
      text: inputText,
      timestamp: '방금 전',
      ticketCost: 1
    });

    setInputText('');
  };

  if (!isUnlocked) {
    return (
      <div className="card-pop-3d rounded-3xl p-6 sm:p-10 mb-6 text-center bg-white relative overflow-hidden">
        <div className="max-w-md mx-auto py-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#FFF0F4] to-[#FFE5EC] text-[#FF2E63] flex items-center justify-center text-4xl mx-auto mb-4 shadow-md border-2 border-[#FFCCD5] animate-bounce">
            🔒
          </div>

          <span className="text-[11px] font-black text-[#FF2E63] uppercase tracking-wider bg-[#FFF0F4] px-3.5 py-1 rounded-full border border-[#FFCCD5]">
            VIP SECRET LOUNGE
          </span>

          <h2 className="text-xl sm:text-2xl font-bubble font-black text-[#1D1E2C] mt-3 mb-2">
            1:1 시크릿 메신저는 골드 래빗 전용 공간입니다
          </h2>

          <p className="text-xs text-[#64748B] leading-relaxed mb-6 font-medium">
            월 100,000원(1,000당근) 이상 후원 시 자동으로 해금되며,<br />
            루나와 정성스러운 <strong>1:1 비동기 카드 편지</strong>와 <strong>독점 보이스 노트/미공개 사진 리워드</strong>를 교환할 수 있습니다.
          </p>

          <div className="bg-[#FFF5F7] p-4.5 rounded-2xl border-2 border-[#FFCCD5] text-left text-xs space-y-2.5 mb-6">
            <div className="font-black text-[#1D1E2C] flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4 text-[#FFB703]" />
              <span>골드 래빗 이상 특별 해금 혜택:</span>
            </div>
            <div className="text-[#33354A] flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF2E63]"></span>
              <span>월간 1:1 메시지 티켓 5장 즉시 지급</span>
            </div>
            <div className="text-[#33354A] flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF2E63]"></span>
              <span>루나의 미공개 고화질 화보 & 감사 보이스 노트 열람</span>
            </div>
            <div className="text-[#33354A] flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FF2E63]"></span>
              <span>스팸·악플 없는 안전하고 존중받는 프라이빗 교감</span>
            </div>
          </div>

          <button
            onClick={() => onOpenDonate(1000)}
            className="btn-pop-primary w-full py-3.5 text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>1,000 당근 후원하고 비밀 라운지 해금하기</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-pop-3d rounded-3xl overflow-hidden mb-6 flex flex-col bg-white">
      {/* Lounge Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#181116] via-[#2D1B28] to-[#181116] text-white flex items-center justify-between border-b-2 border-[#FFB703]/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#FFB703] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#181116]"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bubble font-black text-white">
                {creator.name} Secret Lounge
              </h3>
              <span className="text-[10px] bg-[#FFB703] text-[#1D1E2C] font-black px-2 py-0.5 rounded-full shadow-xs">
                VIP 라운지
              </span>
            </div>
            <p className="text-[11px] text-white/70 font-medium">
              티켓 1장 = 메시지 1통 비동기 카드 작성
            </p>
          </div>
        </div>

        {/* User Ticket Balance Pill */}
        <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-2xl border border-white/20 shadow-xs">
          <Ticket className="w-4 h-4 text-[#FF7A00]" />
          <span className="text-xs font-bold text-white">
            보유 티켓: <strong className="text-[#FFB703] font-bubble text-sm">{userState.tickets}장</strong>
          </span>
        </div>
      </div>

      {/* No Pressure & Safety Notice Bar */}
      <div className="bg-[#FFF0F4] px-4 py-2.5 border-b border-[#FCE7EC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#FF2E63] font-black">
          <Shield className="w-4 h-4 text-[#FF2E63]" />
          <span>창작자 답장 의무 면제 정책 (No Pressure) 적용</span>
        </div>
        <span className="text-[#64748B] text-[11px] font-semibold hidden sm:inline">
          루나는 편한 시간에 텍스트, 음성(보이스 노트), 미공개 사진으로 리워드를 전송합니다
        </span>
      </div>

      {/* Messages Feed */}
      <div className="p-4 sm:p-6 space-y-4 max-h-[480px] overflow-y-auto bg-[#FAFAFC] custom-scrollbar">
        {messages.map((msg) => {
          if (msg.isCreator) {
            return (
              <div key={msg.id} className="flex gap-3 max-w-lg">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-9 h-9 rounded-full object-cover shrink-0 mt-1 border-2 border-[#FFCCD5]"
                />
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span className="font-black text-[#1D1E2C]">{creator.name}</span>
                    <span className="text-[10px] bg-[#FFE5EC] text-[#FF2E63] px-2 py-0.2 rounded-full font-black">
                      크리에이터
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Creator Message Card */}
                  <div className="bg-white p-4 rounded-3xl rounded-tl-xs shadow-xs border-2 border-[#FCE7EC] text-xs sm:text-sm text-[#1D1E2C] leading-relaxed">
                    <p className="font-medium">{msg.text}</p>

                    {/* Interactive Voice Note Audio Player */}
                    {msg.voiceNote && (
                      <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-[#FFF0F4] to-[#FFF9E6] border border-[#FFCCD5] flex items-center gap-3 shadow-xs">
                        <button
                          type="button"
                          onClick={togglePlayAudio}
                          className="w-10 h-10 rounded-full bg-[#FF2E63] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#FF2E63]/30 hover:scale-105 active:scale-95 transition-all"
                        >
                          {isPlayingAudio ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 ml-0.5" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex justify-between items-center text-xs text-[#64748B] mb-1.5 font-bold">
                            <span className="font-black text-[#FF2E63] flex items-center gap-1">
                              <Volume2 className="w-3.5 h-3.5" />
                              {msg.voiceNote.label}
                            </span>
                            <span className="font-outfit">{isPlayingAudio ? '재생 중...' : msg.voiceNote.duration}</span>
                          </div>
                          {/* Animated Waveform */}
                          <div className="flex items-center gap-1 h-5">
                            {[10, 16, 22, 14, 8, 20, 24, 15, 20, 10, 16, 22, 12, 18, 8, 14, 20, 10].map((h, i) => (
                              <div
                                key={i}
                                className={`w-1 rounded-full transition-all duration-150 ${
                                  isPlayingAudio ? 'bg-[#FF2E63] animate-pulse' : 'bg-[#FFCCD5]'
                                }`}
                                style={{ height: `${isPlayingAudio ? Math.random() * 20 + 6 : h}px` }}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Secret Photo Preview */}
                    {msg.secretPhotoUrl && (
                      <div className="mt-3">
                        <div 
                          onClick={() => setSelectedPhoto(msg.secretPhotoUrl)}
                          className="relative rounded-2xl overflow-hidden cursor-pointer group border-2 border-[#FFCCD5]"
                        >
                          <img
                            src={msg.secretPhotoUrl}
                            alt="Secret Photo"
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/35 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                            <span className="bg-white/95 text-[#FF2E63] text-xs font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                              <Maximize2 className="w-3.5 h-3.5" />
                              <span>미공개 시크릿 화보 원본 보기</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }

          // User Message
          return (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="flex items-center gap-2 text-[11px] text-[#64748B] mb-1">
                <span>{msg.timestamp}</span>
                <span className="font-black text-[#1D1E2C]">{msg.sender}</span>
                <span className="text-[10px] bg-[#FEF08A] text-[#854D0E] font-black px-2 py-0.2 rounded-full">
                  티켓 1장 소모
                </span>
              </div>
              <div className="bg-gradient-to-r from-[#FF2E63] to-[#FF5E7E] text-white p-4 rounded-3xl rounded-tr-xs shadow-md text-xs sm:text-sm leading-relaxed max-w-md font-medium">
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Violation Warning */}
      {aiWarning && (
        <div className="px-4 py-2.5 bg-red-50 text-red-600 text-xs font-bold border-t border-red-200 flex items-center gap-2 animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{aiWarning}</span>
        </div>
      )}

      {/* Send Message Form */}
      <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-[#FCE7EC] flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="루나에게 보낼 정성스러운 메시지를 작성해 주세요 (티켓 1장 차감)"
            className="w-full pl-4 pr-20 py-3 rounded-2xl border-2 border-[#FCE7EC] text-xs sm:text-sm font-medium focus:border-[#FF2E63]"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#FF2E63] font-black font-outfit">
            1 Ticket
          </span>
        </div>

        <button
          type="submit"
          disabled={!inputText.trim() || userState.tickets <= 0}
          className="btn-pop-primary px-5 py-3 text-xs sm:text-sm flex items-center gap-1.5 disabled:opacity-40"
        >
          <span>보내기</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="max-w-md w-full relative">
            <img
              src={selectedPhoto}
              alt="Secret reward"
              className="w-full rounded-3xl shadow-2xl object-cover max-h-[80vh] border-2 border-white/20"
            />
            <p className="text-center text-white text-xs font-black mt-3">
              루나의 골드 래빗 이상 전용 미공개 리워드 포토
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
