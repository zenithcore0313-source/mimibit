import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, Share2, Copy, Check, Sparkles, Trophy, Lock, Play, Pause, 
  Volume2, ShieldCheck, ArrowLeft, ExternalLink, ChevronRight, Send, 
  MessageCircle, Smartphone, Monitor, CheckCircle2, BadgeCheck, Users, 
  Target, Gift, Star, Clock, Music, Image as ImageIcon, Flame, QrCode 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { RABBIT_TIERS, DONATION_PACKAGES } from '../data/initialData';
import { getStoredCreators, findCreatorByIdOrHandle, processCreatorDonation } from '../services/api';
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
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: ['#일러스트', '#코스어', '#서브컬처', '#굿즈제작'],
    followers: 24500,
    supporters: 342,
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
      endDate: '2026. 10. 31'
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
    id: 'mochi_cos',
    handle: '@Mochi_Cos',
    name: '모치 (Mochi)',
    category: '코스프레 & 화보 일상',
    bio: '게임 & 애니메이션 캐릭터 실사화 코스어 모치입니다. 팬분들과의 1:1 비밀 소통과 미공개 셀카를 매주 전해드려요!',
    avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    tags: ['#코스프레', '#게임화보', '#애니메이션', '#팬미팅'],
    followers: 42100,
    supporters: 518,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com'
    },
    fundingGoal: {
      title: '지스타(G-STAR) 출품 초대형 코스프레 의상 제작',
      currentCarrots: 15200,
      targetCarrots: 20000,
      endDate: '2026. 11. 10'
    },
    voiceReward: {
      title: '모치의 지스타 응원 감사 보이스',
      duration: '0:15',
      message: '서포터님들 덕분에 멋진 의상 완성할 수 있게 되었어요! 지스타 현장에서 꼭 만나요!'
    },
    secretPhotos: [
      {
        id: 11,
        title: '지스타 의상 1차 피팅 비공개 B컷',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        date: '10월 11일',
        tierRequired: '골드 래빗 이상'
      }
    ]
  },
  {
    id: 'chibi_artist',
    handle: '@Chibi_Artist',
    name: '치비 스케치',
    category: 'SD 캐릭터 & 인스타툰',
    bio: '동글동글 귀여운 동물 친구들과 일상 힐링툰을 그립니다. 후원해주시는 당근은 신작 스티커 굿즈 제작비로 쓰입니다!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    tags: ['#인스타툰', '#SD캐릭터', '#일러스트', '#다꾸스티커'],
    followers: 18900,
    supporters: 215,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    fundingGoal: {
      title: '힐링 동물 친구들 2026 캘린더 & 스티커팩 제작',
      currentCarrots: 3200,
      targetCarrots: 5000,
      endDate: '2026. 11. 05'
    },
    voiceReward: {
      title: '치비 작가의 새벽 드로잉 ASMR 감사 인사',
      duration: '0:20',
      message: '오늘도 고생 많으셨어요. 귀여운 그림 보시고 편안한 밤 보내세요!'
    },
    secretPhotos: [
      {
        id: 21,
        title: '2026 캘린더 미공개 표지 러프 스케치',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        date: '10월 09일',
        tierRequired: '실버 래빗 이상'
      }
    ]
  },
  {
    id: 'neon_vibe',
    handle: '@Neon_Vibe',
    name: '네온 바이브',
    category: 'Lo-Fi 작곡 & 비트메이커',
    bio: '새벽 감성 Lo-Fi & 신스웨이브 음악을 작곡합니다. 후원자 전원에게 매주 미공개 음원 데모 트랙을 보내드려요 🎧',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    tags: ['#로파이', '#작곡', '#비트메이커', '#신스웨이브'],
    followers: 31400,
    supporters: 389,
    sns: {
      youtube: 'https://youtube.com',
      twitter: 'https://twitter.com'
    },
    fundingGoal: {
      title: '첫 정규 바이닐(LP) 한정판 프레싱 펀딩',
      currentCarrots: 9800,
      targetCarrots: 12000,
      endDate: '2026. 11. 20'
    },
    voiceReward: {
      title: 'LP 제작 비하인드 코멘터리 트랙',
      duration: '0:25',
      message: 'LP 믹싱 작업 중 가장 마음에 드는 아날로그 질감 트랙을 먼저 들려드립니다.'
    },
    secretPhotos: [
      {
        id: 31,
        title: '아날로그 신디사이저 홈스튜디오 작업실 컷',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        date: '10월 05일',
        tierRequired: '골드 래빗 이상'
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
  const [creatorsList, setCreatorsList] = useState(getStoredCreators);
  const [selectedCreatorId, setSelectedCreatorId] = useState(initialCreatorId);
  const [activeTab, setActiveTab] = useState('support'); // 'support', 'tiers', 'vault', 'guestbook'
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Quick Donation states
  const [selectedCarrots, setSelectedCarrots] = useState(100);
  const [customCarrots, setCustomCarrots] = useState('');
  const [cheerMessage, setCheerMessage] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Sync initialCreatorId if prop changes
  useEffect(() => {
    if (initialCreatorId) {
      setSelectedCreatorId(initialCreatorId);
    }
    setCreatorsList(getStoredCreators());
  }, [initialCreatorId]);

  // Active creator details
  const creator = creatorsList.find(c => 
    c.id.toLowerCase() === selectedCreatorId.toLowerCase() ||
    c.handle.replace('@', '').toLowerCase() === selectedCreatorId.replace('@', '').toLowerCase()
  ) || creatorsList[0];

  useEffect(() => {
    if (creator) {
      setFollowerCount(creator.followers || 0);
      setIsFollowing(false);
      setSelectedCarrots(100);
      setCheerMessage('');
    }
  }, [creator]);

  // Audio preview simulation
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.35);
      });
      setTimeout(() => setIsPlayingAudio(false), 3000);
    } catch (e) {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  // Follow Toggle
  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount(prev => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount(prev => prev + 1);
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
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
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
      } catch (e) {}
      alert(`${creator.name}님에게 ${carrotAmount} 당근 후원이 접수되었습니다! 🥕`);
      setCustomCarrots('');
      setCheerMessage('');
    }
  };

  const fundingPercent = Math.min(
    100, 
    Math.round((creator.fundingGoal.currentCarrots / creator.fundingGoal.targetCarrots) * 100)
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24 text-slate-800 font-sans selection:bg-[#E4092B]/10 selection:text-[#E4092B]">

      {/* Top Floating Utility Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Back & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">메인 홈으로</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              MIMIBIT 바이오링크 쇼케이스
            </span>
          </div>

          {/* Device Mockup Toggle & Share */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-0.5 rounded-xl flex items-center text-xs">
              <button
                onClick={() => setIsPhoneFrame(false)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  !isPhoneFrame ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">와이드 뷰</span>
              </button>
              <button
                onClick={() => setIsPhoneFrame(true)}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all ${
                  isPhoneFrame ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">모바일 뷰</span>
              </button>
            </div>

            <button
              onClick={() => setIsQrModalOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="QR 코드 보기"
            >
              <QrCode className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">QR</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedLink ? '링크 복사됨!' : '공유'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* Multi-Creator Switcher Strip */}
      <div className="bg-white border-b border-slate-100 py-2.5 px-4 overflow-x-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto flex items-center justify-start sm:justify-center gap-2 min-w-max">
          <span className="text-[11px] font-bold text-slate-400 mr-1 shrink-0">크리에이터 전환:</span>
          {creatorsList.map(c => {
            const isSelected = c.id === selectedCreatorId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCreatorId(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{c.name}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#E4092B]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bio Container (With optional iPhone Device Frame) */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 pt-6">
        <div className={`mx-auto transition-all duration-300 ${
          isPhoneFrame 
            ? 'max-w-[400px] bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-[8px] border-slate-900 overflow-hidden relative' 
            : 'max-w-3xl bg-white rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-200/80 overflow-hidden'
        }`}>

          {/* Simulated Mobile Status & In-App URL Bar (when Phone frame active) */}
          {isPhoneFrame && (
            <div className="bg-slate-900 text-white pt-2.5 pb-2 px-6 flex items-center justify-between text-[11px] font-bold shrink-0">
              <span>09:41</span>
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Browser Address simulation */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-[10px] text-emerald-600 font-bold">🔒</span>
              <span className="font-semibold text-slate-700 truncate font-mono text-[11px]">
                mimibit.me/{creator.handle}
              </span>
            </div>
            <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full font-medium shrink-0">
              인스타그램 인앱 프로필
            </span>
          </div>

          {/* ================= COVER BANNER ================= */}
          <div className="h-40 sm:h-52 relative overflow-hidden bg-slate-900">
            <img 
              src={creator.coverImage} 
              alt={creator.name} 
              className="w-full h-full object-cover opacity-85 hover:scale-102 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Supporter Badge on Banner */}
            <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-rose-300" />
              <span>활성 서포터 <strong>{creator.supporters}명</strong></span>
            </div>
          </div>

          {/* ================= PROFILE INFO & ACTIONS ================= */}
          <div className="px-5 sm:px-8 pb-6 pt-0 relative bg-white">
            
            {/* Avatar & Action Row */}
            <div className="flex items-end justify-between -mt-14 sm:-mt-16 mb-4">
              <div className="relative">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-white shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black ring-2 ring-white" title="실시간 활동 중">
                  ●
                </span>
              </div>

              {/* Follow & 1:1 Secret Talk buttons */}
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isFollowing 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {isFollowing ? '팔로잉 ✓' : '+ 팔로우'}
                </button>

                <button
                  onClick={onOpenMessenger}
                  className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-[#E4092B] border border-rose-200/60 text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5"
                  title="크리에이터와의 1:1 비밀 소통 열기"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>시크릿톡</span>
                </button>
              </div>
            </div>

            {/* Creator Title, Name, Verification */}
            <div className="mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                  {creator.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-[#E4092B] border border-rose-100">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#E4092B]" />
                  <span>공식 인증</span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-medium flex-wrap">
                <span className="text-slate-600 font-bold">{creator.handle}</span>
                <span>·</span>
                <span>{creator.category}</span>
                <span>·</span>
                <span>팔로워 <strong className="text-slate-700 font-semibold">{followerCount.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Bio Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 font-normal">
              {creator.bio}
            </p>

            {/* Creator Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {creator.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200/60"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Interactive Tab Navigation */}
            <div className="border-b border-slate-100 mb-6 flex items-center justify-between overflow-x-auto custom-scrollbar">
              <div className="flex items-center gap-1 sm:gap-2">
                {[
                  { id: 'support', label: '🥕 즉시 후원 & 목표' },
                  { id: 'tiers', label: '🏆 멤버십 티어 혜택' },
                  { id: 'vault', label: '🎧 보이스 & 독점 화보' },
                  { id: 'guestbook', label: '💬 서포터 응원글' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-2 sm:px-3 text-xs sm:text-sm font-bold relative transition-colors cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id 
                        ? 'text-slate-900 font-heading' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ================= TAB 1: SUPPORT & GOAL ================= */}
            {activeTab === 'support' && (
              <div className="space-y-6 animate-fade-in">

                {/* 1. Live Funding Goal Widget */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-rose-50/40 via-white to-amber-50/30 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#E4092B]" />
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {creator.fundingGoal.title}
                      </span>
                    </div>
                    <span className="font-black text-sm text-[#E4092B] font-num">
                      {fundingPercent}% 달성
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 relative">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E4092B] to-[#FFB703] rounded-full transition-all duration-1000"
                      style={{ width: `${fundingPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-medium">
                    <span>모인 당근: <strong className="text-slate-800 font-num">{creator.fundingGoal.currentCarrots.toLocaleString()} 🥕</strong> ({(creator.fundingGoal.currentCarrots * 100).toLocaleString()}원)</span>
                    <span>목표 {creator.fundingGoal.targetCarrots.toLocaleString()} 🥕 (마감: {creator.fundingGoal.endDate})</span>
                  </div>
                </div>

                {/* 2. Quick Carrot Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>선물할 당근 수량 선택</span>
                      <span className="text-[10px] text-slate-400 font-normal">(1 당근 = 100원)</span>
                    </label>
                    <span className="text-[11px] text-[#E4092B] font-bold">
                      내 보유: {(currentUser?.carrotsBalance || 0).toLocaleString()} 🥕
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[
                      { amount: 10, label: '커피 한 입', price: '1,000원' },
                      { amount: 50, label: '간식 선물', price: '5,000원' },
                      { amount: 100, label: '따뜻한 응원', price: '10,000원' },
                      { amount: 300, label: '체리 닉네임', price: '30,000원' },
                      { amount: 1000, label: '1:1 톡 해금★', price: '100,000원', isPopular: true }
                    ].map(pkg => {
                      const isSelected = selectedCarrots === pkg.amount && !customCarrots;
                      return (
                        <button
                          key={pkg.amount}
                          type="button"
                          onClick={() => { setSelectedCarrots(pkg.amount); setCustomCarrots(''); }}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                            isSelected 
                              ? 'bg-rose-50/60 border-[#E4092B] shadow-xs' 
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          {pkg.isPopular && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#E4092B] text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                              인기
                            </span>
                          )}
                          <span className="block font-black text-sm text-slate-900 font-num">
                            {pkg.amount} 🥕
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {pkg.label}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-medium">
                            {pkg.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Input */}
                  <div className="relative mt-2">
                    <input
                      type="number"
                      value={customCarrots}
                      onChange={(e) => setCustomCarrots(e.target.value)}
                      placeholder="원하는 당근 수량을 직접 입력하세요 (예: 500)"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50 transition-all font-num"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      🥕 당근
                    </span>
                  </div>
                </div>

                {/* 3. Cheering Message Input with TTS simulator preview */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    크리에이터에게 전할 응원 메시지
                  </label>
                  <textarea
                    rows={3}
                    value={cheerMessage}
                    onChange={(e) => setCheerMessage(e.target.value)}
                    placeholder={`"${creator.name}님, 이번 작품도 너무 감동이에요! 언제나 응원합니다 🥕"`}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E4092B]/15 focus:border-[#E4092B]/50 transition-all resize-none"
                  />
                </div>

                {/* Instant Support Button */}
                <button
                  type="button"
                  onClick={handleQuickDonate}
                  className="w-full py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-sm shadow-md shadow-[#E4092B]/20 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>🥕</span>
                  <span>{creator.name}님에게 당근 선물하고 답례품 받기</span>
                </button>

              </div>
            )}

            {/* ================= TAB 2: VIP TIERS ================= */}
            {activeTab === 'tiers' && (
              <div className="space-y-4 animate-fade-in">
                <p className="text-xs text-slate-500 font-medium">
                  누적 후원 당근에 따라 회원 등급이 자동으로 승급되며, 1:1 시크릿톡 및 독점 리워드가 영구 보관함에 잠금 해제됩니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {RABBIT_TIERS.map(tier => (
                    <div 
                      key={tier.id}
                      className={`p-4 rounded-2xl border transition-all relative ${
                        tier.highlight 
                          ? 'bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 border-amber-300 shadow-xs ring-1 ring-amber-200' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {tier.highlight && (
                        <span className="absolute -top-2.5 right-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                          ★ 추천 등급
                        </span>
                      )}

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.icon}</span>
                          <div>
                            <h4 className="font-heading font-bold text-sm text-slate-900">
                              {tier.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              누적 {tier.carrots.toLocaleString()} 🥕 후원 시
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-3">
                        {tier.description}
                      </p>

                      <ul className="space-y-1 mb-4 text-[11px] text-slate-600">
                        {tier.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        type="button"
                        onClick={() => onOpenDonate && onOpenDonate(tier.carrots)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          tier.highlight 
                            ? 'bg-slate-900 hover:bg-black text-white shadow-xs' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        이 등급으로 후원하기 ({tier.carrots.toLocaleString()} 🥕)
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB 3: VOICE & PHOTO VAULT ================= */}
            {activeTab === 'vault' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* 1. Voice Reward Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-50 text-[#E4092B] flex items-center justify-center">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900">
                          {creator.voiceReward.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          15초 감사 답례 보이스 메모 · 재생 시간 {creator.voiceReward.duration}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingAudio 
                          ? 'bg-[#E4092B] text-white animate-pulse' 
                          : 'bg-slate-900 hover:bg-black text-white'
                      }`}
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      <span>{isPlayingAudio ? '일시 정지' : '미리듣기'}</span>
                    </button>
                  </div>

                  {/* Sound Waveform animation */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="flex items-center gap-1 h-5 flex-1">
                      {[30, 60, 45, 90, 75, 40, 80, 50, 70, 95, 60, 40, 85, 55, 30].map((h, i) => (
                        <div 
                          key={i} 
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-[#E4092B]' : 'bg-slate-300'
                          }`}
                          style={{ height: isPlayingAudio ? `${(h * (i % 2 === 0 ? 1 : 0.7))}%` : '20%' }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">0:15 / {creator.voiceReward.duration}</span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 italic bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                    "{creator.voiceReward.message}"
                  </p>
                </div>

                {/* 2. Secret Photocard Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-slate-500" />
                      <span>서포터 전용 미공개 포토카드 갤러리</span>
                    </h4>
                    <span className="text-[11px] text-slate-400">골드/다이아 래빗 전용</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {creator.secretPhotos.map(photo => (
                      <div 
                        key={photo.id}
                        onClick={() => setLightboxImage(photo.url)}
                        className="group relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs cursor-pointer bg-slate-100"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-48 object-cover group-hover:scale-103 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3.5 flex flex-col justify-end text-white">
                          <span className="text-[10px] bg-rose-500/80 text-white px-2 py-0.5 rounded-full font-bold w-fit mb-1 backdrop-blur-xs">
                            {photo.tierRequired}
                          </span>
                          <h5 className="font-bold text-xs truncate">{photo.title}</h5>
                          <span className="text-[10px] text-white/70">{photo.date} 업데이트</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================= TAB 4: GUESTBOOK & HALL OF FAME ================= */}
            {activeTab === 'guestbook' && (
              <div className="space-y-6 animate-fade-in">
                
                {/* Top 3 Podium Cards */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 mb-3 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span>{creator.name} 명예의 전당 Top 3</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    {[
                      { rank: 2, name: 'BunnyLover', carrots: 4150, medal: '🥈', tier: '다이아' },
                      { rank: 1, name: 'Chibi_Fan', carrots: 5400, medal: '👑', tier: '로열 1위', isFirst: true },
                      { rank: 3, name: 'CarrotQueen', carrots: 2800, medal: '🥉', tier: '골드' }
                    ].map(supporter => (
                      <div 
                        key={supporter.rank} 
                        className={`p-3 rounded-2xl border ${
                          supporter.isFirst 
                            ? 'bg-amber-50/50 border-amber-300 shadow-xs ring-1 ring-amber-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <span className="text-xl block">{supporter.medal}</span>
                        <strong className="text-xs font-bold text-slate-900 block truncate mt-1">
                          {supporter.name}
                        </strong>
                        <span className="text-[11px] font-bold text-[#E4092B] font-num block">
                          {supporter.carrots.toLocaleString()} 🥕
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fan Cheering List */}
                <div className="space-y-3">
                  <h4 className="font-heading font-bold text-xs text-slate-800">
                    최근 도착한 서포터 응원글
                  </h4>

                  {[
                    { name: 'Chibi_Fan', tier: '👑 로열 래빗', time: '10분 전', message: '루나님 이번 달 펀딩 거의 다 찼네요! 끝까지 함께 달려요 🥕🔥', carrots: 500 },
                    { name: '하늘토끼', tier: '🥈 실버 래빗', time: '1시간 전', message: '체리 레드 닉네임 얻고 싶어서 첫 후원했어요! 루나님 너무 사랑스러워요 💕', carrots: 30 },
                    { name: 'Berry_Pink', tier: '🤍 화이트 래빗', time: '3시간 전', message: '인스타 릴스 보고 넘어왔어요. 그림체 너무 제 취향입니다 🤍', carrots: 10 }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 font-bold">{item.name}</strong>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded-full">{item.tier}</span>
                        </div>
                        <span className="text-[11px] font-bold text-[#E4092B] font-num">+{item.carrots} 🥕</span>
                      </div>
                      <p className="text-xs text-slate-600">{item.message}</p>
                      <span className="text-[10px] text-slate-400 font-num">{item.time}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

          {/* Lightbox for Secret Photocard */}
          {lightboxImage && (
            <div 
              onClick={() => setLightboxImage(null)}
              className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer"
            >
              <img 
                src={lightboxImage} 
                alt="Enlarged Photocard"
                className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl ring-1 ring-white/10"
              />
              <p className="text-white/70 text-xs mt-3">
                화면을 클릭하면 닫힙니다.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Floating Bottom Quick Support CTA Bar (Mobile friendly) */}
      <aside aria-label="빠른 후원" className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-[0_-10px_25px_rgba(0,0,0,0.06)]">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-black/5 shrink-0" />
            <div className="min-w-0">
              <span className="font-heading font-black text-xs text-slate-900 block truncate">
                {creator.name}
              </span>
              <span className="text-[11px] text-slate-500 truncate block">
                {fundingPercent}% 달성 중 · 당근으로 창작을 응원해주세요
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { setActiveTab('support'); handleQuickDonate(); }}
            className="px-5 py-2.5 rounded-full bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-md shadow-[#E4092B]/20 transition-all cursor-pointer active:scale-95 shrink-0 flex items-center gap-1.5"
          >
            <span>🥕</span>
            <span>당근 선물하기</span>
          </button>
        </div>
      </aside>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        creator={creator}
      />

    </div>
  );
}
