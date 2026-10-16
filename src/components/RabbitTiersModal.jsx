import React from 'react';
import { X, CheckCircle, Sparkles, Lock, Unlock, Crown, ArrowRight } from 'lucide-react';
import { RABBIT_TIERS } from '../data/initialData';

export function RabbitTiersModal({ isOpen, onClose, userTierLevel, onSelectTierToDonate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#F3E8EC] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FFF0F4] via-[#FFF5F7] to-[#FFF9E6] border-b border-[#F3E8EC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl">
              🐰
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1D1E2C] tracking-tight">
                MIMIBIT 5단계 토끼 티어 시스템
              </h3>
              <p className="text-xs text-[#72748A]">
                후원 금액에 따라 특별한 팬덤 특권과 소통 권한이 해금됩니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#72748A] flex items-center justify-center transition-all shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Tier Cards */}
        <div className="p-6 overflow-y-auto space-y-3.5 custom-scrollbar">
          {RABBIT_TIERS.map((tier) => {
            const isUnlocked = userTierLevel >= tier.level;
            const isCurrent = userTierLevel === tier.level;

            return (
              <div
                key={tier.id}
                className={`p-4 rounded-2xl transition-all relative border ${
                  tier.highlight
                    ? 'bg-gradient-to-r from-[#FFF5F7] to-[#FFF9F0] border-[#FF2E63]/40 shadow-md shadow-[#FF2E63]/5'
                    : tier.isRoyal
                    ? 'bg-gradient-to-r from-[#FFFDF0] to-[#FFF9E6] border-[#FFB703] shadow-md shadow-[#FFB703]/10'
                    : 'bg-white border-[#F3E8EC] hover:border-[#FFCCD5]'
                }`}
              >
                {/* Highlight Badge */}
                {tier.highlight && (
                  <span className="absolute -top-2.5 right-4 bg-[#FF2E63] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    ★ 인기 해금 티어
                  </span>
                )}
                {tier.isRoyal && (
                  <span className="absolute -top-2.5 right-4 bg-[#FFB703] text-[#78350F] text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Crown className="w-3 h-3 fill-[#78350F]" /> 최고 존엄 티어
                  </span>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#F3E8EC] shadow-xs flex items-center justify-center text-2xl">
                      {tier.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-[#1D1E2C]">
                          {tier.name}
                        </h4>
                        <span className="text-[11px] font-bold text-[#72748A]">
                          {tier.carrots}🥕 (누적 {tier.threshold.toLocaleString()}원+)
                        </span>
                      </div>
                      <p className="text-xs text-[#72748A] mt-0.5">
                        {tier.description}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator / Action */}
                  <div className="shrink-0 text-right">
                    {isCurrent ? (
                      <span className="text-[11px] font-extrabold text-[#FF2E63] bg-[#FFE5EC] px-2.5 py-1 rounded-full">
                        내 현재 등급
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> 달성 완료
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onClose();
                          onSelectTierToDonate(tier.carrots);
                        }}
                        className="text-[11px] font-extrabold text-white bg-[#FF2E63] hover:bg-[#E81A50] px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1"
                      >
                        <span>해금하기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tier Perks list */}
                <div className="mt-3 pt-2.5 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {tier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[#33354A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E63]"></span>
                      <span className={perk.includes('★') ? 'font-black text-[#FF2E63]' : ''}>
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAFAFC] border-t border-[#F3E8EC] text-center text-xs text-[#72748A]">
          모든 등급은 해당 월 누적 당근 후원액 기준으로 산정되며 매월 1일 리셋됩니다.
        </div>
      </div>
    </div>
  );
}
