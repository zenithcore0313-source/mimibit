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

// Fallback creator list for multi-creator bio page switching
export const BIO_CREATORS = [
  {
    id: 'luna_rabbit',
    handle: '@Luna_Rabbit',
    name: 'Luna Rabbit (루나)',
    category: '일러스트레이터 & 서브컬처 코스어',
    bio: '주말마다 감성 포토와 드로잉 일상을 공유해요! 따뜻한 커피 한 잔과 당근 후원은 창작 활동에 가장 큰 힘이 됩니다 🥕✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    tags: ['#일러스트', '#코스어', '#서브컬처', '#굿즈제작'],
    followers: 24500,
    supporters: 342,
    totalCarrots: 8450,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      chzzk: 'https://chzzk.naver.com'
    },
    fundingGoal: {
      title: '2026 봄 코스프레 화보집 & 굿즈 제작 펀딩',
      currentCarrots: 8450,
      targetCarrots: 10000,
      endDate: '2026. 10. 31',
      dDay: 'D-16'
    },
    voiceReward: {
      title: '루나의 10월 감사 보이스 노트',
      duration: '0:18',
      message: '항상 곁에서 묵묵히 응원해 주셔서 진심으로 고마워요! 이번 화보집도 온 마음을 다해 준비할게요.'
    },
    secretPhotos: [
      {
        id: 1,
        title: '가을 핑크 로리타 미공개 B컷 #01',
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        date: '10월 12일',
        tierRequired: '다이아 래빗 이상'
      },
      {
        id: 2,
        title: '작업실 새벽 드로잉 비하인드 #02',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        date: '10월 08일',
        tierRequired: '다이아 래빗 이상'
      }
    ]
  },
  {
    id: 'chibi_fan',
    handle: '@Chibi_Fan',
    name: '꼬마치비 (Chibi)',
    category: '인스타툰 & 일상 만화 작가',
    bio: '평범한 직장인의 엉뚱한 일상을 4컷 인스타툰으로 그려요. 커피 한 잔 당근으로 작가의 생명을 연장해 주세요 ☕🥕',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    tags: ['#인스타툰', '#직장인공감', '#일상툰', '#굿즈스티커'],
    followers: 18200,
    supporters: 218,
    totalCarrots: 5400,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    fundingGoal: {
      title: '치비 직장인 일상 단행본 출간 펀딩',
      currentCarrots: 5400,
      targetCarrots: 8000,
      endDate: '2026. 11. 15',
      dDay: 'D-31'
    },
    voiceReward: {
      title: '치비의 귀여운 응원 보이스',
      duration: '0:15',
      message: '오늘 하루도 정말 고생 많으셨어요! 치비 만화 보시고 힐링되는 하루 보내세요 💖'
    },
    secretPhotos: [
      {
        id: 1,
        title: '단행본 미공개 러프 스케치 #01',
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        date: '10월 14일',
        tierRequired: '골드 래빗 이상'
      }
    ]
  },
  {
    id: 'lofi_night',
    handle: '@LoFi_Night',
    name: '로파이 나이트 (LoFi Night)',
    category: '새벽 감성 Lo-Fi & 서브컬처 비트메이커',
    bio: '공부할 때, 코딩할 때, 새벽에 잠 안 올 때 듣는 비트를 만듭니다. 음악을 사랑하는 모든 분들을 환영해요 🎧🌃',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    tags: ['#LoFi', '#비트메이커', '#수면음악', '#코딩음악'],
    followers: 42100,
    supporters: 615,
    totalCarrots: 9800,
    sns: {
      youtube: 'https://youtube.com',
      spotify: 'https://spotify.com'
    },
    fundingGoal: {
      title: '새벽 감성 2집 바이닐(LP) 프레스 펀딩',
      currentCarrots: 9800,
      targetCarrots: 15000,
      endDate: '2026. 12. 01',
      dDay: 'D-47'
    },
    voiceReward: {
      title: 'LP 제작 감사 음성 리워드',
      duration: '0:20',
      message: '당신의 새벽에 제 음악이 닿을 수 있어 영광입니다. 진심으로 감사드립니다.'
    },
    secretPhotos: [
      {
        id: 1,
        title: '2집 바이닐 앨범 아트워크 원본',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        date: '10월 10일',
        tierRequired: '다이아 래빗 이상'
      }
    ]
  }
];

