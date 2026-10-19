import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Search, Send, Play, Pause, Lock, ShieldCheck, Sparkles, 
  ArrowLeft, Heart, Image as ImageIcon, Volume2, Ticket, CheckCheck, 
  ExternalLink, ChevronRight, AlertCircle, MessageCircle, Maximize2,
  LogOut, Mic, MicOff, Square, Trash2, Check, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_CHAT_ROOMS } from '../data/initialData';
import { sendChatMessage, fetchChatMessages } from '../services/api';

export function KakaoSecretMessengerModal({ 
  isOpen, 
  onClose, 
  chatRooms = [], 
  setChatRooms, 
  currentUser, 
  onOpenDonate, 
  onOpenCharge,
  theme: themeProp,
  initialRoomId
}) {
  const [selectedRoomId, setSelectedRoomId] = useState(() => initialRoomId || chatRooms[0]?.id || null);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'chat'
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [aiWarning, setAiWarning] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Detect theme from prop or DOM attribute
  const isDark = themeProp ? themeProp === 'dark' : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  // Synchronize active room
  const activeRoom = chatRooms.find(r => r.id === selectedRoomId) || (chatRooms.length > 0 ? chatRooms[0] : null);
  const isRoot = currentUser?.role === 'admin';
  const isRoomUnlocked = isRoot || Boolean(activeRoom?.isUnlocked);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeRoom?.messages?.length]);

  // Sync initialRoomId if passed
  useEffect(() => {
    if (initialRoomId) {
      setSelectedRoomId(initialRoomId);
      setMobileView('chat');
    }
  }, [initialRoomId, isOpen]);

  // Real-time backend message polling (2 accounts sync)
  useEffect(() => {
    if (!isOpen || !activeRoom?.id) return;

    const syncMessages = async () => {
      try {
        const serverMsgs = await fetchChatMessages({ roomId: activeRoom.id });
        if (serverMsgs && serverMsgs.length > 0) {
          setChatRooms(prev => prev.map(r => {
            if (r.id === activeRoom.id) {
              const currentMsgs = r.messages || [];
              const merged = [...currentMsgs];
              let hasNew = false;
              serverMsgs.forEach(sm => {
                if (!merged.some(m => m.id === sm.id)) {
                  merged.push(sm);
                  hasNew = true;
                }
              });
              return hasNew ? { ...r, messages: merged } : r;
            }
            return r;
          }));
        }
      } catch (e) {}
    };

    syncMessages();
    const timer = setInterval(syncMessages, 2500);
    return () => clearInterval(timer);
  }, [isOpen, activeRoom?.id]);

  // Clean up recording timer and audio on unmount or room change
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try { mediaRecorderRef.current.stop(); } catch (e) {}
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, [selectedRoomId]);

  if (!isOpen) return null;

  // Sound Synthesizer for cute voice notes fallback
  const playCuteVoice = (msgId) => {
    try {
      if (playingAudioId === msgId) {
        setPlayingAudioId(null);
        return;
      }

      setPlayingAudioId(msgId);
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        setTimeout(() => setPlayingAudioId(null), 1500);
        return;
      }
      const audioCtx = new AudioContextClass();
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

  // Play audio (either recorded audio URL or synthesized chime)
  const handleTogglePlayAudio = (msgId, audioUrl) => {
    if (playingAudioId === msgId) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setPlayingAudioId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        setPlayingAudioId(msgId);
        audio.play().catch(e => {
          console.warn('Playback failed, falling back to synth chime:', e);
          playCuteVoice(msgId);
        });
        audio.onended = () => {
          setPlayingAudioId(null);
          audioPlayerRef.current = null;
        };
      } catch (err) {
        playCuteVoice(msgId);
      }
    } else {
      playCuteVoice(msgId);
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

  // 1. Leave Chat Room (채팅방 나가기 기능)
  const handleLeaveRoom = () => {
    if (!activeRoom) return;

    const confirmLeave = window.confirm(
      `'${activeRoom.creatorName}' 님과의 채팅방을 나가시겠습니까?\n대화 내역이 삭제되며 목록에서 제거됩니다.`
    );
    if (!confirmLeave) return;

    const nextRooms = chatRooms.filter(r => r.id !== activeRoom.id);
    setChatRooms(nextRooms);
    if (nextRooms.length > 0) {
      setSelectedRoomId(nextRooms[0].id);
    } else {
      setSelectedRoomId(null);
    }
    setMobileView('list');
  };

  // Restore initial rooms if user left all rooms and wants to reset
  const handleResetRooms = () => {
    setChatRooms(INITIAL_CHAT_ROOMS);
    if (INITIAL_CHAT_ROOMS.length > 0) {
      setSelectedRoomId(INITIAL_CHAT_ROOMS[0].id);
    }
  };

  // 2. Photo Upload Handling (사진 전송 기능)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 전송할 수 있습니다.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('10MB 이하의 이미지만 업로드 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedPhoto(event.target?.result);
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be selected again
    e.target.value = '';
  };

  // 3. Short Voice Recording Handling (음성녹음 짧게 전송 기능 - 카카오톡 스타일)
  const handleStartVoiceRecording = async () => {
    if (!isRoomUnlocked) {
      alert(`${activeRoom?.creatorName || '크리에이터'}님과의 1:1 대화는 해금 후 이용 가능합니다.`);
      return;
    }

    try {
      audioChunksRef.current = [];
      setRecordingSeconds(0);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start(200);
        setIsRecording(true);

        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => {
            if (prev >= 29) {
              // 30 seconds limit reached: auto-finish and send
              handleFinishVoiceRecording();
              return 30;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Fallback simulation timer if browser blocks mic (e.g. HTTP direct IP)
        setIsRecording(true);
        recordingTimerRef.current = setInterval(() => {
          setRecordingSeconds(prev => {
            if (prev >= 29) {
              handleFinishVoiceRecording();
              return 30;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } catch (err) {
      console.warn('Microphone access denied or unsupported, using simulation:', err);
      // Fallback simulation for HTTP or blocked permissions
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 29) {
            handleFinishVoiceRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleCancelVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleFinishVoiceRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    const duration = Math.max(1, recordingSeconds);

    const completeAndSend = (audioUrl = null) => {
      const senderName = currentUser?.name || currentUser?.nickname || '서포터';
      const durationFormatted = `0:${duration < 10 ? '0' + duration : duration}`;

      const isSenderCreator = currentUser?.role === 'creator' || currentUser?.id === activeRoom.creatorId;

      const newVoiceMsg = {
        id: `msg_voice_${Date.now()}`,
        roomId: activeRoom.id,
        creatorId: activeRoom.creatorId,
        creatorName: activeRoom.creatorName,
        senderId: currentUser?.id || 'guest',
        sender: senderName,
        senderTier: isRoot ? 'admin' : (isSenderCreator ? 'creator' : 'gold'),
        isCreator: isSenderCreator,
        text: '',
        voiceNote: {
          duration: durationFormatted,
          label: `${senderName}의 보이스 메모`,
          audioUrl: audioUrl
        },
        timestamp: '방금 전',
        ticketCost: isRoot || isSenderCreator ? 0 : 1
      };

      // Send to backend DB for cross-account real-time communication
      sendChatMessage(newVoiceMsg);

      setChatRooms(prev => prev.map(r => {
        if (r.id === activeRoom.id) {
          return {
            ...r,
            tickets: isRoot || isSenderCreator ? r.tickets : Math.max(0, (r.tickets || 1) - 1),
            lastUpdated: '방금 전',
            messages: [...(r.messages || []), newVoiceMsg]
          };
        }
        return r;
      }));

      setIsRecording(false);
      setRecordingSeconds(0);
      mediaRecorderRef.current = null;
      audioChunksRef.current = [];
    };

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.onstop = () => {
          mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          completeAndSend(audioUrl);
        };
        mediaRecorderRef.current.stop();
      } catch (e) {
        completeAndSend(null);
      }
    } else {
      completeAndSend(null);
    }
  };

  // Send Text & Photo Message
  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachedPhoto) return;
    if (!activeRoom) return;

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
    const userPhoto = attachedPhoto;
    setInputText('');
    setAttachedPhoto(null);

    const isSenderCreator = currentUser?.role === 'creator' || currentUser?.id === activeRoom.creatorId;

    const newMsg = {
      id: newMsgId,
      roomId: activeRoom.id,
      creatorId: activeRoom.creatorId,
      creatorName: activeRoom.creatorName,
      senderId: currentUser?.id || 'guest',
      sender: `${currentUser?.name || currentUser?.nickname || (isSenderCreator ? activeRoom.creatorName : '서포터')}`,
      senderTier: isRoot ? 'admin' : (isSenderCreator ? 'creator' : 'gold'),
      isCreator: isSenderCreator,
      text: userText,
      photoUrl: userPhoto || null,
      timestamp: '방금 전',
      ticketCost: isRoot || isSenderCreator ? 0 : 1
    };

    // Send to backend DB for cross-account real-time communication
    sendChatMessage(newMsg);

    // Update room messages & deduct ticket if supporter
    setChatRooms(prev => prev.map(r => {
      if (r.id === activeRoom.id) {
        return {
          ...r,
          tickets: isRoot || isSenderCreator ? r.tickets : Math.max(0, (r.tickets || 1) - 1),
          lastUpdated: '방금 전',
          messages: [...(r.messages || []), newMsg]
        };
      }
      return r;
    }));

    // Trigger subtle confetti
    try {
      confetti({ particleCount: 20, spread: 45, origin: { y: 0.85 } });
    } catch (err) {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fade-in">
      
      {/* Hidden File Input for Photo Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/*" 
        onChange={handleImageFileChange} 
        className="hidden" 
      />

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
            <span>사진 원본 뷰어 · 화면을 클릭하면 닫힙니다</span>
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
            {chatRooms.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <p className="text-xs text-slate-400">참여 중인 채팅방이 없습니다.</p>
                <button
                  type="button"
                  onClick={handleResetRooms}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E4092B] text-white text-xs font-bold hover:bg-[#CC0022] transition-colors cursor-pointer"
                >
                  채팅방 목록 복원하기
                </button>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                검색된 크리에이터가 없습니다.
              </div>
            ) : (
              filteredRooms.map((room) => {
                const isSelected = activeRoom && room.id === activeRoom.id;
                const roomMessages = room.messages || [];
                const lastMsg = roomMessages[roomMessages.length - 1];

                let snippet = '대화가 없습니다.';
                if (lastMsg) {
                  if (lastMsg.voiceNote) snippet = '보이스 메모가 도착했습니다';
                  else if (lastMsg.photoUrl) snippet = '사진을 보냈습니다';
                  else if (lastMsg.text) snippet = lastMsg.text;
                }

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
                    {/* Active indicator line */}
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
                      {!room.isUnlocked && !isRoot && (
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
                        {snippet}
                      </p>

                      <div className="flex items-center justify-between mt-1 text-[10px]">
                        <span className={room.isUnlocked || isRoot ? (isDark ? 'text-amber-400 font-bold' : 'text-amber-600 font-bold') : 'text-slate-400'}>
                          {isRoot ? 'ROOT 마스터 무제한 소통' : room.isUnlocked ? `티켓 ${room.tickets || 0}장 보유` : `${room.requiredCarrots} 당근 후원 시 해금`}
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
              })
            )}
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
          {!activeRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base">열려있는 채팅방이 없습니다</h3>
                <p className="text-xs text-slate-400 mt-1">왼쪽 목록에서 크리에이터를 선택하거나 대화방을 시작해보세요.</p>
              </div>
              <button
                type="button"
                onClick={handleResetRooms}
                className="px-4 py-2 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs cursor-pointer transition-colors"
              >
                전체 채팅방 목록 복원
              </button>
            </div>
          ) : (
            <>
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
                      <span>{isRoot ? '최고 관리자 (ROOT)' : `${activeRoom.tierName} 등급 서포터`}</span>
                      <span>·</span>
                      <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        잔여 티켓: {isRoot ? '무제한' : `${activeRoom.tickets || 0}장`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions (Leave Room / Donate / Close) */}
                <div className="flex items-center gap-2">
                  {/* Leave Room Button (채팅방 나가기) */}
                  <button
                    type="button"
                    onClick={handleLeaveRoom}
                    title="채팅방 나가기"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isDark 
                        ? 'border-white/10 hover:border-rose-500/50 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400' 
                        : 'border-slate-200/80 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                    }`}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">나가기</span>
                  </button>

                  <button
                    onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs flex items-center gap-1 shadow-sm shadow-[#E4092B]/20 cursor-pointer active:scale-95 transition-all"
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
                {!isRoomUnlocked && (
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

                {/* Empty Room State */}
                {(!activeRoom.messages || activeRoom.messages.length === 0) && isRoomUnlocked && (
                  <div className="py-16 text-center space-y-3">
                    <div className={`w-14 h-14 mx-auto rounded-3xl flex items-center justify-center ${
                      isDark ? 'bg-white/5 text-slate-400' : 'bg-rose-50 text-[#E4092B]'
                    }`}>
                      <MessageCircle className="w-7 h-7" />
                    </div>
                    <h4 className={`font-heading font-bold text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
                      대화 내역이 없습니다
                    </h4>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                      {activeRoom.creatorName}님에게 따뜻한 응원 메시지나 사진, 짧은 음성 메모를 남겨보세요.
                    </p>
                  </div>
                )}

                {/* Messages Feed */}
                {(activeRoom.messages || []).map((msg) => {
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

                      <div className="max-w-[80%] sm:max-w-[70%] space-y-1">
                        {!isMe && (
                          <span className={`text-[11px] font-semibold block ml-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {msg.sender}
                          </span>
                        )}

                        {/* Speech Bubble */}
                        <div className={`p-3.5 sm:p-4 rounded-2xl text-[13px] leading-relaxed ${
                          isMe 
                            ? (isDark 
                                ? 'bg-[#E4092B]/25 text-rose-100 border border-[#E4092B]/40 shadow-xs rounded-tr-xs' 
                                : 'bg-[#FFF5F7] text-slate-900 border border-rose-100/70 shadow-xs rounded-tr-xs')
                            : (isDark 
                                ? 'bg-white/10 text-slate-100 border border-white/15 shadow-xs rounded-tl-xs' 
                                : 'bg-white text-slate-900 border border-slate-200/70 shadow-xs rounded-tl-xs')
                        }`}>
                          {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                          {/* Attached Photo Display (카카오톡 스타일 사진 전송) */}
                          {msg.photoUrl && (
                            <div className={`relative rounded-xl overflow-hidden group border shadow-xs ${
                              msg.text ? 'mt-2.5' : ''
                            } ${isDark ? 'border-white/15' : 'border-slate-200/60'}`}>
                              <img 
                                src={msg.photoUrl} 
                                alt="전송된 사진" 
                                className="w-full max-h-64 object-cover rounded-xl cursor-pointer hover:scale-101 transition-transform duration-200"
                                onClick={() => setLightboxPhoto(msg.photoUrl)}
                              />
                              <div 
                                onClick={() => setLightboxPhoto(msg.photoUrl)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-xs font-medium gap-1.5"
                              >
                                <Maximize2 className="w-4 h-4" />
                                <span>크게 보기</span>
                              </div>
                            </div>
                          )}

                          {/* Attached Voice Note Bubble (카카오톡 스타일 음성녹음 재생) */}
                          {msg.voiceNote && (
                            <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                              msg.text ? 'mt-2.5' : ''
                            } ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/60'}`}>
                              <button
                                type="button"
                                onClick={() => handleTogglePlayAudio(msg.id, msg.voiceNote.audioUrl)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                  playingAudioId === msg.id 
                                    ? 'bg-[#E4092B] text-white animate-pulse' 
                                    : (isDark ? 'bg-white/15 hover:bg-[#E4092B] text-white' : 'bg-slate-900 hover:bg-[#E4092B] text-white shadow-xs')
                                }`}
                              >
                                {playingAudioId === msg.id ? (
                                  <Pause className="w-3.5 h-3.5" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 ml-0.5 fill-current" />
                                )}
                              </button>

                              <div className="flex-1 min-w-0">
                                <span className={`font-bold text-xs block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {msg.voiceNote.label || '보이스 메모'}
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

              {/* Attached Photo Preview thumbnail above input */}
              {attachedPhoto && (
                <div className={`px-4 py-2 border-t flex items-center justify-between ${
                  isDark ? 'bg-[#090D14] border-white/10' : 'bg-slate-50 border-slate-200/80'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={attachedPhoto} 
                      alt="첨부된 사진" 
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div className="text-xs">
                      <span className="font-bold block">사진이 첨부되었습니다</span>
                      <span className="text-[11px] text-slate-400">메시지와 함께 전송됩니다</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedPhoto(null)}
                    className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Voice Recording Active Bar (음성 녹음 중 UI) */}
              {isRecording ? (
                <div className={`p-3 sm:p-4 border-t flex items-center justify-between ${
                  isDark ? 'bg-[#090D14] border-white/10' : 'bg-rose-50/60 border-rose-200/60'
                }`}>
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-heading font-black text-rose-600 text-xs font-num">
                      녹음 중 0:{recordingSeconds < 10 ? '0' + recordingSeconds : recordingSeconds} / 0:30
                    </span>
                    <div className="hidden sm:flex items-center gap-1 h-4">
                      <span className="w-1 rounded-full bg-rose-500 h-3 animate-bounce"></span>
                      <span className="w-1 rounded-full bg-rose-500 h-5 animate-pulse"></span>
                      <span className="w-1 rounded-full bg-rose-500 h-2 animate-bounce"></span>
                      <span className="w-1 rounded-full bg-rose-500 h-4 animate-pulse"></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCancelVoiceRecording}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200/60 text-xs font-bold text-slate-600 cursor-pointer transition-colors"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      onClick={handleFinishVoiceRecording}
                      className="px-4 py-1.5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>완료 및 전송</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Chat Input Bottom Form (사진/음성/텍스트 전송) */
                <div className={`p-3 sm:p-4 border-t ${
                  isDark ? 'bg-[#090D14] border-white/10' : 'bg-white border-slate-100'
                }`}>
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    
                    {/* Photo Upload Button */}
                    <button
                      type="button"
                      disabled={!isRoomUnlocked}
                      onClick={() => fileInputRef.current?.click()}
                      title="사진 전송"
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>

                    {/* Short Voice Record Button */}
                    <button
                      type="button"
                      disabled={!isRoomUnlocked}
                      onClick={handleStartVoiceRecording}
                      title="음성 녹음 (최대 30초)"
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Text Input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={inputText}
                        disabled={!isRoomUnlocked}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={
                          isRoot
                            ? `${activeRoom.creatorName}님에게 root 관리자 메시지 전송`
                            : activeRoom.isUnlocked
                            ? `${activeRoom.creatorName}님에게 메시지 보내기 (티켓 1장)`
                            : '골드 래빗 등급 달성 후 이용 가능합니다.'
                        }
                        className={`w-full pl-4 pr-4 py-2.5 rounded-2xl text-xs transition-all disabled:opacity-60 ${
                          isDark
                            ? 'bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E4092B]/30 focus:border-[#E4092B]/60'
                            : 'bg-slate-50 border border-slate-200/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50'
                        }`}
                      />
                    </div>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!isRoomUnlocked || (!inputText.trim() && !attachedPhoto)}
                      className="w-10 h-10 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-[#E4092B]/20 cursor-pointer active:scale-95 shrink-0"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
                    <span>{isRoot ? 'root 관리자 권한으로 무제한 발송됩니다.' : '메시지 발송 시 소통 티켓 1장이 차감됩니다.'}</span>
                    <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      잔여 티켓: {isRoot ? '무제한' : `${activeRoom.tickets || 0}장`}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
}
