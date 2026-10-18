import React, { useState } from 'react';
import { 
  Trophy, MessageSquare, Volume2, Image as ImageIcon, ShieldCheck, 
  Ticket, ArrowRight, Play, Pause, Check, Heart, Lock, Eye, EyeOff, Sparkles, ChevronRight
} from 'lucide-react';

export function ToonContentMarquee({ onOpenCreatorDemo }) {
  // Interactive state
  const [activeVoicePlay, setActiveVoicePlay] = useState(false);
  const [photoUnlocked, setPhotoUnlocked] = useState(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(2); // Gold Rabbit default
  const [activeTabRank, setActiveTabRank] = useState(1);
  const [isAiShieldActive, setIsAiShieldActive] = useState(true);

  // 5 Tiers Data (Clean, high-end styling)
  const TIERS = [
    { 
      name: '화이트 래빗', 
      price: '1,000원+', 
      benefit: '방명록 응원 댓글 작성 & 기본 팬 배지'
    },
    { 
      name: '실버 래빗', 
      price: '10,000원+', 
      benefit: '인스타그램 스토리 공유 티켓 & 실버 배지'
    },
    { 
      name: '골드 래빗', 
      price: '100,000원+', 
      benefit: '1:1 시크릿 메신저 해금 & 골드 닉네임'
    },
    { 
      name: '다이아 래빗', 
      price: '300,000원+', 
      benefit: '미공개 시크릿 포토 & 비하인드 컷 전용관'
    },
    { 
      name: '당근 로열 래빗', 
      price: '500,000원+', 
      benefit: '15초 감사 보이스 노트 & 전광판 최상단 고정'
    }
  ];

  const handlePlayVoice = (e) => {
    e.stopPropagation();
    setActiveVoicePlay(!activeVoicePlay);
    if (!activeVoicePlay && window.AudioContext) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } catch (err) {}
    }
  };

  return (
    <section id="contents" className="py-20 sm:py-28 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60 inline-block mb-3">
            DONATION CONTENTS
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
            팬과 크리에이터가 교감하는 6가지 방법
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3 font-normal leading-relaxed">
            단순한 송금을 넘어, 팬의 충성도를 높이고 크리에이터의 번아웃을 방지하는 정교한 후원 메커니즘
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* 1. HALL OF FAME: Top 5 랭킹전 (7 Columns) */}
          <div 
            onClick={onOpenCreatorDemo}
            className="lg:col-span-7 bg-[#FAFAFB] rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-600 tracking-wider uppercase block">
                      HALL OF FAME
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                      월간 명예의 전당 랭킹전
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                  실시간 1위 고정
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                당월 최고액 후원자의 닉네임과 응원 한마디가 프로필 최상단 전광판에 24시간 고정 노출되어 코어 팬덤의 기여 의지를 자극합니다.
              </p>

              {/* Billboard Live Widget */}
              <div className="bg-slate-900 rounded-2xl p-4 sm:p-5 text-white text-xs border border-slate-800">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-slate-200 text-xs">실시간 전광판 뷰</span>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((rank) => (
                      <button
                        key={rank}
                        onClick={(e) => { e.stopPropagation(); setActiveTabRank(rank); }}
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          activeTabRank === rank 
                            ? 'bg-amber-400 text-slate-950 font-black' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {rank}위
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
                    {activeTabRank}위
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 truncate">
                        {activeTabRank === 1 ? 'Chibi_Fan (5,400 당근)' : activeTabRank === 2 ? 'SuperK (4,200 당근)' : 'Momo_Berry (3,100 당근)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-num">10월 시즌 진행 중</span>
                    </div>
                    <p className="text-slate-300 text-[11px] truncate mt-0.5 font-normal">
                      {activeTabRank === 1 
                        ? '"루나님 이번 일러스트북 대박나세요! 언제나 응원해요"' 
                        : activeTabRank === 2 
                        ? '"모치 코스 화보집 최고! 1위 탈환 간다!"' 
                        : '"치비 스케치 매주 챙겨보는 1인 🥕"'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>월간 시즌제 리셋으로 지속 후원 견인</span>
              <span className="text-[#E4092B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                체험하기 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* 2. PRIVATE LOUNGE: 1:1 시크릿톡 (5 Columns) */}
          <div 
            onClick={onOpenCreatorDemo}
            className="lg:col-span-5 bg-[#FAFAFB] rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E4092B] flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#E4092B] tracking-wider uppercase block">
                      PRIVATE LOUNGE
                    </span>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-slate-900 tracking-tight">
                      1:1 안심 시크릿톡
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#E4092B] bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  티켓 소모제
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                개인 카카오톡이나 DM이 아닌, 티켓 1장 = 메시지 1통 비동기 소모 방식으로 크리에이터의 사생활과 피로도를 완벽히 보호합니다.
              </p>

              {/* Chat Bubble Preview */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1 text-[#E4092B] font-bold">
                    <Ticket className="w-3 h-3" />
                    잔여 티켓: 3장
                  </span>
                  <span>답장 의무 면제 정책</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-800 leading-relaxed">
                  <strong className="text-slate-900 block font-bold mb-0.5">골드 서포터</strong>
                  "루나님 오늘 작업 보이스 너무 힐링됐어요! 항상 응원합니다."
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50/60 text-[11px] text-slate-800 leading-relaxed border-l-2 border-[#E4092B]">
                  <strong className="text-[#E4092B] block font-bold mb-0.5">루나 (크리에이터)</strong>
                  "고마워요 서포터님! 이번 주말 B컷 화보도 전용관에 업로드될 예정이에요."
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>스팸·성희롱 0건 지향 안심 메신저</span>
              <span className="text-[#E4092B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                자세히 보기 <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* 3. 15초 감사 보이스 노트 (4 Columns) */}
          <div className="lg:col-span-4 bg-[#FAFAFB] rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 mb-1 tracking-tight">
                15초 감사 보이스 답례
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                긴 영상 제작 없이 스마트폰 마이크로 가볍게 15초 감사 음성을 녹음하여 팬에게 잊지 못할 감동을 선물합니다.
              </p>

              {/* Voice Player Interactive Widget */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayVoice}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    activeVoicePlay 
                      ? 'bg-[#E4092B] text-white shadow-sm' 
                      : 'bg-slate-900 hover:bg-black text-white'
                  }`}
                >
                  {activeVoicePlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-[11px] font-bold text-slate-900">
                    <span>루나의 감사 보이스</span>
                    <span className="font-num text-slate-400">0:15</span>
                  </div>
                  {/* Waveform graphic */}
                  <div className="flex items-center gap-0.5 h-4 mt-1">
                    {[40, 70, 30, 90, 60, 100, 45, 80, 50, 95, 30, 65, 85, 40, 75, 55].map((h, i) => (
                      <span 
                        key={i} 
                        className={`flex-1 rounded-full transition-all ${
                          activeVoicePlay ? 'bg-[#E4092B] animate-pulse' : 'bg-slate-200'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-medium">
              클릭하여 실제 오디오 톤을 미리 들어보세요
            </div>
          </div>

          {/* 4. 시크릿 포토 카드 (4 Columns) */}
          <div className="lg:col-span-4 bg-[#FAFAFB] rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center mb-4">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 mb-1 tracking-tight">
                미공개 시크릿 포토
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                인스타에 올리지 못한 비하인드 B컷 화보나 원본 일러스트를 당근 후원자 전용으로 블라인드 해금합니다.
              </p>

              {/* Photo Blind Widget */}
              <div 
                onClick={() => setPhotoUnlocked(!photoUnlocked)}
                className="relative rounded-2xl overflow-hidden h-28 border border-slate-200 cursor-pointer group"
              >
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
                  alt="Secret"
                  className={`w-full h-full object-cover transition-all duration-300 ${
                    photoUnlocked ? 'filter-none' : 'blur-md scale-105 brightness-90'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-xs font-bold gap-1.5 transition-opacity">
                  {photoUnlocked ? (
                    <>
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span>해금 완료 (다시 블라인드)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>클릭하여 시크릿 포토 확인</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-medium">
              화보 도난 방지 워터마크 기술 기본 탑재
            </div>
          </div>

          {/* 5. 악플 0% AI 클린 가드 (4 Columns) */}
          <div className="lg:col-span-4 bg-[#FAFAFB] rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black text-lg text-slate-900 mb-1 tracking-tight">
                악플 0% AI 쉴드
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                비하, 성희롱, 공격적인 문장은 크리에이터의 눈에 닿기 전 국세청 금융망 수준의 필터링으로 차단됩니다.
              </p>

              {/* AI Guard Status Widget */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">실시간 유해 메시지 차단</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-500 flex justify-between">
                  <span>금일 필터링된 비방</span>
                  <span className="font-bold text-purple-700 font-num">14건 방어</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/70 text-[11px] text-slate-400 font-medium">
              창작자의 멘탈을 24시간 철저히 보호합니다
            </div>
          </div>

        </div>

        {/* 6. 5 Tiers Clean Strip */}
        <div className="mt-12 bg-[#FAFAFB] rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#E4092B] uppercase tracking-wider block">
                FANDOM TIER SYSTEM
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                금액별 5단계 팬덤 배지 & 리워드
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              작은 응원부터 VIP 후원자까지, 모든 팬이 만족하는 맞춤형 혜택 구조
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {TIERS.map((tier, idx) => {
              const isSelected = selectedTierIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedTierIndex(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 bg-white ring-1 ring-slate-900 shadow-sm'
                      : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-bold text-slate-400">Step 0{idx + 1}</div>
                  <div className="font-heading font-black text-sm text-slate-900 mt-1">
                    {tier.name}
                  </div>
                  <div className="text-xs font-bold text-[#E4092B] font-num mt-0.5">
                    {tier.price}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2.5 leading-snug font-normal">
                    {tier.benefit}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
