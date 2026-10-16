import React, { useState } from 'react';
import { 
  Calculator, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, 
  HelpCircle, Sparkles, Building2, TrendingUp, AlertCircle, Info, Zap, Check 
} from 'lucide-react';

export function FeesPage({ onOpenStudio, onBackToHome }) {
  const [donationCount, setDonationCount] = useState(120);
  const [avgAmount, setAvgAmount] = useState(15000);

  const totalGross = donationCount * avgAmount;
  const mimibitFee = Math.round(totalGross * 0.10); // 투네이션 표준 10.0%
  const taxWithholding = Math.round(totalGross * 0.033); // 국세청 3.3% 사업소득세
  const netCashPayout = totalGross - mimibitFee - taxWithholding; // 86.7%

  const otherFeeLive = Math.round(totalGross * 0.40); // 40% 아프리카TV/라이브 방송
  const savedVsAfreeca = otherFeeLive - mimibitFee;

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">

        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>메인 플로우로 돌아가기</span>
          </button>
          <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">
            MIMIBIT STANDARD · 10% TRANSPARENT FEE
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <Zap className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>업계 최저 수수료 · 익일 오전 10:00 계좌 직통 정산</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            수수료 40%의 시대는 끝났습니다.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              미미빗은 오직 10%.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed pt-2">
            기존 라이브 방송 플랫폼의 과도한 수수료를 깼습니다. 투네이션 표준과 동일하게 충전단에서 결제 원가를 분리하고, 
            출금 시 <strong>단일 10.0% 플랫폼 이용료</strong>만 제외한 전액을 익일 통장으로 입금합니다.
          </p>
        </div>

        {/* 3 Core Pillars (Glassmorphism Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-[#E4092B]/20 text-[#FF4D6D] border border-[#E4092B]/30 flex items-center justify-center font-heading font-black text-lg">
              10%
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              단일 10% 플랫폼 수수료
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              아프리카TV 40%, 구글/애플 인앱결제 30% 대비 1/4 수준입니다. 부가세는 팬 충전단에서 사전 처리되어 창작자의 수익을 전혀 갉아먹지 않습니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-heading font-black text-lg">
              3.3%
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              국세청 원천징수 원클릭 대행
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              개인 창작자는 종합소득세 3.3%가 자동 원천징수되어 복잡한 세무 신고 고민이 없으며, 사업자등록 창작자는 세금계산서 발행으로 90.0% 전액 입금됩니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-heading font-black text-lg">
              24h
            </span>
            <h3 className="font-heading font-black text-xl text-white">
              익일 오전 10:00 즉시 입금
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              몇 달씩 묶이는 정산 유보금이나 최소 출금액 허들이 없습니다. 정산 신청 다음 날 오전 10:00 당신의 등록된 통장으로 즉시 송금됩니다.
            </p>
          </div>
        </div>

        {/* Real-time Interactive Fee Simulator */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-b from-white/10 to-white/5 border-2 border-[#E4092B]/40 backdrop-blur-2xl shadow-2xl mb-16 space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-xs font-bold text-[#FF4D6D] uppercase tracking-wider">
                REAL-TIME REVENUE SIMULATOR
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mt-1">
                실시간 예상 수령액 시뮬레이터
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-normal">
              슬라이더를 조절하여 예상 정산 금액을 확인해 보세요.
            </span>
          </div>

          {/* Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">월간 후원 팬 수</span>
                <span className="text-white font-num text-lg">{donationCount.toLocaleString()}명</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={donationCount}
                onChange={(e) => setDonationCount(Number(e.target.value))}
                className="w-full accent-[#E4092B] cursor-pointer"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">팬 1인당 평균 후원액</span>
                <span className="text-white font-num text-lg">{avgAmount.toLocaleString()}원</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={avgAmount}
                onChange={(e) => setAvgAmount(Number(e.target.value))}
                className="w-full accent-[#E4092B] cursor-pointer"
              />
            </div>
          </div>

          {/* Result Calculation Board */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">총 후원 모금액</span>
              <div className="text-2xl sm:text-3xl font-black text-white font-num">
                {totalGross.toLocaleString()}원
              </div>
            </div>

            <div className="space-y-1 border-y md:border-y-0 md:border-x border-white/10 py-4 md:py-0">
              <span className="text-xs text-[#FF4D6D] font-medium">미미빗 수수료 (10%)</span>
              <div className="text-2xl sm:text-3xl font-black text-[#FF4D6D] font-num">
                -{mimibitFee.toLocaleString()}원
              </div>
              <span className="text-[10px] text-slate-500 font-num">원천징수 3.3%: -{taxWithholding.toLocaleString()}원</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-emerald-400 font-medium">익일 계좌 입금액 (순수령률 86.7%)</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-num">
                +{netCashPayout.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* Afreeca vs Mimibit Saved Amount Banner */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                타사 라이브 방송(40% 수수료) 대비 매월 약 <strong className="font-bold underline text-white font-num">+{savedVsAfreeca.toLocaleString()}원</strong>의 창작 수익을 더 지켜드립니다.
              </span>
            </div>
            <button
              onClick={onOpenStudio}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors"
            >
              내 스튜디오 정산 연동하기
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
