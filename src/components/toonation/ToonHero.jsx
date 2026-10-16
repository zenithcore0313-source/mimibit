import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronDown, ShieldCheck, Zap, Volume2, Sparkles, Check, Play, Pause } from 'lucide-react';

export function ToonHero({ onOpenCreatorDemo, onOpenStudio, onOpenOnboarding }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTimer, setAudioTimer] = useState(15);

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

  // High-performance 60fps Scroll Progress Tracker (0.0 to 1.0)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const total = containerRef.current.offsetHeight - window.innerHeight;
            if (total > 0) {
              const current = -rect.top;
              const p = Math.min(1, Math.max(0, current / total));
              setProgress(p);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to calculate opacity & scale based on active progress range
  // fade in from start, peak at mid, fade out at end
  const getStageStyle = (start, peakStart, peakEnd, end) => {
    if (progress < start || progress > end) {
      return { opacity: 0, transform: 'translateY(24px) scale(0.96)', pointerEvents: 'none' };
    }
    let opacity = 1;
    if (progress < peakStart) {
      opacity = (progress - start) / (peakStart - start);
    } else if (progress > peakEnd) {
      opacity = 1 - (progress - peakEnd) / (end - peakEnd);
    }
    const scale = 0.96 + opacity * 0.04;
    const translateY = (1 - opacity) * 20;
    return {
      opacity: Math.max(0, Math.min(1, opacity)),
      transform: `translateY(${translateY}px) scale(${scale})`,
      pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      transition: 'opacity 0.25s ease-out, transform 0.25s ease-out',
    };
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#06080D] text-white font-sans select-none">
      
      {/* ========================================================================= */}
      {/* FIXED FULL-VIEWPORT STAGE (쏘카 브랜드 사이트 메인 메커니즘 100% 동일 구현)     */}
      {/* ========================================================================= */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between items-center px-6 py-12">
        
        {/* Dynamic Continuous Ambient Glow (Reacts to scroll progress) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
          style={{
            background: progress < 0.2
              ? 'radial-gradient(circle at 50% 50%, rgba(228, 9, 43, 0.18) 0%, rgba(6, 8, 13, 0) 70%)'
              : progress < 0.45
              ? 'radial-gradient(circle at 50% 45%, rgba(255, 77, 109, 0.22) 0%, rgba(6, 8, 13, 0) 65%)'
              : progress < 0.70
              ? 'radial-gradient(circle at 50% 55%, rgba(139, 92, 246, 0.20) 0%, rgba(6, 8, 13, 0) 70%)'
              : progress < 0.88
              ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.18) 0%, rgba(6, 8, 13, 0) 70%)'
              : 'radial-gradient(circle at 50% 50%, rgba(228, 9, 43, 0.25) 0%, rgba(6, 8, 13, 0) 70%)'
          }}
        />

        {/* Cinematic Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Top Minimal Flow Indicator */}
        <div className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#E4092B] animate-ping" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/50">
              MIMIBIT CONTINUOUS FLOW
            </span>
          </div>

          {/* Minimal 5-Dot Progress Track */}
          <div className="flex items-center gap-2">
            {[0.1, 0.3, 0.52, 0.73, 0.93].map((threshold, idx) => (
              <span
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  progress >= threshold - 0.08 && progress <= threshold + 0.12
                    ? 'w-6 bg-[#E4092B]'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER STAGE: THE 5 SEAMLESS PHASES OF THE FLOW (스크롤에 따라 연속 완성)   */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full max-w-4xl mx-auto my-auto flex flex-col items-center justify-center text-center px-4">

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 0: PRELUDE - "방송을 켜지 않아도" (Progress 0.00 ~ 0.20)             */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
            style={getStageStyle(0.0, 0.0, 0.12, 0.20)}
          >
            <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white/40">
              THE NEXT PARADIGM FOR CREATORS
            </span>
            <div className="space-y-3 break-keep">
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-heading font-black tracking-tight text-white leading-tight">
                방송을 켜지 않아도.
              </h1>
              <h1 className="text-4xl sm:text-7xl md:text-8xl font-heading font-black tracking-tight leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">링크 하나로 완성되는 </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">팬덤의 온기.</span>
              </h1>
            </div>
            <p className="text-base sm:text-xl text-slate-400 max-w-xl font-normal leading-relaxed pt-2 break-keep">
              복잡한 방송 세팅과 마감 압박은 이제 그만.<br />
              스크롤을 내려 미미빗이 완성하는 새로운 창작자의 여정을 확인하세요.
            </p>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 1: THE LINK - "당신의 이름이 담긴 단 하나의 주소" (0.18 ~ 0.40)      */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
            style={getStageStyle(0.18, 0.26, 0.34, 0.42)}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#FF4D6D] bg-[#E4092B]/10 px-4 py-1.5 rounded-full border border-[#E4092B]/20">
              01 / THE LINK
            </span>
            <div className="space-y-2 break-keep">
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight">
                당신의 이름이 담긴<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">단 하나의 주소.</span>
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-400 max-w-lg font-normal leading-relaxed break-keep">
              인스타그램, 틱톡, 트위터 바이오에 링크 하나 걸어두세요.<br />
              OBS도, 마이크도 없이 3분 만에 당신의 후원 라운지가 열립니다.
            </p>

            {/* Floating Glass URL Card */}
            <div className="mt-4 p-5 sm:p-6 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center gap-4 max-w-md w-full">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E4092B] to-[#FF4D6D] text-white flex items-center justify-center text-xl font-black shadow-lg">
                🔗
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="text-[11px] font-bold text-slate-400">크리에이터 전용 링크</div>
                <div className="text-base sm:text-lg font-black text-white truncate font-num">
                  mimibit.me/@Luna_Rabbit
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold">
                연결 완료
              </span>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 2: THE SUPPORT - "가입 없이 전해지는 마음" (0.40 ~ 0.62)             */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
            style={getStageStyle(0.40, 0.48, 0.56, 0.64)}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
              02 / THE HEARTBEAT
            </span>
            <div className="space-y-2 break-keep">
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight">
                가입 없는 1초 결제,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">팬들의 망설임 없는 응원.</span>
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-400 max-w-lg font-normal leading-relaxed break-keep">
              복잡한 회원가입 절차는 팬의 70%를 이탈시킵니다.<br />
              카카오페이·토스페이로 500원부터 로그인 없이 즉시 마음을 전합니다.
            </p>

            {/* Instant Support Interactive Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 max-w-lg">
              <div className="px-5 py-3 rounded-2xl bg-[#FEE500] text-[#3C1E1E] font-black text-sm shadow-xl flex items-center gap-2">
                <span>⚡</span> 카카오페이 원클릭
              </div>
              <div className="px-5 py-3 rounded-2xl bg-[#0064FF] text-white font-black text-sm shadow-xl flex items-center gap-2">
                <span>🔷</span> 토스페이 원클릭
              </div>
              <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm backdrop-blur-md">
                <span>💳</span> 500원 즉시 후원 승인
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 3: THE VOICE - "15초 목소리로 전하는 감동" (0.62 ~ 0.82)              */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
            style={getStageStyle(0.62, 0.70, 0.76, 0.84)}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-purple-400 bg-purple-400/10 px-4 py-1.5 rounded-full border border-purple-400/20">
              03 / THE CONNECTION
            </span>
            <div className="space-y-2 break-keep">
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight">
                전화번호 없는 안심 소통,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-purple-400">15초 목소리의 감동.</span>
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-400 max-w-lg font-normal leading-relaxed break-keep">
              사생활 노출 걱정 없는 1:1 티켓 기반 시크릿 라운지.<br />
              스마트폰으로 녹음한 15초 음성 답례품으로 팬에게 평생 간직할 추억을 선물하세요.
            </p>

            {/* Interactive Voice Waveform Card */}
            <div className="mt-4 p-5 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-2xl max-w-md w-full space-y-3 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                <span>🎧 루나의 10월 감사 음성 답례</span>
                <span className="font-num">0:{audioTimer.toString().padStart(2, '0')}</span>
              </div>
              <div className="flex items-center gap-1.5 h-8">
                {[30, 80, 50, 100, 70, 90, 40, 85, 60, 95, 40, 70, 90, 60, 100, 75, 45, 80].map((h, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isPlayingAudio ? 'bg-purple-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: isPlayingAudio ? `${h}%` : '35%' }}
                  />
                ))}
              </div>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span>{isPlayingAudio ? '일시 정지' : '15초 목소리 답례 듣기'}</span>
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 4: THE TRANSPARENCY - "수수료 40%의 시대는 끝" (0.80 ~ 0.94)          */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-6"
            style={getStageStyle(0.80, 0.86, 0.92, 0.96)}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-4 py-1.5 rounded-full border border-emerald-400/20">
              04 / THE TRANSPARENCY
            </span>
            <div className="space-y-2 break-keep">
              <h2 className="text-3xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight">
                수수료 40%의 시대는 끝.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-400">미미빗은 오직 10%.</span>
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-400 max-w-lg font-normal leading-relaxed break-keep">
              기존 라이브 플랫폼의 과도한 수수료를 없앴습니다.<br />
              정산 신청 다음 날 오전 10:00, 당신의 계좌로 즉시 온전히 입금됩니다.
            </p>

            {/* Toss Bank Deposit Notification Push */}
            <div className="mt-4 p-4 rounded-3xl bg-blue-600 text-white shadow-2xl flex items-center gap-4 max-w-md w-full">
              <div className="w-11 h-11 rounded-2xl bg-white text-blue-600 font-black text-lg flex items-center justify-center shrink-0">
                T
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs text-blue-200">
                  <span>토스뱅크 입금 알림</span>
                  <span>익일 오전 10:00</span>
                </div>
                <div className="text-base sm:text-lg font-black truncate text-white mt-0.5 font-num">
                  (주)미미빗 +1,560,600원 입금
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* PHASE 5: THE FINALE - "플로우의 완성: 지금 시작하세요" (0.92 ~ 1.00)          */}
          {/* ----------------------------------------------------------------------- */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center space-y-7"
            style={getStageStyle(0.92, 0.96, 1.0, 1.0)}
          >
            <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-[#FF4D6D] bg-[#E4092B]/10 px-4 py-1.5 rounded-full border border-[#E4092B]/30">
              THE FINALE
            </span>
            <div className="space-y-3 break-keep">
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black tracking-tight text-white leading-tight">
                오늘, 당신만의<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">후원 링크를 완성하세요.</span>
              </h2>
            </div>
            <p className="text-base sm:text-xl text-slate-400 max-w-lg font-normal leading-relaxed break-keep">
              별도의 승인 절차 없이, 지금 바로 3분 만에 시작할 수 있습니다.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={onOpenOnboarding}
                className="px-10 py-5 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-heading font-black text-lg shadow-2xl shadow-[#E4092B]/50 transition-all cursor-pointer active:scale-95 flex items-center gap-3"
              >
                <span>3분 만에 내 링크 무료로 만들기</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenCreatorDemo}
                className="px-8 py-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>실제 크리에이터 프로필 보기</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Scroll Guide */}
        <div className="relative z-20 flex flex-col items-center gap-1.5 text-white/50 pb-2">
          <span className="text-[11px] font-semibold tracking-wider uppercase">
            {progress < 0.92 ? '아래로 내려보세요' : '플로우 완성됨'}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${progress < 0.92 ? 'animate-bounce text-white/70' : 'rotate-180 text-emerald-400'}`} />
        </div>

      </div>

    </div>
  );
}
