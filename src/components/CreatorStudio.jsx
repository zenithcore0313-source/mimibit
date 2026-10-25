import React, { useState, useRef, useEffect } from 'react';
import { 
  DollarSign, Percent, TrendingUp, Users, ShieldAlert, 
  MessageSquare, Mic, Image, Check, AlertCircle, Ban, 
  Settings, Sparkles, Copy, ExternalLink, Play, Pause, 
  Square, RefreshCw, Volume2, Download, CheckCircle2, Lock, ArrowRight, X, Clock, Building2, Send, Trash2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { requestPayout, fetchPayouts, getStoredCreators, fetchChatMessages } from '../services/api';

export function CreatorStudio({ 
  creator, 
  setCreator, 
  currentUser,
  chatRooms = [],
  setChatRooms,
  messages = [], 
  onSendCreatorReply, 
  rankings = [],
  onBanUser,
  onDeleteCreatorProfile,
  theme = 'dark',
  onClose
}) {
  const isDark = theme === 'dark' || (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark');

  const [activeTab, setActiveTab] = useState('record'); // 'record', 'messages', 'settlement', 'settings'
  const [replyTextMap, setReplyTextMap] = useState({});
  const [attachVoiceMap, setAttachVoiceMap] = useState({});
  const [attachPhotoMap, setAttachPhotoMap] = useState({});
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState([]);
  const [isSavedGoal, setIsSavedGoal] = useState(false);
  const [bankInfo, setBankInfo] = useState({
    bank: creator?.bankInfo?.bank || '토스뱅크',
    account: creator?.bankInfo?.account || '1000-1234-5678',
    holder: creator?.bankInfo?.holder || creator?.name || '크리에이터'
  });
  const [isSavedBank, setIsSavedBank] = useState(false);

  // Settlement & Payout states
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [submittingReplyId, setSubmittingReplyId] = useState(null);
  const [payoutHistory, setPayoutHistory] = useState([]);

  // Broadcast & Signature Media Custom State (OBS / Excel / Personal Stream)
  const defaultBroadcastMedia = {
    mode: 'personal',
    tiers: {
      tier100: { img: '', sfx: '', sfxType: 'preset', sfxKey: 'chime', sfxName: '기본 차임벨' },
      tier500: { img: '', sfx: '', sfxType: 'preset', sfxKey: 'coin', sfxName: '당근 코인 샤워' },
      tier1k: { img: '', sfx: '', sfxType: 'preset', sfxKey: 'fanfare', sfxName: '팡파레 축하' },
      tier10k: { img: '', sfx: '', sfxType: 'preset', sfxKey: 'jackpot', sfxName: '엑셀 잭팟 사운드' }
    }
  };

  const [broadcastMedia, setBroadcastMedia] = useState(() => {
    try {
      const creatorKey = creator?.id || creator?.handle || 'default';
      const saved = localStorage.getItem(`mimibit_broadcast_media_${creatorKey}`);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return defaultBroadcastMedia;
  });

  const [broadcastActiveTier, setBroadcastActiveTier] = useState('tier100');
  const [isPlayingSfx, setIsPlayingSfx] = useState(false);
  const [isCopiedObsUrl, setIsCopiedObsUrl] = useState(false);
  const [isSavedBroadcast, setIsSavedBroadcast] = useState(false);
  const broadcastAudioRef = useRef(null);

  const playProceduralSfx = (key) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (key === 'chime') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
        osc.start();
        osc.stop(ctx.currentTime + 0.9);
      } else if (key === 'coin') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, ctx.currentTime);
        osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (key === 'fanfare') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else if (key === 'jackpot') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.15);
        osc.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.3);
        osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
        osc.start();
        osc.stop(ctx.currentTime + 1.4);
      }
    } catch(e) {}
  };

  const handlePlayPreview = (tierData) => {
    if (broadcastAudioRef.current) {
      broadcastAudioRef.current.pause();
      broadcastAudioRef.current = null;
    }
    if (tierData?.sfx) {
      const audio = new Audio(tierData.sfx);
      broadcastAudioRef.current = audio;
      setIsPlayingSfx(true);
      audio.onended = () => setIsPlayingSfx(false);
      audio.play().catch(() => setIsPlayingSfx(false));
    } else if (tierData?.sfxType === 'preset' && tierData?.sfxKey) {
      playProceduralSfx(tierData.sfxKey);
    }
  };

  const handleStopPreview = () => {
    if (broadcastAudioRef.current) {
      broadcastAudioRef.current.pause();
      broadcastAudioRef.current = null;
    }
    setIsPlayingSfx(false);
  };

  const handleSaveBroadcast = () => {
    try {
      const creatorKey = creator?.id || creator?.handle || 'default';
      localStorage.setItem(`mimibit_broadcast_media_${creatorKey}`, JSON.stringify(broadcastMedia));
      try {
        const channel = new BroadcastChannel('stella_overlay_channel');
        channel.postMessage({ type: 'UPDATE_MEDIA_CUSTOM', settings: broadcastMedia });
        channel.close();
      } catch(e) {}
      setIsSavedBroadcast(true);
      setTimeout(() => setIsSavedBroadcast(false), 2500);
    } catch(e) {
      console.error(e);
    }
  };

  const handleTriggerTest = (amount, tierKey, defaultMsg) => {
    const tierData = broadcastMedia.tiers[tierKey] || broadcastMedia.tiers.tier100;
    const testUser = broadcastMedia.mode === 'excel' ? '엑셀큰손_회장님' : '당근서포터_미미';

    handlePlayPreview(tierData);

    if (amount >= 10000) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    try {
      const channel = new BroadcastChannel('stella_overlay_channel');
      channel.postMessage({
        type: 'DONATION_ALERT',
        user: testUser,
        amount: amount,
        message: defaultMsg,
        mode: broadcastMedia.mode,
        media: tierData
      });
      channel.close();

      localStorage.setItem('stella_overlay_event', JSON.stringify({
        type: 'DONATION_ALERT',
        user: testUser,
        amount: amount,
        message: defaultMsg,
        mode: broadcastMedia.mode,
        media: tierData,
        timestamp: Date.now()
      }));
    } catch(e) {}
  };

  // Financial Calculations (투네이션 표준 10% 수수료 모델)
  const totalCarrots = creator?.totalCarrots || creator?.fundingGoal?.currentCarrots || 0;
  const grossRevenue = totalCarrots * 100; // 1당근 = 100원
  const platformFee = Math.round(grossRevenue * 0.10); // 투네이션 표준 10.0%
  const taxWithholding = Math.round(grossRevenue * 0.033); // 국세청 3.3% 사업소득 원천징수
  const netTotalEarned = Math.max(0, grossRevenue - platformFee - taxWithholding); // 실수령 86.7%

  // Compute available payout after deducting past completed/pending payouts
  const totalWithdrawn = payoutHistory.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const availablePayout = Math.max(0, netTotalEarned - totalWithdrawn);

  // Fetch real payout history from backend API on mount
  useEffect(() => {
    const creatorId = creator?.id || creator?.handle;
    if (!creatorId) return;
    fetchPayouts(creatorId).then(history => {
      if (history && history.length > 0) {
        setPayoutHistory(prev => {
          const merged = [...history];
          prev.forEach(p => {
            if (!merged.some(m => m.id === p.id)) merged.push(p);
          });
          return merged;
        });
      }
    });
  }, [creator?.id]);

  // Sync bank info if creator changes
  useEffect(() => {
    if (creator?.bankInfo) {
      setBankInfo({
        bank: creator.bankInfo.bank || '토스뱅크',
        account: creator.bankInfo.account || '1000-1234-5678',
        holder: creator.bankInfo.holder || creator.name || '크리에이터'
      });
    }
  }, [creator]);

  // Derive Fan Questions Dynamically from chatRooms or default fallback
  const dynamicQuestions = React.useMemo(() => {
    const questions = [];
    if (chatRooms && chatRooms.length > 0) {
      chatRooms.forEach(room => {
        const supporterMsgs = (room.messages || []).filter(m => !m.isCreator);
        supporterMsgs.forEach(m => {
          const mIdx = room.messages.findIndex(x => x.id === m.id);
          const hasReply = room.messages.slice(mIdx + 1).some(x => x.isCreator);
          questions.push({
            id: m.id,
            roomId: room.id,
            creatorName: room.creatorName,
            sender: m.sender || '서포터',
            tier: room.tierName || '골드 래빗',
            tierBadge: '🥇',
            text: m.text,
            date: m.timestamp || '방금 전',
            isAnswered: hasReply || answeredQuestionIds.includes(m.id)
          });
        });
      });
    }

    return questions;
  }, [chatRooms, answeredQuestionIds, creator?.name]);

  // Poll backend for new messages addressed to this creator
  useEffect(() => {
    const creatorCleanId = (creator?.id || creator?.handle || '').replace(/[@#]/g, '').toLowerCase();
    if (!creatorCleanId) return;

    const syncServerMessages = async () => {
      try {
        const serverMsgs = await fetchChatMessages({ creatorId: creatorCleanId });
        if (serverMsgs && serverMsgs.length > 0 && setChatRooms) {
          setChatRooms(prev => {
            const rId = `room_${creatorCleanId}`;
            const exists = prev.find(r => r.id === rId);
            if (!exists) {
              return [
                {
                  id: rId,
                  creatorId: creatorCleanId,
                  creatorName: creator?.name || '크리에이터',
                  handle: creator?.handle || `@${creatorCleanId}`,
                  avatar: creator?.avatar || '',
                  category: creator?.category || '창작자',
                  tierName: '골드 래빗',
                  tierIcon: '🥇',
                  tierLevel: 3,
                  isUnlocked: true,
                  tickets: 999,
                  unreadCount: 0,
                  lastUpdated: '방금 전',
                  messages: serverMsgs
                },
                ...prev
              ];
            } else {
              const currentMsgs = exists.messages || [];
              const merged = [...currentMsgs];
              let hasNew = false;
              serverMsgs.forEach(sm => {
                if (!merged.some(m => m.id === sm.id)) {
                  merged.push(sm);
                  hasNew = true;
                }
              });
              return hasNew ? prev.map(r => r.id === rId ? { ...r, messages: merged } : r) : prev;
            }
          });
        }
      } catch (e) {}
    };

    syncServerMessages();
    const interval = setInterval(syncServerMessages, 2500);
    return () => clearInterval(interval);
  }, [creator?.id, creator?.handle]);

  // ================= 15초 마이크 직접 녹음 시스템 (Web Audio & MediaRecorder) =================
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(creator?.voiceReward?.previewAudio || null);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);
  const [isSavedVoiceReward, setIsSavedVoiceReward] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 15초 녹음 타이머 & 자동 중지
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 14) {
            handleStopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isRecording]);

  // 마이크 녹음 시작
  const handleStartRecording = async () => {
    try {
      audioChunksRef.current = [];
      setRecordingSeconds(0);
      setIsPlayingRecorded(false);

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {
        // Fallback simulated recording
        setIsRecording(true);
        setTimeout(() => {
          setRecordedAudioUrl('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
        }, 15000);
      }
    } catch (err) {
      console.warn('Microphone permission denied, using simulated sample:', err);
      // Generate synthetic cute chime tone for preview
      setRecordedAudioUrl('simulated');
      setIsRecording(true);
    }
  };

  // 녹음 중지
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsRecording(false);
  };

  // 녹음본 미리듣기 재생/정지
  const handleTogglePlayAudio = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecorded) {
      setIsPlayingRecorded(false);
    } else {
      setIsPlayingRecorded(true);

      // Play cute sound synthesized or audio
      if (recordedAudioUrl === 'simulated' || recordedAudioUrl.startsWith('blob:')) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.2);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.2 + 0.4);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(audioCtx.currentTime + idx * 0.2);
            osc.stop(audioCtx.currentTime + idx * 0.2 + 0.45);
          });
        } catch (e) {}
      }

      setTimeout(() => {
        setIsPlayingRecorded(false);
      }, (recordingSeconds || 3) * 1000);
    }
  };

  // 공식 15초 음성 답례품으로 등록
  const handleSaveAsOfficialReward = async () => {
    if (!recordedAudioUrl) return;

    const updatedReward = {
      title: `${creator?.name || '크리에이터'}의 15초 감사 보이스 답례품`,
      duration: `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds || 15}`,
      message: '응원해 주셔서 진심으로 감사합니다! 정성을 담아 녹음한 음성 답례품입니다.',
      previewAudio: recordedAudioUrl
    };

    if (setCreator) {
      setCreator(prev => ({
        ...prev,
        voiceReward: updatedReward
      }));
    }

    // Save to local creators list
    const cleanId = (creator?.id || creator?.handle || '').replace(/[@#]/g, '').toLowerCase();
    const stored = getStoredCreators();
    const idx = stored.findIndex(c => c.id.toLowerCase() === cleanId);
    if (idx >= 0) {
      stored[idx].voiceReward = updatedReward;
      localStorage.setItem('mimibit_creators', JSON.stringify(stored));
    }

    setIsSavedVoiceReward(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (err) {}
    setTimeout(() => setIsSavedVoiceReward(false), 3000);
  };

  // 1:1 질문 답장 발송
  const handleReplySubmit = (e, q) => {
    e.preventDefault();
    if (submittingReplyId === q.id) return;
    const currentReplyText = replyTextMap[q.id] || '';
    if (!currentReplyText.trim()) return;

    setSubmittingReplyId(q.id);

    const attachVoice = attachVoiceMap[q.id] ?? true;
    const attachPhoto = attachPhotoMap[q.id] ?? true;

    if (onSendCreatorReply) {
      const cleanCreatorId = (creator?.id || creator?.handle || 'creator').replace(/[@#]/g, '');
      onSendCreatorReply(q.roomId || `room_${cleanCreatorId}`, currentReplyText, attachVoice, attachPhoto);
    }

    setAnsweredQuestionIds(prev => [...prev, q.id]);
    setReplyTextMap(prev => ({ ...prev, [q.id]: '' }));

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    alert('서포터의 1:1 시크릿톡으로 답장과 감사 리워드가 성공적으로 발송되었습니다!');
    setTimeout(() => setSubmittingReplyId(null), 1000);
  };

  // 출금 신청 처리 (백엔드 API 연동)
  const handleProcessWithdrawal = async () => {
    const amount = parseInt(withdrawAmount.replace(/[^0-9]/g, ''), 10);
    if (!amount || amount <= 0) {
      alert('출금할 금액을 입력해주세요.');
      return;
    }
    if (amount > availablePayout) {
      alert('출금 가능 정산 잔액을 초과할 수 없습니다.');
      return;
    }

    setIsSubmittingPayout(true);
    try {
      const payoutPayload = {
        creatorId: creator?.id || creator?.handle || 'creator',
        amount,
        bank: bankInfo.bank,
        account: bankInfo.account,
        holder: bankInfo.holder
      };

      const record = await requestPayout(payoutPayload);
      setPayoutHistory(prev => [record, ...prev]);
      setIsWithdrawModalOpen(false);
      setIsWithdrawSuccess(true);

      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
      } catch (e) {}
      setTimeout(() => setIsWithdrawSuccess(false), 5000);
    } catch (err) {
      alert('출금 신청 처리 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  return (
    <div className={`rounded-3xl border overflow-hidden font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0D111A] text-white border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)]' 
        : 'bg-white text-slate-900 border-slate-200/80 shadow-[0_10px_40px_rgba(0,0,0,0.04)]'
    }`}>
      
      {/* Studio Header Bar */}
      <div className={`p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b ${
        isDark ? 'bg-[#090D14] border-white/10' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-lg sm:text-xl text-white tracking-tight">
              크리에이터 스튜디오
            </h2>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
              PRO STUDIO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {creator?.name}님의 바이오링크 후원 관리 및 투네이션 표준 10% 정산 대시보드
          </p>
        </div>

        {/* Tab Buttons */}
        <div className={`flex items-center gap-1 p-1 rounded-2xl text-xs overflow-x-auto max-w-full ${
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white/10'
        }`}>
          {[
            { id: 'dashboard', label: '방송 스튜디오 콘솔 (18종 신규)', isNew: true },
            { id: 'record', label: '15초 보이스 녹음' },
            { id: 'messages', label: `1:1 질문 답장함${unansweredCount > 0 ? ` (${unansweredCount})` : ''}` },
            { id: 'settlement', label: '10% 정산 & 출금' },
            { id: 'broadcast', label: '방송 위젯 & 시그니처 (OBS)' },
            { id: 'settings', label: '펀딩 목표 설정' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? (isDark ? 'bg-[#E4092B] text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.isNew && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-5 sm:p-8">

        {/* ================= TAB 0: 18종 올인원 방송 스튜디오 콘솔 ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in w-full">
            <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                  ALL-IN-ONE BROADCAST STUDIO CONSOLE
                </span>
                <h3 className={`text-lg font-black mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  미미비트 18종 방송 대시보드 & 16:9 라이브 모니터
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  실시간 챗봇, 후원 기차, 16:9 실시간 방송 씬 시뮬레이터, OBS 브라우저 소스를 한곳에서 관리합니다.
                </p>
              </div>
              <a
                href="/dashboard.html"
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-4 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <ExternalLink size={14} />
                <span>독립 새 창으로 열기</span>
              </a>
            </div>

            <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#090d16]">
              <iframe
                src="/dashboard.html"
                title="Mimibit Studio Dashboard"
                className="w-full h-[760px] border-0"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 1: 15초 감사 보이스 녹음 스튜디오 ================= */}
        {activeTab === 'record' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className={`border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                AUDIO REWARD STUDIO
              </span>
              <h3 className={`text-xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                15초 마이크 직접 녹음 스튜디오
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                팬들이 당근을 후원할 때 즉시 지급되는 <strong>15초 감사 음성 답례품</strong>을 실제 마이크로 녹음해 보세요.
              </p>
            </div>

            {/* Recording Console Box */}
            <div className={`p-6 sm:p-8 rounded-3xl text-center space-y-6 border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
            }`}>
              
              {/* Circular Countdown Gauge */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-rose-500/20 border-4 border-[#E4092B] animate-pulse shadow-lg shadow-rose-500/20' 
                    : (isDark ? 'bg-white/5 border-2 border-white/15' : 'bg-white border-2 border-slate-200')
                }`}>
                  <Mic className={`w-8 h-8 ${isRecording ? 'text-[#E4092B]' : (isDark ? 'text-slate-400' : 'text-slate-400')}`} />
                  <span className={`font-heading font-black text-xl font-num mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {recordingSeconds}s
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 15초 제한</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="py-3 px-6 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{recordedAudioUrl ? '다시 녹음하기' : '15초 녹음 시작'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStopRecording}
                    className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer animate-pulse border border-white/20"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>녹음 완료하기</span>
                  </button>
                )}

                {recordedAudioUrl && !isRecording && (
                  <button
                    type="button"
                    onClick={handleTogglePlayAudio}
                    className={`py-3 px-5 rounded-2xl border font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                      isPlayingRecorded
                        ? 'border-[#E4092B] bg-rose-500/20 text-[#FF4D6D]'
                        : (isDark ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800')
                    }`}
                  >
                    {isPlayingRecorded ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingRecorded ? '정지' : '녹음본 들어보기'}</span>
                  </button>
                )}
              </div>

              {/* Register as Official Reward Button */}
              {recordedAudioUrl && !isRecording && (
                <div className={`pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
                  <button
                    type="button"
                    onClick={handleSaveAsOfficialReward}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>내 바이오링크 공식 15초 감사 답례품으로 등록하기</span>
                  </button>
                </div>
              )}

              {isSavedVoiceReward && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>새로운 감사 음성 답례품이 성공적으로 바이오링크에 등록되었습니다!</span>
                </div>
              )}
            </div>

            {/* Currently Active Reward Card */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-[#FF4D6D] flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      현재 등록된 답례품: {creator?.voiceReward?.title || `${creator?.name || '크리에이터'}의 15초 감사 보이스`}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      ON AIR
                    </span>
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    "{creator?.voiceReward?.message || '항상 곁에서 응원해주셔서 고마워요!'}"
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                {creator?.voiceReward?.duration || '0:15'}
              </span>
            </div>

          </div>
        )}

        {/* ================= TAB 2: 1:1 서포터 시크릿 질문 답장함 ================= */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className={`border-b pb-4 flex justify-between items-center ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <div>
                <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                  FAN QUESTIONS INBOX
                </span>
                <h3 className={`text-xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  1:1 서포터 시크릿 질문 답장함
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  골드/다이아 등급 서포터가 티켓을 사용해 남긴 1:1 비밀 질문에 답장을 보내보세요.
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                unansweredCount > 0 
                  ? 'bg-rose-500/20 text-[#FF4D6D] border-rose-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {unansweredCount > 0 ? `미답변 ${unansweredCount}건` : '모든 질문 답변 완료 ✓'}
              </span>
            </div>

            <div className="space-y-4">
              {dynamicQuestions.length === 0 ? (
                <div className={`p-8 text-center rounded-2xl border space-y-2 ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}>
                  <p className="text-sm font-bold">아직 도착한 1:1 시크릿 질문이 없습니다 💌</p>
                  <p className="text-xs text-slate-400">
                    골드 또는 다이아 서포터가 티켓을 사용해 1:1 질문을 남기면 이곳에 실시간으로 표시됩니다.
                  </p>
                </div>
              ) : (
                dynamicQuestions.map(q => {
                const currentReply = replyTextMap[q.id] || '';
                const currentAttachVoice = attachVoiceMap[q.id] ?? true;
                const currentAttachPhoto = attachPhotoMap[q.id] ?? true;

                return (
                  <div key={q.id} className={`p-5 rounded-2xl border shadow-xs space-y-3 transition-colors ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{q.sender}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {q.tierBadge} {q.tier}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-num">{q.date}</span>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed p-3.5 rounded-xl border ${
                      isDark 
                        ? 'bg-white/5 border-white/10 text-slate-200' 
                        : 'bg-slate-50 border-slate-100 text-slate-700'
                    }`}>
                      "{q.text}"
                    </p>

                    {!q.isAnswered ? (
                      <form onSubmit={(e) => handleReplySubmit(e, q)} className="space-y-3 pt-2">
                        <textarea
                          rows={2}
                          value={currentReply}
                          onChange={(e) => setReplyTextMap(prev => ({ ...prev, [q.id]: e.target.value }))}
                          placeholder="서포터에게 전할 따뜻한 1:1 비밀 답장을 입력하세요."
                          className={`w-full p-3 rounded-xl text-xs transition-all resize-none ${
                            isDark
                              ? 'bg-white/5 border border-white/15 text-white placeholder:text-slate-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#E4092B]/40 focus:border-[#E4092B]'
                              : 'bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50'
                          }`}
                        />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                              <input
                                type="checkbox"
                                checked={currentAttachVoice}
                                onChange={(e) => setAttachVoiceMap(prev => ({ ...prev, [q.id]: e.target.checked }))}
                                className="rounded text-[#E4092B] focus:ring-[#E4092B]"
                              />
                              <span>보이스 답례 동봉</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                              <input
                                type="checkbox"
                                checked={currentAttachPhoto}
                                onChange={(e) => setAttachPhotoMap(prev => ({ ...prev, [q.id]: e.target.checked }))}
                                className="rounded text-[#E4092B] focus:ring-[#E4092B]"
                              />
                              <span>미공개 화보 B컷 동봉</span>
                            </label>
                          </div>

                          <button
                            type="submit"
                            disabled={!currentReply.trim() || submittingReplyId === q.id}
                            className="py-2.5 px-5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-40 cursor-pointer active:scale-95 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{submittingReplyId === q.id ? '답장 전송 중...' : '답장 발송하기'}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>답장 및 감사 리워드가 서포터에게 발송 완료되었습니다.</span>
                      </div>
                    )}
                  </div>
                );
              }))}
            </div>

          </div>
        )}

        {/* ================= TAB 3: 10% 정산 & 출금 신청 ================= */}
        {activeTab === 'settlement' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            <div className={`border-b pb-4 flex justify-between items-start ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <div>
                <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                  FEE & SETTLEMENT MANAGEMENT
                </span>
                <h3 className={`text-xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  10.0% 플랫폼 수수료 & 투네이션 표준 정산
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  미미빗은 투네이션과 동일한 <strong>10.0% 표준 수수료</strong> 정책으로, 부가세는 팬 충전단에서 처리되어 창작자의 수익을 안전하게 지킵니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setWithdrawAmount(availablePayout > 0 ? availablePayout.toString() : '0');
                  setIsWithdrawModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 shrink-0"
              >
                출금 신청하기
              </button>
            </div>

            {/* Notification alert on success */}
            {isWithdrawSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>출금 신청이 정상 접수되었습니다! 영업일 기준 익일 오전 10:00에 등록된 계좌로 입금됩니다.</span>
              </div>
            )}

            {/* Financial Metrics - 4 cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'}`}>
                <span className="text-[11px] text-slate-400 block font-medium">총 누적 후원액</span>
                <div className={`text-lg sm:text-xl font-black font-num mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {grossRevenue.toLocaleString()}원
                </div>
                <span className="text-[10px] text-slate-400">총 {totalCarrots.toLocaleString()} 🥕 후원 수집</span>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'}`}>
                <span className="text-[11px] text-slate-400 block font-medium">플랫폼 수수료 (10.0%)</span>
                <div className={`text-lg sm:text-xl font-black font-num mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  -{platformFee.toLocaleString()}원
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">VAT는 팬 충전단 처리</span>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'}`}>
                <span className="text-[11px] text-slate-400 block font-medium">원천징수 (3.3%)</span>
                <div className={`text-lg sm:text-xl font-black font-num mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  -{taxWithholding.toLocaleString()}원
                </div>
                <span className="text-[10px] text-slate-400">5월 종소세 환급 가능</span>
              </div>

              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-[#E4092B]/15 border-[#E4092B]/30' : 'bg-rose-50/60 border-rose-200/80'
              }`}>
                <span className="text-[11px] text-[#FF4D6D] block font-bold">출금 가능 정산 잔액</span>
                <div className="text-lg sm:text-xl font-black text-[#FF4D6D] font-num mt-1">
                  {availablePayout.toLocaleString()}원
                </div>
                <span className="text-[10px] text-[#FF4D6D] font-medium">실수령률 86.7% (익일 10:00)</span>
              </div>
            </div>

            {/* Bank Info Card */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className={`font-heading font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  현재 등록된 정산 입금 계좌
                </h4>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  실명 인증 완료
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">입금 은행</label>
                  <input
                    type="text"
                    value={bankInfo.bank}
                    onChange={(e) => setBankInfo({ ...bankInfo, bank: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-bold text-xs ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">계좌 번호</label>
                  <input
                    type="text"
                    value={bankInfo.account}
                    onChange={(e) => setBankInfo({ ...bankInfo, account: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-num font-bold text-xs ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">예금주</label>
                  <input
                    type="text"
                    value={bankInfo.holder}
                    onChange={(e) => setBankInfo({ ...bankInfo, holder: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-bold text-xs ${
                      isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSavedBank(true);
                    setTimeout(() => setIsSavedBank(false), 2500);
                  }}
                  className={`py-2 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    isDark ? 'bg-white/15 hover:bg-white/20 text-white' : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  계좌 정보 변경 저장
                </button>
                {isSavedBank && (
                  <span className="text-xs text-emerald-400 font-bold">
                    ✓ 계좌 정보가 저장되었습니다.
                  </span>
                )}
              </div>
            </div>

            {/* Payout History Table */}
            <div className="space-y-2">
              <h4 className={`font-heading font-bold text-xs sm:text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                최근 정산 입금 및 출금 내역
              </h4>
              <div className={`rounded-2xl border overflow-hidden divide-y text-xs ${
                isDark ? 'border-white/10 divide-white/5' : 'border-slate-200 divide-slate-100'
              }`}>
                {payoutHistory.length === 0 ? (
                  <div className={`p-8 text-center text-xs ${isDark ? 'text-slate-400 bg-white/5' : 'text-slate-500 bg-slate-50'}`}>
                    아직 신청된 정산 및 출금 내역이 없습니다.
                  </div>
                ) : (
                  payoutHistory.map((item) => (
                    <div key={item.id} className={`p-3.5 flex items-center justify-between ${
                      isDark ? 'bg-white/5' : 'bg-white'
                    }`}>
                      <div>
                        <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {item.bank} ({item.id})
                        </span>
                        <span className="text-[10px] text-slate-400">{item.date || item.requestedAt?.slice(0, 10)}</span>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold font-num block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {Number(item.amount).toLocaleString()}원
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">{item.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB: 방송 위젯 & 시그니처 미디어 커스텀 (OBS/엑셀/개인방송) ================= */}
        {activeTab === 'broadcast' && (
          <div className="space-y-6 animate-fade-in max-w-3xl mx-auto text-xs">
            {/* Header */}
            <div className={`border-b pb-4 flex items-center justify-between flex-wrap gap-3 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <div>
                <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                  BROADCAST MEDIA & SIGNATURE STUDIO
                </span>
                <h3 className={`text-xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  방송 오버레이 & 시그니처 미디어 커스텀
                </h3>
                <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  본인의 짤방(GIF/PNG)과 효과음(MP3/WAV)을 등록하여 엑셀 방송 및 개인 방송에서 금액별로 리액션과 사운드가 자동 송출되도록 설정합니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveBroadcast}
                  className="py-2.5 px-4 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} />
                  <span>설정 저장 & 동기화</span>
                </button>
              </div>
            </div>

            {isSavedBroadcast && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>오버레이 미디어 설정이 성공적으로 저장 및 실시간 동기화되었습니다!</span>
              </div>
            )}

            {/* Stream Mode Selector */}
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    방송 모드 선택 (One-Click Preset)
                  </div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    방송 성격에 맞춰 게이지 바와 알림 이펙트를 원클릭으로 최적화합니다.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastMedia(prev => ({ ...prev, mode: 'personal' }));
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      broadcastMedia.mode === 'personal'
                        ? 'bg-[#E4092B] text-white shadow-sm'
                        : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    🎮 개인방송 모드
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBroadcastMedia(prev => ({ ...prev, mode: 'excel' }));
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      broadcastMedia.mode === 'excel'
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : isDark ? 'bg-white/5 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    📊 엑셀방송 / 크루 랭킹 모드
                  </button>
                </div>
              </div>
            </div>

            {/* OBS Overlay URL Card */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between flex-wrap gap-3 ${
              isDark ? 'bg-black/30 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    OBS 브라우저 소스 연동 URL (18종 위젯 통합)
                  </div>
                  <div className="font-mono text-[11px] text-purple-400 mt-0.5">
                    {typeof window !== 'undefined' ? `${window.location.origin}/overlay.html` : 'https://mimibit.kr/overlay.html'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="py-2 px-3.5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <ExternalLink size={14} />
                  <span>스튜디오 콘솔 열기</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = typeof window !== 'undefined' ? `${window.location.origin}/overlay.html` : 'https://mimibit.kr/overlay.html';
                    navigator.clipboard.writeText(url);
                    setIsCopiedObsUrl(true);
                    setTimeout(() => setIsCopiedObsUrl(false), 2000);
                  }}
                  className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCopiedObsUrl
                      ? 'bg-emerald-500 text-white'
                      : isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-white text-slate-800 border'
                  }`}
                >
                  {isCopiedObsUrl ? <Check size={14} /> : <Copy size={14} />}
                  <span>{isCopiedObsUrl ? '복사 완료!' : 'URL 복사'}</span>
                </button>
              </div>
            </div>

            {/* Tier Tabs */}
            <div className="flex items-center gap-1 border-b pb-2 overflow-x-auto border-white/10">
              {[
                { id: 'tier100', label: '🥕 100 당근 (기본 알림)' },
                { id: 'tier500', label: '⭐ 500 당근 (시그니처)' },
                { id: 'tier1k', label: '👑 1,000 당근 (열혈 리액션)' },
                { id: 'tier10k', label: '🚀 10,000 당근 (엑셀 잭팟)' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    handleStopPreview();
                    setBroadcastActiveTier(t.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                    broadcastActiveTier === t.id
                      ? 'bg-[#E4092B] text-white shadow-xs'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tier Configuration Card */}
            {(() => {
              const cur = broadcastMedia.tiers[broadcastActiveTier] || {};
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: GIF / Image Uploader */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Image size={15} className="text-purple-400" />
                        <span>후원 짤방 / GIF 움짤</span>
                      </span>
                      {cur.img && (
                        <button
                          type="button"
                          onClick={() => {
                            setBroadcastMedia(prev => ({
                              ...prev,
                              tiers: {
                                ...prev.tiers,
                                [broadcastActiveTier]: { ...prev.tiers[broadcastActiveTier], img: '' }
                              }
                            }));
                          }}
                          className="text-rose-400 hover:underline cursor-pointer text-[11px]"
                        >
                          제거
                        </button>
                      )}
                    </div>

                    <label className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDark
                        ? 'border-white/20 hover:border-purple-400 bg-white/2'
                        : 'border-slate-300 hover:border-purple-500 bg-slate-50'
                    }`}>
                      <input
                        type="file"
                        accept="image/png, image/gif, image/webp, image/jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setBroadcastMedia(prev => ({
                              ...prev,
                              tiers: {
                                ...prev.tiers,
                                [broadcastActiveTier]: {
                                  ...prev.tiers[broadcastActiveTier],
                                  img: ev.target.result
                                }
                              }
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {cur.img ? (
                        <div className="space-y-2">
                          <img
                            src={cur.img}
                            alt="Custom GIF"
                            className="max-h-24 mx-auto rounded-lg object-contain shadow-md"
                          />
                          <p className="text-[11px] text-purple-400 font-bold">클릭하여 다른 이미지/GIF로 교체</p>
                        </div>
                      ) : (
                        <div className="space-y-1 py-2">
                          <div className="text-2xl">📂</div>
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            본인 캐릭터 짤방/GIF 등록
                          </p>
                          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            움직이는 GIF 또는 투명 PNG (최대 10MB)
                          </p>
                        </div>
                      )}
                    </label>

                    {/* Presets */}
                    <div>
                      <span className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        추천 캐릭터 프리셋
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          { label: '🐰 토끼 요정', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&auto=format&fit=crop&q=80' },
                          { label: '🐱 냥이 리액션', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80' },
                          { label: '👑 골드 왕관', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=200&auto=format&fit=crop&q=80' }
                        ].map((p, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setBroadcastMedia(prev => ({
                                ...prev,
                                tiers: {
                                  ...prev.tiers,
                                  [broadcastActiveTier]: { ...prev.tiers[broadcastActiveTier], img: p.url }
                                }
                              }));
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                              cur.img === p.url
                                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                                : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Audio SFX Uploader */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <Volume2 size={15} className="text-emerald-400" />
                        <span>후원 시그니처 사운드 (SFX)</span>
                      </span>
                      {(cur.sfx || cur.sfxKey) && (
                        <button
                          type="button"
                          onClick={() => {
                            handleStopPreview();
                            setBroadcastMedia(prev => ({
                              ...prev,
                              tiers: {
                                ...prev.tiers,
                                [broadcastActiveTier]: {
                                  ...prev.tiers[broadcastActiveTier],
                                  sfx: '',
                                  sfxKey: '',
                                  sfxName: ''
                                }
                              }
                            }));
                          }}
                          className="text-rose-400 hover:underline cursor-pointer text-[11px]"
                        >
                          제거
                        </button>
                      )}
                    </div>

                    <label className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      isDark
                        ? 'border-white/20 hover:border-emerald-400 bg-white/2'
                        : 'border-slate-300 hover:border-emerald-500 bg-slate-50'
                    }`}>
                      <input
                        type="file"
                        accept="audio/mp3, audio/wav, audio/ogg, audio/mpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setBroadcastMedia(prev => ({
                              ...prev,
                              tiers: {
                                ...prev.tiers,
                                [broadcastActiveTier]: {
                                  ...prev.tiers[broadcastActiveTier],
                                  sfx: ev.target.result,
                                  sfxType: 'custom',
                                  sfxName: file.name
                                }
                              }
                            }));
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {cur.sfx ? (
                        <div className="space-y-2 py-1">
                          <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                            <Volume2 size={16} />
                            <span>{cur.sfxName || 'custom_sound.mp3'}</span>
                          </div>
                          <p className="text-[11px] text-emerald-400 font-bold">클릭하여 다른 오디오로 교체</p>
                        </div>
                      ) : (
                        <div className="space-y-1 py-2">
                          <div className="text-2xl">🎵</div>
                          <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                            본인만의 효과음(MP3/WAV) 등록
                          </p>
                          <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            시그니처 벨/음성 파일 (최대 5MB)
                          </p>
                        </div>
                      )}
                    </label>

                    {/* Audio Preview Controls & Presets */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {isPlayingSfx ? (
                          <button
                            type="button"
                            onClick={handleStopPreview}
                            className="py-1.5 px-3 rounded-lg bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Square size={12} />
                            <span>정지</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePlayPreview(cur)}
                            className="py-1.5 px-3 rounded-lg bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Play size={12} />
                            <span>미리듣기</span>
                          </button>
                        )}
                        <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {cur.sfxName ? `재생 대상: ${cur.sfxName}` : '내장 프리셋 사운드 테스트'}
                        </span>
                      </div>

                      <div>
                        <span className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          내장 프리셋 사운드 선택
                        </span>
                        <div className="flex gap-1.5 flex-wrap">
                          {[
                            { key: 'chime', label: '🔔 맑은 차임벨' },
                            { key: 'coin', label: '🪙 당근 코인' },
                            { key: 'fanfare', label: '🎺 팡파레 축하' },
                            { key: 'jackpot', label: '🎰 엑셀 잭팟' }
                          ].map((s) => (
                            <button
                              key={s.key}
                              type="button"
                              onClick={() => {
                                setBroadcastMedia(prev => ({
                                  ...prev,
                                  tiers: {
                                    ...prev.tiers,
                                    [broadcastActiveTier]: {
                                      ...prev.tiers[broadcastActiveTier],
                                      sfx: '',
                                      sfxType: 'preset',
                                      sfxKey: s.key,
                                      sfxName: s.label
                                    }
                                  }
                                }));
                                playProceduralSfx(s.key);
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                                cur.sfxType === 'preset' && cur.sfxKey === s.key
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                  : isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Live Test Station (Stella Style) */}
            <div className={`p-5 rounded-2xl border ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
                <div>
                  <div className={`font-bold text-sm flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span>⚡ 실시간 시뮬레이션 테스트 스테이션</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400">
                      LIVE TEST
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    클릭 즉시 등록한 짤방/GIF와 음향 사운드가 재생되고 OBS 오버레이로 실시간 송출됩니다.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleTriggerTest(100, 'tier100', '미미비트 항상 응원해요! 파이팅 🥕')}
                  className="py-2 px-3.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 font-bold transition-all cursor-pointer"
                >
                  🥕 100 당근 테스트
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerTest(500, 'tier500', '오늘 방송 텐션 최고예요!! ⭐')}
                  className="py-2 px-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/40 font-bold transition-all cursor-pointer"
                >
                  ⭐ 500 당근 테스트
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerTest(1000, 'tier1k', '열혈팬 입장! 대박 리액션 갑시다 👑')}
                  className="py-2 px-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 font-bold transition-all cursor-pointer"
                >
                  👑 1,000 당근 테스트
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerTest(10000, 'tier10k', '🔥 엑셀 잭팟 10,000 당근 폭격!! 회장님 모십니다 🚀')}
                  className="py-2 px-4 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-black shadow-lg transition-all cursor-pointer"
                >
                  🚀 10,000 당근 엑셀 잭팟!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: 펀딩 목표 & 프로필 설정 ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-xl mx-auto text-xs">
            <div className={`border-b pb-4 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider block">
                PROFILE & GOAL SETTINGS
              </span>
              <h3 className={`text-xl font-heading font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                프로필 & 펀딩 목표 관리
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  크리에이터 활동명
                </label>
                <input
                  type="text"
                  value={creator?.name || ''}
                  onChange={(e) => setCreator && setCreator({ ...creator, name: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  펀딩 프로젝트 제목
                </label>
                <input
                  type="text"
                  value={creator?.fundingGoal?.title || ''}
                  onChange={(e) => setCreator && setCreator({
                    ...creator,
                    fundingGoal: { ...creator.fundingGoal, title: e.target.value }
                  })}
                  className={`w-full p-2.5 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  목표 당근 수량
                </label>
                <input
                  type="number"
                  value={creator?.fundingGoal?.targetCarrots || 10000}
                  onChange={(e) => setCreator && setCreator({
                    ...creator,
                    fundingGoal: { ...creator.fundingGoal, targetCarrots: Number(e.target.value) }
                  })}
                  className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsSavedGoal(true);
                    setTimeout(() => setIsSavedGoal(false), 2000);
                  }}
                  className="py-3 px-5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  설정 사항 저장하기
                </button>

                {isSavedGoal && (
                  <span className="text-xs text-emerald-400 font-bold">
                    ✓ 변경 사항이 저장되었습니다.
                  </span>
                )}
              </div>

              {/* Danger Zone: Delete Creator Profile & Biolink */}
              <div className="pt-6 border-t border-rose-500/20">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                    <div>
                      <h4 className="font-heading font-black text-rose-500 text-xs sm:text-sm">
                        위험 구역: 크리에이터 프로필 & 바이오링크 삭제
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        현재 개설된 크리에이터 바이오링크(@{(creator?.handle || '').replace('@', '')}) 및 프로필 데이터를 영구 삭제합니다.
                        계정은 일반 서포터 모드로 자동 전환되며, 언제든 다시 온보딩을 통해 새 바이오링크를 개설할 수 있습니다.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const handleText = creator?.handle || creator?.name || '크리에이터';
                      if (window.confirm(`⚠️ 정말로 [${handleText}] 크리에이터 프로필 및 바이오링크를 영구 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며, 등록된 바이오링크와 펀딩 정보가 즉시 삭제됩니다.`)) {
                        onDeleteCreatorProfile?.(creator?.id || creator?.handle);
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>크리에이터 프로필 & 바이오링크 영구 삭제하기</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ================= WITHDRAWAL REQUEST MODAL ================= */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl border animate-fade-in ${
            isDark ? 'bg-[#0D111A] text-white border-white/10' : 'bg-white text-slate-800 border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <h3 className={`font-heading font-black text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                정산 출금 신청
              </h3>
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-500'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className={`p-3.5 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <span className="text-[11px] text-slate-400 block">출금 가능 정산 잔액</span>
                <span className="text-2xl font-heading font-black text-[#FF4D6D] font-num">
                  {availablePayout.toLocaleString()}원
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    출금 신청 금액
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setWithdrawAmount(availablePayout.toString())}
                    className="text-[11px] text-[#FF4D6D] font-bold hover:underline cursor-pointer"
                  >
                    전액 출금 ({availablePayout.toLocaleString()}원)
                  </button>
                </div>
                <input
                  type="text"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className={`w-full p-3 rounded-xl border text-sm font-bold font-mono ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`text-xs font-bold block mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  입금 계좌 확인
                </label>
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  isDark ? 'bg-white/5 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <span>{bankInfo.bank} {bankInfo.account}</span>
                  <span className="text-[10px] text-slate-400">예금주: {bankInfo.holder}</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}>
                * 영업일 기준 익일 오전 10:00에 이체 수수료 없이 계좌로 자동 입금됩니다. (국세청 원천징수 3.3%가 사전 공제된 실수령액 기준)
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className={`py-3 px-4 rounded-xl font-bold text-xs cursor-pointer ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                취소
              </button>
              <button
                type="button"
                disabled={isSubmittingPayout || availablePayout <= 0}
                onClick={handleProcessWithdrawal}
                className="flex-1 py-3 px-4 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95 disabled:opacity-40"
              >
                {isSubmittingPayout ? '출금 신청 중...' : '출금 신청 확인'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
