import React, { useState, useRef, useEffect } from 'react';
import { 
  DollarSign, Percent, TrendingUp, Users, ShieldAlert, 
  MessageSquare, Mic, Image, Check, AlertCircle, Ban, 
  Settings, Sparkles, Copy, ExternalLink, Play, Pause, 
  Square, RefreshCw, Volume2, Download, CheckCircle2, Lock, ArrowRight, X, Clock, Building2, Send 
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
  const [payoutHistory, setPayoutHistory] = useState([]);

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
    const currentReplyText = replyTextMap[q.id] || '';
    if (!currentReplyText.trim()) return;

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
            { id: 'record', label: '15초 보이스 녹음' },
            { id: 'messages', label: `1:1 질문 답장함${unansweredCount > 0 ? ` (${unansweredCount})` : ''}` },
            { id: 'settlement', label: '10% 정산 & 출금' },
            { id: 'settings', label: '펀딩 목표 설정' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? (isDark ? 'bg-[#E4092B] text-white shadow-xs' : 'bg-white text-slate-900 shadow-xs')
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-5 sm:p-8">

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
                            disabled={!currentReply.trim()}
                            className="py-2.5 px-5 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs transition-all shadow-xs disabled:opacity-40 cursor-pointer active:scale-95 flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>답장 발송하기</span>
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
                <span className="text-xs text-emerald-400 font-bold ml-3">
                  ✓ 변경 사항이 저장되었습니다.
                </span>
              )}
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