export function CreatorBioPage({ 
  initialCreatorId = 'luna_rabbit',
  currentUser,
  onOpenDonate,
  onOpenCharge,
  onOpenMessenger,
  onBackToHome
}) {
  const [selectedCreatorId, setSelectedCreatorId] = useState(initialCreatorId);
  const [creatorsList, setCreatorsList] = useState(BIO_CREATORS);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(24500);
  const [selectedCarrots, setSelectedCarrots] = useState(100);
  const [customCarrots, setCustomCarrots] = useState('');
  const [cheerMessage, setCheerMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [audioTimer, setAudioTimer] = useState(15);
  const [ttsPreview, setTtsPreview] = useState(true);

  // Sync with stored creators and backend API whenever initialCreatorId changes
  useEffect(() => {
    if (initialCreatorId) {
      setSelectedCreatorId(initialCreatorId);
    }
    const stored = getStoredCreators();
    if (stored && stored.length > 0) {
      setCreatorsList(stored);
    }
    if (initialCreatorId) {
      fetchCreator(initialCreatorId).then(fetched => {
        if (fetched) {
          const updatedStored = getStoredCreators();
          setCreatorsList(updatedStored);
        }
      });
    }
  }, [initialCreatorId]);

  // Active creator details with bulletproof fallback
  const creatorRaw = (creatorsList || []).find(c => 
    c.id?.toLowerCase() === selectedCreatorId?.toLowerCase() ||
    c.handle?.replace('@', '').toLowerCase() === selectedCreatorId?.replace('@', '').toLowerCase()
  ) || creatorsList[0] || BIO_CREATORS[0];

  const creator = {
    ...creatorRaw,
    name: creatorRaw.name || '크리에이터',
    handle: creatorRaw.handle || '@creator',
    category: creatorRaw.category || '서브컬처 창작자',
    bio: creatorRaw.bio || '팬 여러분의 따뜻한 응원은 창작 활동에 큰 힘이 됩니다 🥕✨',
    avatar: creatorRaw.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: creatorRaw.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    tags: Array.isArray(creatorRaw.tags) && creatorRaw.tags.length > 0 ? creatorRaw.tags : ['#창작자', '#후원', '#서브컬처'],
    followers: creatorRaw.followers || 0,
    supporters: creatorRaw.supporters || 0,
    totalCarrots: creatorRaw.totalCarrots || creatorRaw.fundingGoal?.currentCarrots || 8450,
    sns: creatorRaw.sns || { instagram: 'https://instagram.com' },
    fundingGoal: {
      title: creatorRaw.fundingGoal?.title || '2026 봄 창작 프로젝트 펀딩',
      currentCarrots: creatorRaw.fundingGoal?.currentCarrots || 0,
      targetCarrots: creatorRaw.fundingGoal?.targetCarrots || 10000,
      endDate: creatorRaw.fundingGoal?.endDate || '2026. 10. 31',
      dDay: creatorRaw.fundingGoal?.dDay || '진행중'
    },
    voiceReward: {
      title: creatorRaw.voiceReward?.title || '감사 보이스 노트',
      duration: creatorRaw.voiceReward?.duration || '0:15',
      message: creatorRaw.voiceReward?.message || '항상 곁에서 응원해 주셔서 진심으로 감사합니다!'
    },
    secretPhotos: Array.isArray(creatorRaw.secretPhotos) && creatorRaw.secretPhotos.length > 0 
      ? creatorRaw.secretPhotos 
      : [
          {
            id: 1,
            title: '작업실 미공개 비하인드 컷 #01',
            url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
            date: '10월 12일',
            tierRequired: '다이아 래빗 이상'
          }
        ]
  };

  useEffect(() => {
    if (creator) {
      setFollowerCount(creator.followers || 0);
      setIsFollowing(false);
      setSelectedCarrots(100);
      setCheerMessage('');
      setIsPlayingAudio(false);
      setAudioTimer(15);
    }
  }, [creator.id]);

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
    navigator.clipboard.writeText(`https://mimibit.me/${creator.handle}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Quick Direct Support Trigger
  const handleQuickDonate = () => {
    const carrotAmount = customCarrots ? parseInt(customCarrots, 10) : selectedCarrots;
    if (!carrotAmount || carrotAmount <= 0) {
      alert('후원할 당근 수량을 선택해주세요.');
      return;
    }

    if (onOpenDonate) {
      onOpenDonate(carrotAmount);
    } else {
      processCreatorDonation(creator.id, {
        carrots: carrotAmount,
        nickname: currentUser?.name || '익명의 팬',
        message: cheerMessage
      });
      setCreatorsList(getStoredCreators());
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
      } catch (e) {}
      alert(`${creator.name}님에게 ${carrotAmount} 당근 후원이 접수되었습니다! 🥕`);
      setCustomCarrots('');
      setCheerMessage('');
    }
  };

  const fundingGoalTarget = creator.fundingGoal.targetCarrots > 0 ? creator.fundingGoal.targetCarrots : 1;
  const fundingPercent = Math.min(
    100, 
    Math.round((creator.fundingGoal.currentCarrots / fundingGoalTarget) * 100)
  );

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

        {/* Top Control Bar: Breadcrumb + Elegant Creator Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md transition-all cursor-pointer group self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>메인 플로우로 돌아가기</span>
          </button>

          {/* Sleek Creator Switcher Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 px-3 hidden md:inline">
              쇼케이스 크리에이터:
            </span>
            {creatorsList.map(c => {
              const isSelected = c.id === selectedCreatorId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCreatorId(c.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isSelected 
                      ? 'bg-[#E4092B] text-white shadow-lg shadow-[#E4092B]/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
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
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">링크 복사됨!</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#FF4D6D]">mimibit.me/{creator.handle}</span>
                    <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                  </>
                )}
              </button>

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl transition-all cursor-pointer shadow-lg"
                title="QR 코드 보기"
              >
                <QrCode className="w-4 h-4 text-[#FF4D6D]" />
              </button>
            </div>
          </div>

          {/* Profile Details Header Section */}
          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              
              {/* Left: Avatar + Title */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="relative shrink-0">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name} 
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#06080D] shadow-2xl bg-slate-800"
                  />
                  <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black ring-4 ring-[#06080D]" title="실시간 활동 중">
                    ●
                  </span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-2xl sm:text-4xl font-heading font-black text-white tracking-tight">
                      {creator.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-[#E4092B]/20 text-[#FF4D6D] border border-[#E4092B]/30">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#FF4D6D]" />
                      <span>공식 인증 크리에이터</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 font-medium flex-wrap">
                    <span className="text-[#FF4D6D] font-mono font-bold">{creator.handle}</span>
                    <span>·</span>
                    <span className="text-slate-300">{creator.category}</span>
                    <span>·</span>
                    <span>팔로워 <strong className="text-white font-num font-semibold">{followerCount.toLocaleString()}</strong></span>
                    <span>·</span>
                    <span>서포터 <strong className="text-white font-num font-semibold">{creator.supporters}명</strong></span>
                  </div>
                </div>
              </div>

              {/* Right: Follow & 1:1 Secret Talk CTA Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleToggleFollow}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-2 ${
                    isFollowing 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                      : 'bg-[#E4092B] hover:bg-[#CC0022] text-white shadow-[#E4092B]/30'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-white text-white' : 'text-white'}`} />
                  <span>{isFollowing ? '팔로잉 ✓' : '팔로우'}</span>
                </button>

                <button
                  onClick={onOpenMessenger}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs sm:text-sm font-heading font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 text-[#FF4D6D]" />
                  <span>시크릿톡</span>
                </button>
              </div>

            </div>

            {/* Bio Story & Tags */}
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
                    {(creator.totalCarrots || 8450).toLocaleString()} 🥕
                  </span>
                  <span className="text-[10px] text-slate-500 font-num">
                    약 {((creator.totalCarrots || 8450) * 100).toLocaleString()}원
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
              <div className="pt-2 border-t border-white/10">
                <span className="block text-xs font-bold text-slate-400 mb-2.5">
                  공식 채널 바로가기
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(creator.sns || {})
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
            </div>

            {/* 15s Secret Voice Note Card */}
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

              {/* Animated Waveform */}
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

              <p className="text-xs text-slate-300 italic pt-2 border-t border-white/10 leading-relaxed">
                "{creator.voiceReward.message}"
              </p>
            </div>

            {/* Exclusive Secret Vault Teaser */}
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
                {creator.secretPhotos.map(photo => (
                  <div key={photo.id} className="relative rounded-2xl overflow-hidden border border-white/10 group">
                    <img 
                      src={photo.url} 
                      alt={photo.title}
                      className="w-full h-32 object-cover filter blur-md group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                      <Lock className="w-5 h-5 text-white/80" />
                      <h5 className="font-heading font-bold text-xs text-white">{photo.title}</h5>
                      <span className="text-[10px] bg-white/10 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-white/10">
                        {photo.tierRequired}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: INTERACTIVE DONATION & REWARDS (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* BENTO 1: LIVE FUNDING GOAL */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/15 backdrop-blur-2xl shadow-2xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E4092B] text-white text-[10px] font-black">
                      {creator.fundingGoal.dDay}
                    </span>
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

              {/* High-End Glowing Progress Bar */}
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden p-0.5 relative shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] rounded-full transition-all duration-1000 shadow-[0_0_12px_#E4092B]"
                  style={{ width: `${fundingPercent}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10 gap-2 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">현재 모금:</span>
                  <strong className="text-white font-num font-bold">{creator.fundingGoal.currentCarrots.toLocaleString()} 🥕</strong>
                  <span className="text-slate-500 font-num">({(creator.fundingGoal.currentCarrots * 100).toLocaleString()}원)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">목표액:</span>
                  <strong className="text-slate-200 font-num">{creator.fundingGoal.targetCarrots.toLocaleString()} 🥕</strong>
                  <span className="text-slate-500 font-num">(마감: {creator.fundingGoal.endDate})</span>
                </div>
              </div>
            </div>

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
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  당근 수량 선택 (1 당근 = 100원)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { amount: 10, label: '커피 한 모금', price: '1,000원' },
                    { amount: 50, label: '간식 선물', price: '5,000원' },
                    { amount: 100, label: '따뜻한 응원', price: '10,000원', isPopular: true },
                    { amount: 300, label: '체리 닉네임', price: '30,000원' },
                    { amount: 1000, label: '1:1 톡 해금★', price: '100,000원' }
                  ].map(pkg => {
                    const isSelected = selectedCarrots === pkg.amount && !customCarrots;
                    return (
                      <button
                        key={pkg.amount}
                        type="button"
                        onClick={() => { setSelectedCarrots(pkg.amount); setCustomCarrots(''); }}
                        className={`p-4 rounded-2xl border text-center transition-all cursor-pointer relative ${
                          isSelected 
                            ? 'bg-[#E4092B]/20 border-2 border-[#E4092B] text-white shadow-lg shadow-[#E4092B]/20' 
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E4092B] text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow-md">
                            추천
                          </span>
                        )}
                        <span className="block font-black text-lg text-white font-num">
                          {pkg.amount} 🥕
                        </span>
                        <span className="block text-[11px] text-slate-300 mt-1 font-semibold">
                          {pkg.label}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-medium">
                          {pkg.price}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Direct Custom Amount Input */}
                <div className="relative mt-2">
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
                    크리에이터에게 전할 응원 메시지 (투네이션 스타일 화면 송출)
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
                  placeholder={`"${creator.name}님, 이번 화보집 너무 기대돼요! 언제나 조용히 응원하고 있습니다 🥕"`}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#E4092B] transition-all resize-none"
                />
              </div>

              {/* Big Luxury Instant Donation Button */}
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

            {/* BENTO 3: VIP MEMBERSHIP TIERS (월간 정기 후원 래빗 클럽) */}
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
                {[
                  { name: 'Alex G.', carrots: 1000, date: '10분 전', msg: '루나님 항상 건강 챙기시고 이번 봄 화보집 너무 기대돼요! 언제나 응원합니다.' },
                  { name: 'MoonRabbit', carrots: 500, date: '45분 전', msg: '언제나 곁에서 조용히 묵묵히 응원하는 찐팬입니다. 작업 화이팅!' },
                  { name: 'CherryPie', carrots: 300, date: '2시간 전', msg: '오늘 일러스트 드로잉 감성 진짜 최고였어요 🥕' }
                ].map((g, idx) => (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2 hover:border-white/15 transition-colors">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-white">{g.name}</span>
                        <span className="text-[#FF4D6D] font-num font-bold text-xs bg-[#E4092B]/15 px-2.5 py-0.5 rounded-full border border-[#E4092B]/30">
                          +{g.carrots} 🥕
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{g.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {g.msg}
                    </p>
                  </div>
                ))}
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
