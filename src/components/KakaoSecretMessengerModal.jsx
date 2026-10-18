import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Search, Send, Play, Pause, Lock, ShieldCheck, Sparkles, 
  ArrowLeft, Heart, Image as ImageIcon, Volume2, Ticket, CheckCheck, 
  ExternalLink, ChevronRight, AlertCircle, MessageCircle, Maximize2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function KakaoSecretMessengerModal({ 
  isOpen, 
  onClose, 
  chatRooms, 
  setChatRooms, 
  currentUser, 
  onOpenDonate, 
  onOpenCharge,
  theme: themeProp
}) {
  const [selectedRoomId, setSelectedRoomId] = useState('room_luna');
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [aiWarning, setAiWarning] = useState('');
  const messagesEndRef = useRef(null);

  // Detect theme from prop or DOM attribute
  const isDark = themeProp ? themeProp === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const activeRoom = chatRooms.find(r => r.id === selectedRoomId) || chatRooms[0];
  const isRoot = currentUser?.role === 'admin';
  const isRoomUnlocked = isRoot || Boolean(activeRoom?.isUnlocked);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoom?.messages]);

  if (!isOpen) return null;

  // Sound Synthesizer for cute voice notes
  const playCuteVoice = (msgId) => {
    try {
      if (playingAudioId === msgId) {
        setPlayingAudioId(null);
        return;
      }

      setPlayingAudioId(msgId);
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const frequencies = [440, 554.37, 659.25, 880, 739.99, 659.25];
      frequencies.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.15 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.15);
        osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
      });

      setTimeout(() => {
        setPlayingAudioId(null);
      }, 3500);
    } catch (e) {
      console.log('Audio playback error', e);
      setPlayingAudioId(null);
    }
  };

  // Filter chat rooms by search
  const filteredRooms = chatRooms.filter(r => 
    r.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id);
    setMobileView('chat');
    // Clear unread count
    if (room.unreadCount > 0) {
      setChatRooms(prev => prev.map(r => r.id === room.id ? { ...r, unreadCount: 0 } : r));
    }
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    if (!isRoot) {
      if (!activeRoom.isUnlocked) {
        alert(`${activeRoom.creatorName}님과의 1:1 대화는 골드 래빗(1,000 🥕) 이상 후원 시 해금됩니다.`);
        return;
      }

      if (activeRoom.tickets <= 0) {
        alert('보유한 1:1 소통 티켓이 부족합니다! 당근 충전 또는 추가 후원을 통해 티켓을 획득해주세요.');
        return;
      }
    }

    // AI Safety Filter Simulation
    const prohibitedWords = ['성희롱', '몸매', '주소', '만나줘', '전화번호', '사귀자', '개인카톡', '집주소', '계좌'];
    const hasViolation = prohibitedWords.some(word => inputText.includes(word));
    if (hasViolation) {
      setAiWarning('안전 보호 필터: 부적절한 단어나 사생활 침해 요구가 감지되어 전송이 제한되었습니다.');
      return;
    }

    setAiWarning('');
    const newMsgId = `msg_${Date.now()}`;
    const userText = inputText;
    setInputText('');

    const newMsg = {
      id: newMsgId,
      sender: `${currentUser?.name || currentUser?.nickname || '서포터'}`,
      senderTier: 'gold',
      isCreator: false,
      text: userText,
      timestamp: '방금 전',
      ticketCost: 1
    };

    // Update room messages & deduct 1 ticket
    setChatRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          tickets: Math.max(0, r.tickets - 1),
          lastUpdated: '방금 전',
          messages: [...r.messages, newMsg]
        };
      }
      return r;
    }));

    // Trigger subtle confetti
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    } catch (err) {}

    // Creator response simulation
    setTimeout(() => {
      const creatorReply = {
        id: `reply_${Date.now()}`,
        sender: activeRoom.creatorName,
        senderTier: 'creator',
        isCreator: true,
        text: `"${userText.slice(0, 18)}..." 따뜻한 메시지 감사합니다. 이번 주 준비한 감사 보이스 답례품을 남겨드려요.`,
        timestamp: '방금 전',
        voiceNote: {
          duration: '0:15',
          label: `${activeRoom.creatorName}의 감사 보이스 메모`
        },
        secretPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        isSpecialGift: true
      };

      setChatRooms(prev => prev.map(r => {
        if (r.id === activeRoom.id) {
          return {
            ...r,
            lastUpdated: '방금 전',
            messages: [...r.messages, creatorReply]
          };
        }
        return r;
      }));
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      
      {/* Photo Lightbox */}
      {lightboxPhoto && (
        <div 
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
        >
          <img 
            src={lightboxPhoto} 
            alt="Secret Photo" 
            className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
          />
          <p className="text-white/70 text-xs mt-3 flex items-center gap-1.5 font-medium">
            <span>VIP 서포터 전용 시크릿 포토카드 · 화면을 클릭하면 닫힙니다</span>
          </p>
        </div>
      )}

      {/* Main Luxury Modal Container */}
      <div className={`w-full max-w-5xl h-[88vh] rounded-3xl overflow-hidden flex flex-col sm:flex-row relative font-sans transition-colors duration-200 ${
        isDark 
          ? 'bg-[#0D111A] text-white border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.7)]' 
          : 'bg-white text-slate-900 border border-slate-200/80 shadow-[0_25px_70px_rgba(0,0,0,0.18)]'
      }`}>

        {/* ================= LEFT PANE: CHAT ROOMS LIST ================= */}
        <div className={`w-full sm:w-80 md:w-96 flex flex-col border-r transition-colors ${
          isDark 
            ? 'bg-[#090D14] border-white/10' 
            : 'bg-white border-slate-100'
        } ${
          mobileView === 'chat' ? 'hidden sm:flex' : 'flex'
        }`}>
          {/* Top Bar Header */}
          <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 transition-colors ${
            isDark ? 'bg-[#090D14] border-white/10' : 'bg-white border-slate-100'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-heading font-black text-base tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  시크릿톡
                </h2>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  isDark 
                    ? 'bg-[#E4092B]/20 text-[#FF4D6D] border-[#E4092B]/30' 
                    : 'bg-rose-50 text-[#E4092B] border-rose-100/60'
                }`}>
                  VIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                크리에이터 1:1 프라이빗 라운지
              </p>
            </div>

            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
              }`}
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Box */}
          <div className={`p-3 border-b transition-colors ${
            isDark ? 'bg-[#0D111A] border-white/10' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="크리에이터 검색..."
                className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs transition-all ${
                  isDark
                    ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#E4092B]/30 focus:border-[#E4092B]/60 focus:bg-white/10'
                    : 'bg-white border border-slate-200/70 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50'
                }`}
              />
            </div>
          </div>

          {/* Chat Rooms Scroll List */}
          <div className={`flex-1 overflow-y-auto divide-y custom-scrollbar ${
            isDark ? 'divide-white/5' : 'divide-slate-100'
          }`}>
            {filteredRooms.map((room) => {
              const isSelected = room.id === activeRoom.id;
              const lastMsg = room.messages[room.messages.length - 1];

              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`w-full p-3.5 sm:p-4 flex items-center gap-3 text-left transition-colors cursor-pointer relative ${
                    isSelected 
                      ? (isDark ? 'bg-white/10' : 'bg-slate-50/90') 
                      : (isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50/50')
                  }`}
                >
                  {/* Subtle active indicator line */}
                  {isSelected && (
                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#E4092B] rounded-r-full shadow-[0_0_8px_#E4092B]" />
                  )}

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={room.avatar} 
                      alt={room.creatorName} 
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/5"
                    />
                    {!room.isUnlocked && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white rounded-full flex items-center justify-center text-[9px] shadow-sm">
                        <Lock className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-heading font-bold text-xs truncate ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {room.creatorName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-num shrink-0 ml-1">
                        {room.lastUpdated}
                      </span>
                    </div>

                    <p className={`text-[11px] truncate mt-0.5 font-normal ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {lastMsg?.voiceNote ? '보이스 메모가 도착했습니다' : lastMsg?.text || '대화가 없습니다.'}
                    </p>

                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className={room.isUnlocked || isRoot ? (isDark ? 'text-amber-400 font-bold' : 'text-amber-600 font-bold') : 'text-slate-400'}>
                        {isRoot ? 'ROOT 마스터 무제한 소통' : room.isUnlocked ? `티켓 ${room.tickets}장 보유` : `${room.requiredCarrots} 당근 후원 시 해금`}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#E4092B] text-white text-[9px] font-bold flex items-center justify-center">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Supporter Global Status Bottom Strip */}
          <div className={`p-3.5 border-t text-xs flex items-center justify-between transition-colors ${
            isDark ? 'bg-[#090D14] border-white/10' : 'bg-slate-50/70 border-slate-100'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm">🥕</span>
              <div>
                <span className="text-[10px] text-slate-400 block font-medium">내 보유 당근</span>
                <span className={`font-heading font-black font-num text-xs ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {(currentUser?.carrotsBalance || 0).toLocaleString()} <span className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>당근</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => { onClose(); onOpenCharge && onOpenCharge(); }}
              className="px-3 py-1.5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              충전하기
            </button>
          </div>
        </div>

        {/* ================= RIGHT PANE: ACTIVE CHAT CONVERSATION ================= */}
        <div className={`flex-1 flex flex-col transition-colors ${
          isDark ? 'bg-[#0D111A]' : 'bg-[#FAFAFB]'
        } ${
          mobileView === 'list' ? 'hidden sm:flex' : 'flex'
        }`}>
          {/* Chat Window Top Bar */}
          <div className={`p-3.5 sm:p-4 backdrop-blur-sm border-b flex items-center justify-between shrink-0 transition-colors ${
            isDark ? 'bg-[#0D111A]/95 border-white/10' : 'bg-white/95 border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileView('list')}
                className={`sm:hidden p-1.5 rounded-lg cursor-pointer ${
                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <img 
                src={activeRoom.avatar} 
                alt={activeRoom.creatorName} 
                className="w-10 h-10 rounded-2xl object-cover ring-1 ring-black/5"
              />

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className={`font-heading font-black text-sm ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {activeRoom.creatorName}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeRoom.category}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span>{isRoot ? '👑 최고 관리자 (ROOT)' : `${activeRoom.tierName} 등급 서포터`}</span>
                  <span>·</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    잔여 티켓: {isRoot ? '무제한 🎫' : `${activeRoom.tickets}장`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                className="px-3.5 py-1.5 rounded-full bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-[#E4092B]/20 cursor-pointer active:scale-95 transition-all"
              >
                <span>후원하기</span>
              </button>

              <button
                onClick={onClose}
                className={`hidden sm:flex w-8 h-8 rounded-full items-center justify-center cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                }`}
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">

            {/* Date Separator */}
            <div className="text-center my-2">
              <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${
                isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200/50 text-slate-500'
              }`}>
                2026년 10월 14일
              </span>
            </div>

            {/* Clean AI Safety Notice */}
            <div className={`p-3 rounded-2xl border text-[11px] flex items-center gap-2.5 max-w-lg mx-auto ${
              isDark 
                ? 'bg-white/5 border-white/10 text-slate-300' 
                : 'bg-white border-slate-200/60 text-slate-500 shadow-2xs'
            }`}>
              <ShieldCheck className="w-4 h-4 text-[#E4092B] shrink-0" />
              <span>
                <strong>MIMIBIT 안심 케어</strong> · AI 클린봇이 사생활 보호와 상호 존중을 위해 24시간 실시간 모니터링 중입니다.
              </span>
            </div>

            {/* LOCKED ROOM STATE */}
            {!activeRoom.isUnlocked && (
              <div className={`p-8 rounded-3xl text-center max-w-md mx-auto my-6 border ${
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200/80 text-slate-900 shadow-sm'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                  isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className={`font-heading font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  1:1 시크릿 메신저 잠금 상태
                </h4>
                <p className={`text-xs mt-1.5 leading-relaxed max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {activeRoom.creatorName}님과의 1:1 대화는 <strong>골드 래빗 (누적 1,000 당근)</strong> 후원 시 자동으로 열립니다.
                </p>
                <button
                  onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                  className="mt-4 px-5 py-2.5 rounded-full bg-[#E4092B] text-white font-bold text-xs hover:bg-[#CC0022] shadow-sm shadow-[#E4092B]/20 transition-all cursor-pointer"
                >
                  후원하고 1:1 대화 시작하기
                </button>
              </div>
            )}

            {/* Messages Feed */}
            {activeRoom.messages.map((msg) => {
              const isMe = !msg.isCreator;

              return (
                <div key={msg.id} className={`flex items-start gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {/* Creator Avatar for incoming */}
                  {!isMe && (
                    <img 
                      src={activeRoom.avatar} 
                      alt={msg.sender} 
                      className="w-9 h-9 rounded-2xl object-cover ring-1 ring-black/5 shrink-0 mt-0.5"
                    />
                  )}

                  <div className="max-w-[78%] sm:max-w-[70%] space-y-1">
                    {!isMe && (
                      <span className={`text-[11px] font-semibold block ml-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {msg.sender}
                      </span>
                    )}

                    {/* Speech Bubble - Clean Minimal Luxury */}
                    <div className={`p-3.5 sm:p-4 rounded-2xl text-[13px] leading-relaxed ${
                      isMe 
                        ? (isDark 
                            ? 'bg-[#E4092B]/25 text-rose-100 border border-[#E4092B]/40 shadow-xs rounded-tr-xs' 
                            : 'bg-[#FFF5F7] text-slate-900 border border-rose-100/70 shadow-xs rounded-tr-xs')
                        : (isDark 
                            ? 'bg-white/10 text-slate-100 border border-white/15 shadow-xs rounded-tl-xs' 
                            : 'bg-white text-slate-900 border border-slate-200/70 shadow-xs rounded-tl-xs')
                    }`}>
                      <p>{msg.text}</p>

                      {/* Attached Voice Reward Bubble */}
                      {msg.voiceNote && (
                        <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 ${
                          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/60'
                        }`}>
                          <button
                            type="button"
                            onClick={() => playCuteVoice(msg.id)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                              playingAudioId === msg.id 
                                ? 'bg-[#E4092B] text-white animate-pulse' 
                                : (isDark ? 'bg-white/15 hover:bg-[#E4092B] text-white' : 'bg-slate-900 hover:bg-[#E4092B] text-white shadow-xs')
                            }`}
                          >
                            {playingAudioId === msg.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <span className={`font-bold text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {msg.voiceNote.label}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {/* Sound waveform bar */}
                              <div className="flex items-center gap-0.5 h-3">
                                <span className={`w-1 rounded-full bg-[#E4092B] ${playingAudioId === msg.id ? 'h-3 animate-bounce' : 'h-1.5'}`}></span>
                                <span className={`w-1 rounded-full bg-[#E4092B] ${playingAudioId === msg.id ? 'h-4 animate-pulse' : 'h-2'}`}></span>
                                <span className={`w-1 rounded-full bg-[#E4092B] ${playingAudioId === msg.id ? 'h-2 animate-bounce' : 'h-1'}`}></span>
                                <span className={`w-1 rounded-full bg-[#E4092B] ${playingAudioId === msg.id ? 'h-3.5 animate-pulse' : 'h-2.5'}`}></span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-num">{msg.voiceNote.duration}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Attached Secret Photocard */}
                      {msg.secretPhotoUrl && (
                        <div className={`mt-3 relative rounded-xl overflow-hidden group border shadow-xs ${
                          isDark ? 'border-white/15' : 'border-slate-200/60'
                        }`}>
                          <img 
                            src={msg.secretPhotoUrl} 
                            alt="Secret Photocard" 
                            className="w-full max-h-52 object-cover rounded-xl cursor-pointer group-hover:scale-102 transition-transform duration-300"
                            onClick={() => setLightboxPhoto(msg.secretPhotoUrl)}
                          />
                          <div 
                            onClick={() => setLightboxPhoto(msg.secretPhotoUrl)}
                            className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer text-white text-xs font-medium gap-1.5"
                          >
                            <Maximize2 className="w-4 h-4" />
                            <span>크게 보기</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timestamp & Status */}
                    <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 font-num ${
                      isMe ? 'justify-end' : 'justify-start ml-1'
                    }`}>
                      {isMe && <span className="text-[#E4092B] font-semibold">읽음</span>}
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* AI Warning if triggered */}
          {aiWarning && (
            <div className="px-4 py-2 bg-rose-500/20 border-t border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aiWarning}</span>
            </div>
          )}

          {/* Quick Preset Prompts */}
          {isRoomUnlocked && (
            <div className={`px-4 py-2.5 border-t flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs ${
              isDark ? 'bg-[#090D14] border-white/10' : 'bg-slate-50/80 border-slate-100'
            }`}>
              <span className="text-slate-400 font-medium text-[11px] shrink-0">추천:</span>
              <button 
                type="button" 
                onClick={() => setInputText('다음 화보집 굿즈 제작 일정이 어떻게 되나요?')}
                className={`px-3 py-1 rounded-full shrink-0 font-medium cursor-pointer transition-colors text-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                다음 굿즈 제작 일정
              </button>
              <button 
                type="button" 
                onClick={() => setInputText('항상 멋진 작품 보여주셔서 감사합니다. 언제나 응원할게요!')}
                className={`px-3 py-1 rounded-full shrink-0 font-medium cursor-pointer transition-colors text-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                응원 메시지 보내기
              </button>
              <button 
                type="button" 
                onClick={() => setInputText('이번 보이스 메모 너무 감동이에요! 녹음 비하인드가 궁금해요.')}
                className={`px-3 py-1 rounded-full shrink-0 font-medium cursor-pointer transition-colors text-xs ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                }`}
              >
                보이스 녹음 소감 듣기
              </button>
            </div>
          )}

          {/* Chat Input Bottom Form */}
          <div className={`p-3 sm:p-4 border-t ${
            isDark ? 'bg-[#090D14] border-white/10' : 'bg-white border-slate-100'
          }`}>
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  disabled={!isRoomUnlocked}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isRoot
                      ? `${activeRoom.creatorName}님에게 root 관리자 메시지 전송 (무제한)`
                      : activeRoom.isUnlocked
                      ? `${activeRoom.creatorName}님에게 비밀 메시지 보내기 (티켓 1장 차감)`
                      : '골드 래빗 등급 달성 후 이용 가능합니다.'
                  }
                  className={`w-full pl-4 pr-4 py-3 rounded-2xl text-xs transition-all disabled:opacity-60 ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E4092B]/30 focus:border-[#E4092B]/60'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={!isRoomUnlocked || !inputText.trim()}
                className="w-11 h-11 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-[#E4092B]/20 cursor-pointer active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>{isRoot ? '👑 root 슈퍼 관리자 모드: 티켓 차감 없이 즉시 발송됩니다.' : '질문 발송 시 소통 티켓 1장이 차감됩니다.'}</span>
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                잔여 티켓: {isRoot ? '무제한 🎫' : `${activeRoom.tickets}장`}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
