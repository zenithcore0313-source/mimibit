import React, { useState } from 'react';
import { 
  Calculator, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, 
  HelpCircle, Sparkles, Building2, TrendingUp, AlertCircle, Info 
} from 'lucide-react';

export function FeesPage({ onOpenStudio, onBackToHome }) {
  const [donationCount, setDonationCount] = useState(120);
  const [avgAmount, setAvgAmount] = useState(15000);

  const totalGross = donationCount * avgAmount;
  const mimibitFee = Math.round(totalGross * 0.10); // 투네이션 표준 10.0%
  const taxWithholding = Math.round(totalGross * 0.033); // 국세청 3.3% 사업소득세
  const netCashPayout = totalGross - mimibitFee - taxWithholding; // 86.7%

  const otherFeePatreon = Math.round(totalGross * 0.16); // ~16%
  const otherFeeLive = Math.round(totalGross * 0.35); // ~35% live broadcast (아프리카TV)

  const savedVsAfreeca = (totalGross * 0.35) - mimibitFee;

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-12 sm:py-16 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 홈으로 돌아가기</span>
          </button>
          <span className="text-xs font-semibold text-slate-400">
            MIMIBIT · 투네이션 표준 수수료 및 정산 가이드
          </span>
        </div>

        {/* Page Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E4092B] text-xs font-bold border border-rose-100/60 mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>TOONATION STANDARD REVENUE MODEL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            투명한 10% 정산 수수료 & 정산 가이드
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-500 mt-3 font-normal leading-relaxed">
            투네이션과 동일하게 충전단에서 PG 결제 원가(VAT)를 상쇄하고, 출금 시 <strong>플랫폼 이용료 단 10.0%</strong>만 부과하는 검증된 지속 가능 비즈니스 모델입니다.
          </p>
        </div>

        {/* 3 Core Fee Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E4092B] flex items-center justify-center font-heading font-black text-base mb-4">
              10%
            </span>
            <h3 className="font-heading font-black text-lg text-slate-900 mb-2">
              투네이션 표준 단일 이용료
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              아프리카TV 40%, 구글/애플 30% 대비 1/3 수준의 10.0% 플랫폼 중개 수수료만 부과되며, 부가세는 팬 충전단에서 처리됩니다.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-heading font-black text-base mb-4">
              3.3%
            </span>
            <h3 className="font-heading font-black text-lg text-slate-900 mb-2">
              국세청 원천징수 세무 지원
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              개인 창작자는 종합소득세 3.3%가 원천징수되어 복잡한 세무 신고 걱정이 없으며, 사업자등록 창작자는 90.0% 전액 입금됩니다.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-heading font-black text-base mb-4">
              익일
            </span>
            <h3 className="font-heading font-black text-lg text-slate-900 mb-2">
              신청 즉시 익일 10:00 출금
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              한 달을 기다릴 필요 없이, 크리에이터 스튜디오에서 [출금 신청] 버튼을 누르면 영업일 기준 익일 오전 10시에 계좌로 입금됩니다.
            </p>
          </div>
        </div>

        {/* Interactive Payout Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mb-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#E4092B] bg-rose-50 px-2.5 py-0.5 rounded-full">
                SIMULATOR
              </span>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mt-1">
                실시간 수익 및 정산 시뮬레이터
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
              슬라이더를 움직여 통장 실수령액을 확인해보세요
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider 1: Donation Count */}
              <div>
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-bold text-slate-900">월간 예상 후원 건수</span>
                  <span className="font-black text-[#E4092B] font-num text-sm">
                    {donationCount}건
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={donationCount}
                  onChange={(e) => setDonationCount(parseInt(e.target.value))}
                  className="w-full accent-[#E4092B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>10건</span>
                  <span>120건 (미미빗 평균)</span>
                  <span>500건 (인기 창작자)</span>
                </div>
              </div>

              {/* Slider 2: Average Donation Amount */}
              <div>
                <div className="flex justify-between items-center mb-2 text-xs">
                  <span className="font-bold text-slate-900">건당 평균 후원 단가 (랭킹전 효과)</span>
                  <span className="font-black text-[#E4092B] font-num text-sm">
                    {avgAmount.toLocaleString()}원
                  </span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="50000"
                  step="1000"
                  value={avgAmount}
                  onChange={(e) => setAvgAmount(parseInt(e.target.value))}
                  className="w-full accent-[#E4092B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>3,000원</span>
                  <span>15,000원 (평균 객단가)</span>
                  <span>50,000원 (코어 서포터)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-bold">💡 랭킹전 객단가 효과:</strong> Top 5 전광판 랭킹전과 1위 왕관 테두리 효과로 일반적인 단순 송금 플랫폼 대비 건당 결제 단가가 평균 3배(15,000원 이상)로 상승합니다.
              </div>
            </div>

            {/* Payout Summary Card (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                ESTIMATED NET PAYOUT
              </span>

              <div>
                <div className="text-3xl sm:text-4xl font-heading font-black text-[#E4092B] font-num">
                  {netCashPayout.toLocaleString()}<span className="text-xl text-white ml-1">원</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  총 거래액 {totalGross.toLocaleString()}원 중 <strong>86.7% 계좌 입금</strong>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>미미빗 플랫폼 수수료 (10.0%)</span>
                  <span className="text-rose-400 font-num">-{mimibitFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>국세청 사업소득 원천징수 (3.3%)</span>
                  <span className="font-num">-{taxWithholding.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-xs pt-1">
                  <span>★ 아프리카TV(35%) 대비 매월 절감액</span>
                  <span className="font-num">+{savedVsAfreeca.toLocaleString()}원</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenStudio}
                className="w-full mt-4 py-3 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>내 정산 계좌 등록하고 스튜디오 열기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Platform Comparison Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] mb-16">
          <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 mb-6 text-center tracking-tight">
            주요 후원 플랫폼 수수료 및 정책 비교
          </h2>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-900 bg-slate-50">
                  <th className="p-3.5 font-bold">비교 항목</th>
                  <th className="p-3.5 font-bold text-[#E4092B] bg-rose-50/60">MIMIBIT (미미빗)</th>
                  <th className="p-3.5 font-bold">아프리카TV (별풍선)</th>
                  <th className="p-3.5 font-bold">인앱결제 (구글/애플)</th>
                  <th className="p-3.5 font-bold">패트리온 (P사)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">플랫폼 수수료율</td>
                  <td className="p-3.5 font-black text-[#E4092B] bg-rose-50/40">10.0% (투네이션 표준)</td>
                  <td className="p-3.5 text-slate-600">20% ~ 40% (일반 40%)</td>
                  <td className="p-3.5 text-slate-600">30% 고정</td>
                  <td className="p-3.5 text-slate-600">16% ~ 22% (환전수수료 별도)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">방송 장비(OBS) 요구</td>
                  <td className="p-3.5 font-black text-[#E4092B] bg-rose-50/40">불필요 (모바일 링크 1개)</td>
                  <td className="p-3.5 text-slate-600">필수 (고성능 PC/캠)</td>
                  <td className="p-3.5 text-slate-600">앱 개발 필수</td>
                  <td className="p-3.5 text-slate-600">불필요</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">정산 주기</td>
                  <td className="p-3.5 font-black text-[#E4092B] bg-rose-50/40">신청 즉시 익일 입금</td>
                  <td className="p-3.5 text-slate-600">익월 말일</td>
                  <td className="p-3.5 text-slate-600">익월 또는 격월</td>
                  <td className="p-3.5 text-slate-600">월 1회 페이팔 인출</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">세무 지원</td>
                  <td className="p-3.5 font-black text-[#E4092B] bg-rose-50/40">3.3% 원천징수 국세청 대납</td>
                  <td className="p-3.5 text-slate-600">3.3% 원천징수</td>
                  <td className="p-3.5 text-slate-600">직접 해외소득 신고</td>
                  <td className="p-3.5 text-slate-600">미국 W-8BEN 세무 직접 작성</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
