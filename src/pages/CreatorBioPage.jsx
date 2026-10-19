import React, { useState, useEffect } from 'react';
import { 
  Heart, Share2, Copy, Check, Sparkles, Trophy, Lock, Play, Pause, 
  Volume2, ShieldCheck, ArrowLeft, ExternalLink, ChevronRight, Send, 
  MessageCircle, CheckCircle2, BadgeCheck, Users, Target, Gift, Star, 
  Clock, Music, Image as ImageIcon, Flame, QrCode, Zap, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RABBIT_TIERS } from '../data/initialData';
import { getStoredCreators, processCreatorDonation, fetchCreator } from '../services/api';
import { QrCodeModal } from '../components/common/QrCodeModal';

// Clean launch state: empty (real registered creators only)
export const BIO_CREATORS = [];

export function CreatorBioPage({ 
  initialCreatorId,
  currentUser,
  onOpenDonate,
  onOpenCharge,
  onOpenMessenger,
  onBackToHome,
  onNavigate
}) {
  const [selectedCreatorId, setSelectedCreatorId] = useState(initialCreatorId || null);
  const [creatorsList, setCreatorsList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [selectedCarrots, setSelectedCarrots] = useState(100);
  const [customCarrots, setCustomCarrots] = useState('');
  const [cheerMessage, setCheerMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [audioTimer, setAudioTimer] = useState(15);
  const [ttsPreview, setTtsPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [guestbookList, setGuestbookList] = useState(() => {
    try {
      const saved = localStorage.getItem('mimibit_guestbook');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Load real registered creators
  useEffect(() => {
    const loadCreators = async () => {
      setIsLoading(true);
      try {
        const stored = getStoredCreators();
        setCreatorsList(stored);

        // Try backend API
        try {
          const res = await fetch('/api/creators');
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.creators)) {
              setCreatorsList(data.creators);
            }
          }
        } catch (e) {}
      } catch (err) {
        console.warn('Failed to load creators for bio page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreators();
  }, [initialCreatorId]);

  // Audio timer simulation
  useEffect(() => {
    let interval;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioTimer((prev) => {
          if (prev <= 1) {
            setIsPlayingAudio(false);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setAudioTimer(15);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const togglePlayAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  // Resolve active creator cleanly
  const activeCreator = (creatorsList || []).find(c => {
    if (!selectedCreatorId) return false;
    const cleanId = selectedCreatorId.replace('@', '').toLowerCase();
    return (
      c.id?.toLowerCase() === cleanId ||
      c.handle?.replace('@', '').toLowerCase() === cleanId
    );
  }) || (creatorsList.length > 0 ? creatorsList[0] : null);

  // If follow count not synced, sync from creator
  useEffect(() => {
    if (activeCreator) {
      setFollowerCount(activeCreator.followers || 0);
    }
  }, [activeCreator?.id]);

  // Follow Toggle
  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount(prev => Math.max(0, prev - 1));
    } else {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      try {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  // Copy link
  const handleCopyLink = () => {
    if (!activeCreator) return;
    navigator.clipboard.writeText(`https://mimibit.me/${activeCreator.handle || activeCreator.name}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Quick Direct Support Trigger
  const handleQuickDonate = () => {
    if (!activeCreator) return;
    const carrotAmount = customCarrots ? parseInt(customCarrots, 10) : selectedCarrots;
    if (!carrotAmount || carrotAmount <= 0) {
      alert('후원할 당근 수량을 선택해주세요.');
      return;
    }

    if (onOpenDonate) {
      onOpenDonate(carrotAmount);
    } else {
      processCreatorDonation(activeCreator.id, {
        carrots: carrotAmount,
        nickname: currentUser?.name || '익명의 팬',
        message: cheerMessage
      });
      setCreatorsList(getStoredCreators());
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      } catch (e) {}
      alert(`${activeCreator.name}님에게 ${carrotAmount} 당근 후원이 접수되었습니다! 🥕`);
      setCustomCarrots('');
      setCheerMessage('');
    }
  };

  // 1. CLEAN EMPTY STATE WHEN NO REAL CREATORS ARE REGISTERED
  if (!activeCreator) {
    return (
      <div className="min-h-screen bg-[#06080D] text-white py-24 px-6 font-sans select-none flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#E4092B]/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-lg mx-auto space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#FF4D6D]">
            <Sparkles className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
              등록된 크리에이터 바이오링크가 없습니다
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              지금 첫 번째 미미빗 크리에이터로 등록하고, 나만의 고유 후원 바이오링크와 1:1 시크릿톡을 시작해보세요!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
            >
              메인으로 이동
            </button>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('onboarding');
                else if (onBackToHome) onBackToHome();
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E4092B] to-[#FF4D6D] hover:from-[#CC0022] hover:to-[#E4092B] text-white font-heading font-black text-xs shadow-lg shadow-[#E4092B]/30 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>크리에이터 링크 무료 개설하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallbacks for optional fields on real creator
  const creator = {
    ...activeCreator,
    name: activeCreator.name || '크리에이터',
    handle: activeCreator.handle || '@creator',
    category: activeCreator.category || '서브컬처 창작자',
    bio: activeCreator.bio || '팬 여러분의 따뜻한 응원은 창작 활동에 큰 힘이 됩니다 🥕✨',
    avatar: activeCreator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: activeCreator.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    tags: Array.isArray(activeCreator.tags) ? activeCreator.tags : ['#크리에이터', '#바이오링크'],
    totalCarrots: activeCreator.totalCarrots || 0,
    supporters: activeCreator.supporters || 0,
    fundingGoal: activeCreator.fundingGoal || null,
    voiceReward: activeCreator.voiceReward || null,
    secretPhotos: Array.isArray(activeCreator.secretPhotos) ? activeCreator.secretPhotos : [],
    sns: activeCreator.sns || {}
  };

  const fundingGoalTarget = (creator.fundingGoal && creator.fundingGoal.targetCarrots > 0) ? creator.fundingGoal.targetCarrots : 1;
  const fundingPercent = creator.fundingGoal ? Math.min(
    100, 
    Math.round(((creator.fundingGoal.currentCarrots || 0) / fundingGoalTarget) * 100)
  ) : 0;

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-12 sm:py-20 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[200px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8">

        {/* Top Control Bar: Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>메인으로 돌아가기</span>
          </button>

          {/* If multiple real creators exist, show clean switch */}
          {creatorsList.length > 1 && (
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold text-slate-400 px-3 hidden md:inline">
                활동 크리에이터:
              </span>
              {creatorsList.map(c => {
                const isSelected = c.id === creator.id;
                return (
                  <button
                    key={c.id || c.handle}
                    onClick={() => setSelectedCreatorId(c.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected 
                        ? 'bg-[#E4092B] text-white shadow-md' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= HERO PROFILE BANNER ================= */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl shadow-2xl mb-10">
          
          {/* Panoramic Cover */}
          <div className="h-64 sm:h-80 w-full relative overflow-hidden bg-slate-900">
            <img 
              src={creator.coverImage} 
              alt={creator.name} 
              className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06080D] via-black/40 to-black/20" />
            
            {/* Monospace URL badge (Top Right on Cover) */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer group shadow-lg"
              >
                <Share2 className="w-3.5 h-3.5 text-[#FF4D6D] group-hover:rotate-12 transition-transform" />
                <span>mimibit.me/{creator.handle}</span>
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                title="공식 후원 QR 코드 열기"
                className="p-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <QrCode className="w-4 h-4 text-[#FF4D6D]" />
              </button>
            </div>
          </div>

          {/* Profile Core Header Strip */}
          <div className="px-6 sm:px-10 pb-8 sm:pb-10 -mt-16 sm:-mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              
              {/* Creator Main Avatar & Identity */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative group">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#06080D] shadow-2xl group-hover:scale-102 transition-transform duration-300"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#E4092B] to-[#FF4D6D] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border-2 border-[#06080D] flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    <span>공식 창작자</span>
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight">
                      {creator.name}
                    </h1>
                    <span className="text-xs text-slate-400 font-mono font-medium">
                      {creator.handle}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    {creator.category}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Secret Talk & Follow */}
              <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
                <button
                  onClick={onOpenMessenger}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 group shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 text-[#FF4D6D] group-hover:scale-110 transition-transform" />
                  <span>1:1 시크릿톡</span>
                </button>

                <button
                  onClick={handleToggleFollow}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg ${
                    isFollowing 
                      ? 'bg-white/15 text-white border border-white/20' 
                      : 'bg-gradient-to-r from-[#E4092B] to-[#FF4D6D] text-white hover:from-[#CC0022] hover:to-[#E4092B] shadow-[#E4092B]/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-white'}`} />
                  <span>{isFollowing ? '팔로잉' : '팔로우'}</span>
                  <span className="text-xs opacity-80 font-num">({followerCount.toLocaleString()})</span>
                </button>
              </div>

            </div>

            {/* Creator Bio & Tags */}
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {creator.bio}
              </p>
              <div className="flex flex-wrap gap-2 shrink-0">
                {creator.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-slate-400 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ================= BENTO GRID CORE LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: CREATOR STATS & COMMUNITY (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Fandom Metrics Bento */}
            <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />
                <span>팬덤 활동 요약</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block text-[11px] text-slate-400">누적 당근 후원</span>
                  <span className="text-xl font-heading font-black text-white font-num mt-1 block">
                    {(creator.totalCarrots ?? 0).toLocaleString()} 🥕
                  </span>
                  <span className="text-[10px] text-slate-500 font-num">
                    약 {((creator.totalCarrots ?? 0) * 100).toLocaleString()}원
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="block text-[11px] text-slate-400">정산 투명도</span>
                  <span className="text-xl font-heading font-black text-emerald-400 font-num mt-1 block flex items-center gap-1">
                    100%
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                  <span className="text-[10px] text-emerald-400/80">
                    미미빗 10% 정산 인증
                  </span>
                </div>
              </div>

              {/* Creator Official Links */}
              {creator.sns && Object.keys(creator.sns).length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <span className="block text-xs font-bold text-slate-400 mb-2.5">
                    공식 채널 바로가기
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(creator.sns)
                      .filter(([_, url]) => Boolean(url))
                      .map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-between transition-colors capitalize"
                      >
                        <span>{platform}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 15s Secret Voice Note Card (Only shown if creator has a real voice reward) */}
            {creator.voiceReward && creator.voiceReward.title && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/20 via-white/[0.03] to-white/[0.02] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-sm text-white">{creator.voiceReward.title}</h4>
                      <span className="text-[11px] text-purple-300/80 font-mono">0:{audioTimer.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <button
                    onClick={togglePlayAudio}
                    className="px-4 py-2 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{isPlayingAudio ? '일시 정지' : '듣기'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 h-8 px-2 bg-white/5 rounded-xl border border-white/5">
                  {[30, 80, 50, 100, 70, 90, 40, 85, 60, 95, 40, 70, 90, 60, 100, 75, 45, 80, 60, 90].map((h, i) => (
                    <span
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio ? 'bg-[#FF4D6D] animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{ height: isPlayingAudio ? `${h}%` : '25%' }}
                    />
                  ))}
                </div>

                {creator.voiceReward.message && (
                  <p className="text-xs text-slate-300 italic pt-2 border-t border-white/10 leading-relaxed">
                    "{creator.voiceReward.message}"
                  </p>
                )}
              </div>
            )}

            {/* Exclusive Secret Vault Teaser (Only shown if creator has real secret photos) */}
            {creator.secretPhotos && creator.secretPhotos.length > 0 && (
              <div className="p-6 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wider">
                    <Lock className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>서포터 시크릿 볼트</span>
                  </h4>
                  <span className="text-[10px] bg-[#E4092B]/20 text-[#FF4D6D] px-2 py-0.5 rounded-full font-bold">
                    한정 공개
                  </span>
                </div>

                <div className="space-y-3">
                  {creator.secretPhotos.map(photo => {
                    const isUnlockedByRoot = currentUser?.role === 'admin';
                    return (
                      <div 
                        key={photo.id} 
                        onClick={() => isUnlockedByRoot && window.open(photo.url, '_blank')}
                        className={`relative rounded-2xl overflow-hidden border border-white/10 group ${
                          isUnlockedByRoot ? 'cursor-pointer hover:border-amber-400/50' : ''
                        }`}
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className={`w-full h-32 object-cover group-hover:scale-105 transition-all duration-700 ${
                            isUnlockedByRoot ? 'filter-none' : 'filter blur-md'
                          }`}
                        />
                        {isUnlockedByRoot ? (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                <span>ROOT 마스터 열람</span>
                              </span>
                              <span className="text-[10px] text-white/80 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full">클릭 시 원본 보기</span>
                            </div>
                            <div>
                              <h5 className="font-heading font-black text-xs text-white">{photo.title}</h5>
                              <span className="text-[10px] text-amber-300 font-bold">{photo.tierRequired}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                            <Lock className="w-5 h-5 text-white/80" />
                            <h5 className="font-heading font-bold text-xs text-white">{photo.title}</h5>
                            <span className="text-[10px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-white/10">
                              {photo.tierRequired}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE DONATION & REWARDS (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* BENTO 1: LIVE FUNDING GOAL (Only shown if creator has set one) */}
            {creator.fundingGoal && creator.fundingGoal.title && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {creator.fundingGoal.dDay && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E4092B] text-white text-[10px] font-black">
                          {creator.fundingGoal.dDay}
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-400">진행 중인 펀딩 목표</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-heading font-black text-white">
                      {creator.fundingGoal.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-3xl sm:text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] font-num">
                      {fundingPercent}%
                    </span>
                    <span className="block text-[11px] text-slate-400 font-medium">
                      달성 완료
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] rounded-full transition-all duration-1000 shadow-[0_0_12px_#E4092B]"
                    style={{ width: `${fundingPercent}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 gap-2 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">현재 모금:</span>
                    <strong className="text-white font-num font-bold">{(creator.fundingGoal.currentCarrots || 0).toLocaleString()} 🥕</strong>
                    <span className="text-slate-500 font-num">({((creator.fundingGoal.currentCarrots || 0) * 100).toLocaleString()}원)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">목표액:</span>
                    <strong className="text-slate-200 font-num">{(creator.fundingGoal.targetCarrots || 0).toLocaleString()} 🥕</strong>
                    {creator.fundingGoal.endDate && <span className="text-slate-500 font-num">(마감: {creator.fundingGoal.endDate})</span>}
                  </div>
                </div>
              </div>
            )}

            {/* BENTO 2: INSTANT MICRO-SUPPORT STUDIO (1초 당근 후원) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D]">
                    <Zap className="w-3.5 h-3.5 fill-[#FF4D6D]" />
                    <span>1초 즉시 후원 스튜디오</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-heading font-black text-white">
                    {creator.name}님에게 당근 선물하기
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">내 보유 당근</span>
                  <span className="text-sm sm:text-base font-bold text-[#FF4D6D] font-num">
                    {(currentUser?.carrotsBalance || 0).toLocaleString()} 🥕
                  </span>
                </div>
              </div>

              {/* Carrot Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { amount: 10, won: '1,000', label: '커피 한 입' },
                  { amount: 100, won: '10,000', label: '든든한 간식' },
                  { amount: 300, won: '30,000', label: '실버 등급 승급' },
                  { amount: 1000, won: '100,000', label: '시크릿톡 해금', popular: true }
                ].map((pkg) => (
                  <button
                    key={pkg.amount}
                    type="button"
                    onClick={() => { setSelectedCarrots(pkg.amount); setCustomCarrots(''); }}
                    className={`p-4 rounded-2xl border text-left transition-all relative cursor-pointer ${
                      selectedCarrots === pkg.amount && !customCarrots
                        ? 'bg-gradient-to-br from-[#E4092B]/20 to-transparent border-[#E4092B] shadow-lg shadow-[#E4092B]/20'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-3 bg-[#E4092B] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                        ★ 추천
                      </span>
                    )}
                    <span className="text-xs text-slate-400 block">{pkg.label}</span>
                    <span className="text-lg font-heading font-black text-white font-num block mt-1">
                      {pkg.amount} 🥕
                    </span>
                    <span className="text-[11px] text-[#FF4D6D] font-num block">
                      {pkg.won}원
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">
                  원하는 당근 수량 직접 입력
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customCarrots}
                    onChange={(e) => setCustomCarrots(e.target.value)}
                    placeholder="직접 입력: 후원할 당근 수량을 숫자로 적어주세요 (예: 250)"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E4092B] transition-all font-num"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    🥕 당근
                  </span>
                </div>
              </div>

              {/* Cheering Message */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 block">
                    크리에이터에게 전할 응원 메시지
                  </label>
                  <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={ttsPreview} 
                      onChange={(e) => setTtsPreview(e.target.checked)}
                      className="accent-[#E4092B] rounded"
                    />
                    <span>AI 음성 TTS 활성화</span>
                  </label>
                </div>
                <textarea
                  rows={3}
                  value={cheerMessage}
                  onChange={(e) => setCheerMessage(e.target.value)}
                  placeholder={`"${creator.name}님 언제나 조용히 응원하고 있습니다 🥕"`}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E4092B] transition-all resize-none"
                />
              </div>

              {/* Big Instant Donation Button */}
              <button
                type="button"
                onClick={handleQuickDonate}
                className="w-full py-4 sm:py-5 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-heading font-black text-base shadow-xl shadow-[#E4092B]/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2 group"
              >
                <Zap className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />
                <span>
                  {customCarrots ? parseInt(customCarrots, 10).toLocaleString() : selectedCarrots.toLocaleString()} 당근
                  ({((customCarrots ? parseInt(customCarrots, 10) : selectedCarrots) * 100).toLocaleString()}원) 즉시 후원하기
                </span>
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  미미빗 10% 단일 수수료 적용
                </span>
                <span>·</span>
                <span>간편결제 / 카드 / 토스페이 지원</span>
              </div>
            </div>

            {/* BENTO 3: VIP MEMBERSHIP TIERS */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-heading font-black text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>VIP 멤버십 래빗 클럽</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    누적 후원 당근에 따라 회원 등급이 자동으로 승급되며, 독점 리워드가 영구 보관함에 잠금 해제됩니다.
                  </p>
                </div>
                <span className="text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl self-start sm:self-center font-bold">
                  월간 정기 구독
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RABBIT_TIERS.map(tier => (
                  <div 
                    key={tier.id}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      tier.highlight 
                        ? 'bg-gradient-to-br from-amber-500/10 via-white/5 to-rose-500/10 border-amber-500/40 shadow-xl' 
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {tier.highlight && (
                      <span className="absolute -top-2.5 right-4 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md">
                        ★ 인기 등급
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{tier.icon}</span>
                        <div>
                          <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                            {tier.name}
                          </h4>
                          <span className="text-xs text-[#FF4D6D] font-bold font-mono">
                            누적 {tier.carrots.toLocaleString()} 🥕
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                      {(tier.perks || tier.benefits || []).map((b, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BENTO 4: REAL-TIME FAN CHEERS WALL (서포터 실시간 방명록) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/10 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#FF4D6D]" />
                  <h3 className="text-base sm:text-lg font-heading font-black text-white">
                    팬들의 실시간 응원 메시지
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#FF4D6D] font-num">
                  총 {creator.supporters}명의 서포터
                </span>
              </div>

              <div className="space-y-3">
                {guestbookList && guestbookList.length > 0 ? (
                  guestbookList.map((g, idx) => (
                    <div key={g.id || idx} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-white/15 transition-colors">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-white">{g.nickname || g.name || '익명의 서포터'}</span>
                          <span className="text-[#FF4D6D] font-num font-bold text-xs bg-[#E4092B]/15 px-2.5 py-0.5 rounded-full border border-[#E4092B]/30">
                            +{g.carrots} 🥕
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">{g.createdAt || g.date || '방금 전'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                        {g.content || g.msg}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center rounded-2xl bg-white/5 border border-white/5 text-slate-400 space-y-1.5">
                    <p className="text-xs sm:text-sm font-bold text-white/90">아직 등록된 실시간 응원 메시지가 없습니다 ✨</p>
                    <p className="text-xs text-slate-400">첫 번째로 당근을 보내고 {creator.name}님에게 따뜻한 응원을 전해보세요!</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* QR Modal for Creator Sharing */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        creator={{
          name: creator.name,
          handle: creator.handle,
          avatar: creator.avatar
        }}
      />

    </div>
  );
}
