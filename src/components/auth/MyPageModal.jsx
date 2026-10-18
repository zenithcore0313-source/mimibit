import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Ticket, Award, Heart, Sparkles, ExternalLink, 
  ArrowRight, ShieldCheck, Play, Pause, Download, LogOut, ChevronRight, MessageCircle,
  Camera, Upload, Check, AlertCircle, Link2, Building2, Globe, CheckCircle2, RefreshCw, Edit3, Settings
} from 'lucide-react';
import { updateUserProfile } from '../../services/api';

const PRESET_AVATARS = [
  { id: 'av1', label: '당근 토끼', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
  { id: 'av2', label: '루나 래빗', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'av3', label: '치비 아티스트', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { id: 'av4', label: '스튜디오 크리에이터', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'av5', label: '네온 버츄얼', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { id: 'av6', label: '파스텔 아이돌', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' }
];

const CREATOR_CATEGORIES = [
  '일러스트 & 캐릭터',
  '버츄얼 유튜버 & 스트리머',
  '웹툰 & 만화',
  '코스프레 & 모델',
  '보컬 & 작곡 / 음악',
  '인디 게임 & 개발',
  'ASMR & 힐링 사운드',
  '기타 창작'
];

export function MyPageModal({ 
  isOpen, 
  onClose, 
  user, 
  onLogout, 
  onOpenDonate, 
  onSwitchToCreator, 
  onOpenCharge, 
  onOpenMessenger,
  onUpdateUser,
  initialTab = 'profile',
  transactions = [] 
}) {
  const [activeTab, setActiveTab] = useState(initialTab || 'profile');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Profile Edit States
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('일러스트 & 캐릭터');
  const [snsTwitter, setSnsTwitter] = useState('');
  const [snsInstagram, setSnsInstagram] = useState('');
  const [snsYoutube, setSnsYoutube] = useState('');
  const [bankName, setBankName] = useState('카카오뱅크');
  const [bankAccount, setBankAccount] = useState('');
  const [bankHolder, setBankHolder] = useState('');

  // UI helpers
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  const fileInputRef = useRef(null);

  // Sync state whenever modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
      setBio(user.bio || '');
      setCategory(user.category || '일러스트 & 캐릭터');
      setSnsTwitter(user.sns?.twitter || '');
      setSnsInstagram(user.sns?.instagram || '');
      setSnsYoutube(user.sns?.youtube || '');
      setBankName(user.bankInfo?.bank || '카카오뱅크');
      setBankAccount(user.bankInfo?.account || '');
      setBankHolder(user.bankInfo?.holder || '');
      setActiveTab(initialTab || 'profile');
      setSaveStatus(null);
      setShowUrlInput(false);
      setCustomUrl('');
    }
  }, [isOpen, user, initialTab]);

  if (!isOpen || !user) return null;

  // File Upload Handler (Base64)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setSaveStatus({ type: 'error', text: '이미지 파일 크기는 4MB 이하로 선택해주세요.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
      setSaveStatus(null);
    };
    reader.readAsDataURL(file);
  };

  // Direct URL Apply Handler
  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setAvatar(customUrl.trim());
    setShowUrlInput(false);
    setSaveStatus(null);
  };

  // Save Profile Handler
  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      setSaveStatus({ type: 'error', text: '활동 닉네임을 1자 이상 입력해주세요.' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const payload = {
        name: name.trim(),
        avatar: avatar || user.avatar,
        bio: bio.trim(),
        category,
        sns: {
          twitter: snsTwitter.trim(),
          instagram: snsInstagram.trim(),
          youtube: snsYoutube.trim()
        },
        bankInfo: {
          bank: bankName,
          account: bankAccount.trim(),
          holder: bankHolder.trim()
        }
      };

      const res = await updateUserProfile(user.id, payload);
      if (res.success && res.user) {
        if (onUpdateUser) {
          onUpdateUser(res.user);
        }
        setSaveStatus({ type: 'success', text: '프로필 정보가 성공적으로 저장되었습니다! ✨' });
        setTimeout(() => setSaveStatus(null), 3500);
      } else {
        setSaveStatus({ type: 'error', text: res.message || '프로필 저장 중 오류가 발생했습니다.' });
      }
    } catch (err) {
      console.error('Save profile error:', err);
      setSaveStatus({ type: 'error', text: '서버와 통신 중 문제가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const isCreatorOrAdmin = user.role === 'creator' || user.role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in custom-scrollbar overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border-2 border-[#FCD5DC] shadow-2xl overflow-hidden relative my-6">

        {/* Modal Top Bar */}
        <div className="bg-[#140E10] text-white p-5 sm:p-6 flex items-start justify-between relative">
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer" onClick={() => setActiveTab('profile')} title="프로필 사진 변경">
              <img
                src={avatar || user.avatar}
                alt={name || user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-white shadow-md transition-transform group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E4092B] text-white flex items-center justify-center text-[10px] shadow-sm">
                <Camera className="w-3 h-3" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : isCreatorOrAdmin
                    ? 'bg-rose-500 text-white'
                    : 'bg-[#FEF3C7] text-[#B45309]'
                }`}>
                  {user.role === 'admin' ? '👑 SYSTEM ROOT ADMIN' : isCreatorOrAdmin ? '🎨 정식 크리에이터' : user.tier ? `${user.tier.icon} ${user.tier.name}` : '서포터'}
                </span>
                <span className="text-[10px] text-white/50">{user.email}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-white mt-1 flex items-center gap-2">
                <span>{name || user.name} 님의 {user.role === 'admin' ? '마스터 콘솔' : '팬덤 지갑'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="mt-1 text-[11px] font-bold text-rose-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>프로필 정보 수정하기</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-5 bg-[#FFF9FA] border-b border-[#FCD5DC] text-xs">
          <div className="p-3 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-[#7A696E] block">보유 당근 (Carrots)</span>
              <div className="text-base sm:text-lg font-heading font-black text-[#E4092B] font-num mt-0.5">
                {(user.carrotsBalance || 0).toLocaleString()} 🥕
              </div>
              <span className="text-[10px] text-[#7A696E] font-num">≈ {((user.carrotsBalance || 0) * 100).toLocaleString()}원 가치</span>
            </div>
            <button
              onClick={() => { onClose(); onOpenCharge && onOpenCharge(); }}
              className="mt-2 w-full py-1.5 px-2 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white text-[11px] font-black flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>당근 충전소</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs">
            <span className="text-[11px] font-medium text-[#7A696E] block">1:1 시크릿 티켓</span>
            <div className="text-base sm:text-lg font-heading font-black text-[#140E10] font-num mt-0.5">
              {user.role === 'admin' ? '무제한 티켓' : `${user.tickets || 0}장`}
            </div>
            <span className="text-[10px] text-[#E4092B] font-bold">
              {user.role === 'admin' ? '전 채널 마스터 해금' : '비동기 1:1 소통 해금'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-[#7A696E] block">
              {user.role === 'admin' ? '권한 상태' : '멤버십 티어'}
            </span>
            <div className="text-xs font-black text-[#0284C7] mt-1">
              {user.role === 'admin' ? 'ROOT MASTER (전체 해금)' : isCreatorOrAdmin ? '파트너 창작자' : '다이아 래빗'}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full rounded-full ${user.role === 'admin' ? 'w-full bg-amber-500' : 'w-[65%] bg-[#E4092B]'}`}></div>
            </div>
            <span className="text-[9px] text-[#7A696E] font-num mt-1 block">
              {user.role === 'admin' ? '모든 크리에이터 & 콘솔 접근 권한' : '미미빗 팬덤 인증 서포터'}
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="px-4 sm:px-6 pt-3 flex gap-1 sm:gap-2 border-b border-[#FCD5DC] text-xs font-black overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'profile' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>내 프로필 설정</span>
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sponsorships')}
            className={`pb-3 px-3 relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'sponsorships' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>후원한 창작자</span>
            {activeTab === 'sponsorships' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-3 relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'tickets' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>소장 영수증 티켓</span>
            {activeTab === 'tickets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-3 relative cursor-pointer whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'messages' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>1:1 시크릿톡</span>
            {activeTab === 'messages' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 sm:p-6 text-xs max-h-[420px] overflow-y-auto custom-scrollbar">

          {/* ======================================================== */}
          {/* TAB 0: PROFILE EDIT (개인 프로필 설정)                      */}
          {/* ======================================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Alert Status Banner */}
              {saveStatus && (
                <div className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs animate-fade-in ${
                  saveStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {saveStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span>{saveStatus.text}</span>
                </div>
              )}

              {/* 1. Avatar Photo Section */}
              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-heading font-black text-sm text-[#140E10] flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#E4092B]" />
                    <span>프로필 사진 (아바타)</span>
                  </label>
                  <span className="text-[11px] text-[#7A696E]">내 기기 사진 또는 캐릭터 프리셋</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-1">
                  {/* Current Avatar Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={avatar || user.avatar}
                      alt={name || '프로필 미리보기'}
                      className="w-20 h-20 rounded-2xl object-cover border-3 border-[#FCD5DC] shadow-md ring-2 ring-rose-50"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1.5 bg-[#E4092B] hover:bg-[#CC0022] text-white rounded-full shadow-md transition-all cursor-pointer"
                      title="사진 파일 업로드"
                    >
                      <Upload className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Actions & Preset List */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-rose-400" />
                        <span>내 기기에서 사진 업로드</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>웹 이미지 URL</span>
                      </button>
                    </div>

                    {/* Direct URL input accordion */}
                    {showUrlInput && (
                      <div className="flex items-center gap-2 pt-1 animate-fade-in">
                        <input
                          type="url"
                          value={customUrl}
                          onChange={(e) => setCustomUrl(e.target.value)}
                          placeholder="https://... 이미지 링크 주소 입력"
                          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-[#E4092B]"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustomUrl}
                          className="px-3 py-1.5 rounded-xl bg-[#E4092B] text-white text-xs font-bold cursor-pointer hover:bg-[#CC0022]"
                        >
                          적용
                        </button>
                      </div>
                    )}

                    {/* Cute Preset Avatars */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-[#7A696E] block mb-1.5">
                        추천 캐릭터 아바타를 선택해보세요:
                      </span>
                      <div className="grid grid-cols-6 gap-2">
                        {PRESET_AVATARS.map((p) => {
                          const isSelected = avatar === p.url;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setAvatar(p.url)}
                              className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                                isSelected ? 'border-[#E4092B] ring-2 ring-[#E4092B]/30 scale-105' : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                              }`}
                              title={p.label}
                            >
                              <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                              {isSelected && (
                                <span className="absolute inset-0 bg-[#E4092B]/20 flex items-center justify-center">
                                  <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Basic Profile Info (Nickname & Bio) */}
              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-heading font-black text-xs text-[#140E10] flex items-center gap-1">
                      <span>활동 닉네임</span>
                      <span className="text-[#E4092B]">*</span>
                    </label>
                    <span className="text-[10px] text-[#7A696E] font-num">{name.length} / 25자</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={25}
                    placeholder="미미빗에서 활동할 멋진 닉네임을 입력하세요"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#E4092B] focus:outline-none text-xs font-bold text-[#140E10] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-heading font-black text-xs text-[#140E10]">
                      한 줄 소개 (Bio)
                    </label>
                    <span className="text-[10px] text-[#7A696E] font-num">{bio.length} / 150자</span>
                  </div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={150}
                    rows={3}
                    placeholder="나를 소개하는 한 줄 소개를 적어보세요! (예: 일러스트와 서브컬처 크리에이터를 응원하는 래빗팬입니다 🥕)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#E4092B] focus:outline-none text-xs text-[#140E10] transition-colors resize-none"
                  />
                </div>

                {/* Account Credentials Summary Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[#7A696E] block text-[10px]">계정 아이디 / 이메일</span>
                    <span className="font-mono font-bold text-slate-800 truncate block">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[#7A696E] block text-[10px]">고유 프로필 핸들</span>
                    <span className="font-mono font-bold text-[#E4092B] truncate block">@{user.handle || 'fan'}</span>
                  </div>
                </div>
              </div>

              {/* 3. Creator Specific Settings (Only for creator / admin) */}
              {isCreatorOrAdmin && (
                <div className="p-4 rounded-2xl bg-[#FFF9FA] border border-[#FCD5DC] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#FCD5DC] pb-2">
                    <div className="flex items-center gap-1.5 font-heading font-black text-xs text-[#140E10]">
                      <Sparkles className="w-4 h-4 text-[#E4092B]" />
                      <span>크리에이터 추가 상세 정보</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#E4092B] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      바이오링크 실시간 연동
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-heading font-bold text-xs text-[#140E10]">활동 카테고리 분야</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#140E10] focus:border-[#E4092B] focus:outline-none"
                    >
                      {CREATOR_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* SNS Channels */}
                  <div className="space-y-2">
                    <label className="font-heading font-bold text-xs text-[#140E10] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-[#7A696E]" />
                      <span>대표 SNS 채널 링크</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={snsTwitter}
                        onChange={(e) => setSnsTwitter(e.target.value)}
                        placeholder="X / 트위터 아이디 (@...)"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#E4092B] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={snsInstagram}
                        onChange={(e) => setSnsInstagram(e.target.value)}
                        placeholder="인스타그램 아이디"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#E4092B] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={snsYoutube}
                        onChange={(e) => setSnsYoutube(e.target.value)}
                        placeholder="유튜브 채널 주소"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#E4092B] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Settlement Bank Account */}
                  <div className="space-y-2 pt-1 border-t border-[#FCD5DC]">
                    <label className="font-heading font-bold text-xs text-[#140E10] flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-[#7A696E]" />
                      <span>후원 정산 입금 계좌</span>
                      <span className="text-[10px] text-[#7A696E] font-normal">(보안 암호화 보관)</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <select
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold focus:border-[#E4092B] focus:outline-none"
                      >
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="신한은행">신한은행</option>
                        <option value="국민은행">국민은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="농협은행">농협은행</option>
                        <option value="기업은행">기업은행</option>
                      </select>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        placeholder="계좌번호 (- 제외)"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#E4092B] focus:outline-none font-mono"
                      />
                      <input
                        type="text"
                        value={bankHolder}
                        onChange={(e) => setBankHolder(e.target.value)}
                        placeholder="예금주 성함"
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:border-[#E4092B] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Save Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E4092B] to-[#FF4D6D] hover:from-[#CC0022] hover:to-[#E4092B] text-white font-heading font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>프로필 저장 중...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>프로필 변경사항 저장하기</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 1: Sponsorships                                      */}
          {/* ======================================================== */}
          {activeTab === 'sponsorships' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Luna Rabbit"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-heading font-black text-sm text-[#140E10]">
                      Luna Rabbit (루나)
                    </h4>
                    <span className="text-[11px] text-[#7A696E]">누적 3,400개 후원 · 1위 전광판 등록 중</span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                  className="px-3 py-1.5 rounded-xl bg-[#E4092B] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  응원 보내기
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="치비 스케치"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-heading font-black text-sm text-[#140E10]">
                      치비 스케치
                    </h4>
                    <span className="text-[11px] text-[#7A696E]">누적 100개 후원 · 실버 서포터</span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0F2] text-[#E4092B] border border-[#FCD5DC] text-xs font-black cursor-pointer"
                >
                  응원 보내기
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: Receipt Tickets                                   */}
          {/* ======================================================== */}
          {activeTab === 'tickets' && (
            <div className="space-y-3">
              {transactions && transactions.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[#E4092B] block">최근 전자 결제 영수증</span>
                  {transactions.map((tx) => (
                    <div key={tx.orderId} className="bg-[#FFF9FA] rounded-2xl border border-[#FCD5DC] p-3.5 flex items-center justify-between font-mono text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black">
                            {tx.paymentMethod} 결제완료
                          </span>
                          <span className="text-[10px] text-[#7A696E]">{tx.date}</span>
                        </div>
                        <div className="font-heading font-black text-sm text-[#140E10] mt-1">
                          +{tx.totalCarrots.toLocaleString()} 🥕 충전 ({tx.price.toLocaleString()}원)
                        </div>
                        <span className="text-[10px] text-[#7A696E] font-sans">주문번호: {tx.orderId}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-600 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                          승인완료
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-[11px] font-bold text-[#140E10] block">창작자 후원 소장 티켓</span>
              <div className="bg-[#FFFDFD] rounded-2xl border-2 border-dashed border-[#F89CAE] p-4 relative overflow-hidden">
                <div className="flex justify-between items-center text-[#7A696E] border-b border-[#FCD5DC] pb-2 mb-2 font-mono text-[10px]">
                  <span className="font-black text-[#E4092B]">★ MIMIBIT OFFICIAL RECEIPT #1024 ★</span>
                  <span className="font-num">2026.10.14</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-heading font-black text-sm text-[#140E10]">Luna Rabbit (루나) 후원 티켓</div>
                    <div className="text-[#E4092B] font-black mt-0.5">골드 래빗 (🥇 1,000 당근 / 100,000원)</div>
                  </div>
                  <div className="border border-[#E4092B] text-[#E4092B] text-[9px] font-black px-2 py-0.5 rounded-md -rotate-6">
                    VERIFIED 🥕
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: Messages & Voice                                  */}
          {/* ======================================================== */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <button
                onClick={() => { onClose(); onOpenMessenger && onOpenMessenger(); }}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-between shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E4092B]">
                    <MessageCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-xs text-white">1:1 시크릿톡 라운지 열기</span>
                    <span className="text-[11px] text-slate-400">크리에이터와의 프라이빗 1:1 대화방</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold">
                    보유 티켓 {user.tickets || 5}장
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>

              <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#FCD5DC] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <strong className="text-[#E4092B]">To. Luna Rabbit</strong>
                  <span className="text-[#7A696E]">2일 전</span>
                </div>
                <p className="text-[#140E10]">"루나님 이번 일러스트북 인쇄 잘되길 바랄게요! 화이팅 🎨"</p>
                <div className="pt-2 border-t border-[#FCD5DC] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    ✓ 창작자 확인 완료
                  </span>
                  <button
                    onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                    className="px-3 py-1 rounded-xl bg-[#E4092B] text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    {isPlayingVoice ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>루나의 감사 보이스 메모 (0:15)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-[#FCD5DC] flex items-center justify-between">
          <button
            onClick={() => { onClose(); onSwitchToCreator && onSwitchToCreator(); }}
            className="text-xs font-black text-[#5E5054] hover:text-[#E4092B] flex items-center gap-1 cursor-pointer"
          >
            <span>{isCreatorOrAdmin ? '크리에이터 스튜디오 열기' : '창작자 스튜디오로 전환'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { onLogout(); onClose(); }}
            className="flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>

      </div>
    </div>
  );
}
