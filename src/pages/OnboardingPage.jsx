import React, { useState } from 'react';
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, Copy, CheckCircle2, 
  ExternalLink, Smartphone, Building2, HelpCircle, AlertCircle, ShieldCheck, QrCode, Share2, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QrCodeModal } from '../components/common/QrCodeModal';

const POPULAR_BANKS = [
  { name: '토스뱅크', icon: '🔵' },
  { name: '카카오뱅크', icon: '🟡' },
  { name: 'KB국민은행', icon: '🟤' },
  { name: '신한은행', icon: '🔷' },
  { name: '우리은행', icon: '💠' },
  { name: '하나은행', icon: '🟢' },
  { name: 'NH농협', icon: '🌱' },
  { name: 'IBK기업', icon: '🏢' }
];

const CREATOR_CATEGORIES = [
  '일러스트 & 드로잉', '코스프레 & 화보', '인스타툰 & 웹툰', 
  'Lo-Fi 음악 & 비트', '버튜버 (VTuber)', '댄스 & 숏폼 일상', '디지털 굿즈'
];

export function OnboardingPage({ onCompleteOnboarding, onBackToHome, onNavigate }) {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  // Form States (Clean for new creators)
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    category: '일러스트 & 드로잉',
    snsUrl: '',
    goalTitle: '',
    goalCarrots: 5000,
    bio: '',
    bankName: '토스뱅크',
    accountNumber: '',
    accountHolder: '',
    welcomeVoiceMsg: '',
    agreeTerms: true
  });

  const fullLink = `https://mimibit.me/@${formData.handle.replace('@', '') || 'creator'}`;

  // Account 1-won real-time verification simulation
  const handleVerifyAccount = () => {
    if (!formData.accountNumber.trim() || !formData.accountHolder.trim()) {
      alert('계좌번호와 예금주 성명을 입력해주세요.');
      return;
    }
    setIsVerifyingAccount(true);
    setTimeout(() => {
      setIsVerifyingAccount(false);
      setIsAccountVerified(true);
    }, 1200);
  };

  const handleNextStep = (e) => {
    e?.preventDefault();
    if (step === 1) {
      if (!formData.name.trim() || !formData.handle.trim()) {
        alert('활동명과 고유 영문 링크를 입력해주세요.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.goalTitle.trim()) {
        alert('첫 펀딩 목표 제목을 입력해주세요.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!formData.accountNumber.trim() || !formData.accountHolder.trim()) {
        alert('정산 계좌번호와 예금주 성명을 입력해주세요.');
        return;
      }
      if (!isAccountVerified) {
        setIsAccountVerified(true);
      }
      // Confetti celebratory effect
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
      
      if (onCompleteOnboarding) {
        onCompleteOnboarding(formData);
      }
      setStep(4);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/3 w-[800px] h-[500px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-6 sm:px-8">

        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>메인 플로우로</span>
          </button>
          <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">
            MIMIBIT · 3-MINUTE ONBOARDING
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={step >= 1 ? 'text-[#FF4D6D]' : 'text-slate-500'}>1. 프로필 & 링크</span>
            <span className={step >= 2 ? 'text-[#FF4D6D]' : 'text-slate-500'}>2. 펀딩 목표</span>
            <span className={step >= 3 ? 'text-[#FF4D6D]' : 'text-slate-500'}>3. 정산 계좌</span>
            <span className={step >= 4 ? 'text-emerald-400' : 'text-slate-500'}>4. 링크 발급</span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Profile & Unique Link */}
        {step === 1 && (
          <div className="p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider block">
                STEP 1 OF 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1 tracking-tight">
                기본 활동명과 링크를 설정하세요
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                인스타그램/틱톡 프로필 링크에 걸어둘 나만의 고유 주소가 생성됩니다.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Creator Handle (URL) */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  나만의 바이오링크 고유 영문 주소 <span className="text-[#FF4D6D]">*</span>
                </label>
                <div className="flex items-center rounded-2xl bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-[#E4092B]/30 focus-within:border-[#E4092B] transition-all overflow-hidden px-4 py-3">
                  <span className="text-xs font-mono font-bold text-slate-400 mr-1 select-none">
                    mimibit.me/@
                  </span>
                  <input
                    type="text"
                    value={formData.handle.replace('@', '')}
                    onChange={(e) => setFormData({ ...formData, handle: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                    placeholder="my_name"
                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-white font-mono"
                  />
                  <span className="text-[11px] text-emerald-400 font-bold shrink-0">
                    ✓ 사용 가능
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  * 영문, 숫자, 밑줄(_)만 사용 가능합니다.
                </p>
              </div>

              {/* Creator Display Name */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  크리에이터 활동명 (닉네임) <span className="text-[#FF4D6D]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 루나 (Luna)"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  주요 창작 카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {CREATOR_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        formData.category === cat
                          ? 'bg-[#E4092B] text-white shadow-md shadow-[#E4092B]/30'
                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio Description */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  프로필 한 줄 소개
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="팬분들에게 전하고 싶은 따뜻한 인사를 남겨주세요."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextStep}
              className="w-full py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-heading font-black text-sm shadow-xl shadow-[#E4092B]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>다음: 펀딩 목표 설정하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Goal & Reward Settings */}
        {step === 2 && (
          <div className="p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider block">
                STEP 2 OF 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1 tracking-tight">
                첫 펀딩 목표와 답례품을 정해주세요
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                명확한 창작 목표가 있으면 서포터들의 자발적 후원 참여율이 3.4배 높아집니다.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  펀딩 프로젝트 제목 <span className="text-[#FF4D6D]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.goalTitle}
                  onChange={(e) => setFormData({ ...formData, goalTitle: e.target.value })}
                  placeholder="예: 2026 봄 일러스트북 & 굿즈 제작 펀딩 🎨"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    목표 후원 당근 수량
                  </label>
                  <span className="font-heading font-black text-sm text-[#FF4D6D] font-num">
                    {formData.goalCarrots.toLocaleString()} 🥕 ({(formData.goalCarrots * 100).toLocaleString()}원)
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={formData.goalCarrots}
                  onChange={(e) => setFormData({ ...formData, goalCarrots: Number(e.target.value) })}
                  className="w-full accent-[#E4092B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>1,000 당근 (10만원)</span>
                  <span>25,000 당근 (250만원)</span>
                  <span>50,000 당근 (500만원)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  서포터 환영 보이스 메시지 텍스트
                </label>
                <textarea
                  rows={2}
                  value={formData.welcomeVoiceMsg}
                  onChange={(e) => setFormData({ ...formData, welcomeVoiceMsg: e.target.value })}
                  placeholder="후원 시 전달할 15초 음성 답례품의 대표 멘트를 입력하세요."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all resize-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  * 가입 후 스튜디오에서 직접 15초 마이크 녹음으로 교체할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-heading font-black text-sm shadow-xl shadow-[#E4092B]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>다음: 정산 계좌 등록하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bank Account Verification */}
        {step === 3 && (
          <div className="p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in">
            <div>
              <span className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider block">
                STEP 3 OF 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1 tracking-tight">
                후원금을 입금받을 정산 계좌를 등록하세요
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                투네이션 표준 10.0% 수수료를 제외한 <strong>정산금(최대 90.0%, 원천징수 시 86.7%)</strong>이 익일 이 계좌로 직통 입금됩니다.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  입금 은행 선택 <span className="text-[#FF4D6D]">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {POPULAR_BANKS.map(b => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, bankName: b.name })}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        formData.bankName === b.name
                          ? 'bg-[#E4092B] text-white font-bold border-[#E4092B] shadow-lg shadow-[#E4092B]/20'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      <span className="block text-base">{b.icon}</span>
                      <span className="block text-[11px] mt-0.5 truncate">{b.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  계좌번호 (하이픈 없이 입력) <span className="text-[#FF4D6D]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/[^0-9]/g, '') })}
                  placeholder="예: 100012345678"
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5">
                  예금주 성명 <span className="text-[#FF4D6D]">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    placeholder="예: 홍길동"
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#E4092B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyAccount}
                    disabled={isVerifyingAccount || isAccountVerified}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-60"
                  >
                    {isVerifyingAccount ? '확인 중...' : isAccountVerified ? '실명 인증 완료' : '실명 조회'}
                  </button>
                </div>
                {isAccountVerified && (
                  <p className="text-[11px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>금융결제원 전산망 실명 조회 완료: {formData.bankName} ({formData.accountHolder})</span>
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-400 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-slate-200 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>에스크로 안심 정산 및 세무 증빙 안내</span>
                </div>
                후원 모집액은 법적 에스크로 계좌에 안전하게 예치되며, 신청 시 등록된 본인 계좌로 익일 오전 10:00에 입금 처리됩니다.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all cursor-pointer"
              >
                이전
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex-1 py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-heading font-black text-sm shadow-xl shadow-[#E4092B]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>3분 만에 내 링크 개설 완료하기</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Completion & Handover Screen */}
        {step === 4 && (
          <div className="p-8 sm:p-12 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl text-center space-y-6 animate-fade-in">
            
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl shadow-xl">
              🎉
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                CONGRATULATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1 tracking-tight">
                나만의 미미빗 바이오링크가 개설되었습니다!
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto">
                이제 인스타그램이나 틱톡 프로필 링크(Bio)에 걸어두기만 하면, 팬들이 3초 만에 후원하고 1:1 시크릿톡을 나눌 수 있습니다.
              </p>
            </div>

            {/* Generated Link Display Box */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 font-bold block">내 바이오링크 URL</span>
                <span className="text-sm sm:text-base font-mono font-bold text-white truncate block">
                  {fullLink}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#E4092B] hover:bg-[#CC0022] text-white shadow-md'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '링크 복사됨!' : '링크 복사'}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <a
                href={`#/@${formData.handle.replace(/[@/]/g, '')}`}
                onClick={(e) => {
                  e.preventDefault();
                  const handleClean = formData.handle.replace(/[@/]/g, '');
                  if (onNavigate) {
                    onNavigate('bio', handleClean);
                  } else {
                    window.location.hash = `#/@${handleClean}`;
                  }
                }}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#FF4D6D]" />
                <span>내 링크 실물 확인</span>
              </a>

              <button
                type="button"
                onClick={() => setIsQrOpen(true)}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#FF4D6D]" />
                <span>QR 코드 다운로드</span>
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                className="w-full py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#E4092B]/20"
              >
                <span>메인으로 이동</span>
              </button>
            </div>

            {/* QR Modal for Newly Created Creator */}
            <QrCodeModal
              isOpen={isQrOpen}
              onClose={() => setIsQrOpen(false)}
              creator={{
                name: formData.name,
                handle: `@${formData.handle.replace(/[@/]/g, '')}`,
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }}
            />

          </div>
        )}

      </div>
    </div>
  );
}
