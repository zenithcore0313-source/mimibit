import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export function ToonFeeCalculator({ onOpenStudio }) {
  const [donationCount, setDonationCount] = useState(120); // 월 120건
  const [avgPrice, setAvgPrice] = useState(15000); // 건당 15,000원

  const monthlyGross = donationCount * avgPrice; // 총 후원 모집액
  const mimibitFee = Math.round(monthlyGross * 0.10); // 투네이션 표준 10.0%
  const taxWithholding = Math.round(monthlyGross * 0.033); // 국세청 3.3% 원천징수
  const netCashPayout = monthlyGross - mimibitFee - taxWithholding; // 실수령액 (86.7%)

  // Competitor comparisons
  const inAppFee = Math.round(monthlyGross * 0.30); // 앱스토어 30%
  const inAppSaved = inAppFee - mimibitFee; // 절약액

  return (
    <section id="calculator" className="py-20 sm:py-28 bg-white border-b border-slate-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60 inline-block mb-3">
            TRANSPARENT PRICING
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            내 통장에 입금되는 예상 정산금
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3 font-normal leading-relaxed">
            충전단에서 PG 결제 원가(VAT)를 상쇄하고, 출금 시 <strong>플랫폼 이용료 단 10.0%</strong>만 부과하는 투네이션 표준 모델입니다.
          </p>
        </div>

        {/* Calculator Main Box (Toss-style clean card) */}
        <div className="bg-[#FAFAFB] border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Input Sliders (6 cols) */}
            <div className="lg:col-span-6 space-y-7">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-900">
                    월간 예상 후원 건수
                  </label>
                  <span className="font-heading font-black text-base sm:text-lg text-[#E4092B] font-num">
                    {donationCount}건
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={donationCount}
                  onChange={(e) => setDonationCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E4092B]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>20건</span>
                  <span>250건</span>
                  <span>500건</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs sm:text-sm font-bold text-slate-900">
                    건당 평균 후원 금액
                  </label>
                  <span className="font-heading font-black text-base sm:text-lg text-[#E4092B] font-num">
                    {avgPrice.toLocaleString()}원
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="2500"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#E4092B]"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>5,000원</span>
                  <span>25,000원</span>
                  <span>50,000원</span>
                </div>
              </div>

              {/* Competitive savings banner */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">앱스토어(30%) 대비 아끼는 수수료</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 font-num">
                    매월 +{inAppSaved.toLocaleString()}원 절감
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  20%p 이득
                </span>
              </div>
            </div>

            {/* Right: Net Settlement Calculation Card (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">월 예상 통장 실수령액 (86.7%)</span>
                <div className="font-heading font-black text-3xl sm:text-4xl text-slate-900 font-num mt-1 tracking-tight">
                  {netCashPayout.toLocaleString()}원
                </div>
                <span className="text-xs text-slate-500 mt-1 block">
                  총 후원 모집액 {monthlyGross.toLocaleString()}원 기준
                </span>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center text-slate-600">
                  <span>총 후원 모집액 (Gross)</span>
                  <strong className="text-slate-900 font-num">{monthlyGross.toLocaleString()}원</strong>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>미미빗 플랫폼 이용료 (10.0%)</span>
                  <span className="font-num text-[#E4092B]">-{mimibitFee.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>국세청 사업소득 원천징수 (3.3%)</span>
                  <span className="font-num text-slate-600">-{taxWithholding.toLocaleString()}원</span>
                </div>
                <div className="pt-2.5 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900">
                  <span>익일 입금액 (순지급률 86.7%)</span>
                  <span className="text-base text-[#E4092B] font-num">{netCashPayout.toLocaleString()}원</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-500 space-y-1">
                <p>• 사업자등록증이 있는 경우 10% 세금계산서 발행 시 90.0% 전액 지급됩니다.</p>
                <p>• 원천징수 3.3%는 매년 5월 종합소득세 신고 시 환급 대상에 포함됩니다.</p>
              </div>

              <button
                type="button"
                onClick={onOpenStudio}
                className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <span>정산 스튜디오 관리자 둘러보기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
