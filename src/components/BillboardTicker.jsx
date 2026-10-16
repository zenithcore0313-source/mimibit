import React from 'react';
import { Crown, Sparkles, Megaphone, Flame, Zap } from 'lucide-react';

export function BillboardTicker({ topSupporter, onOpenDonate }) {
  if (!topSupporter) return null;

  return (
    <div className="w-full bg-[#181116] border-b-2 border-[#FFB703]/50 text-white py-2.5 px-4 shadow-lg relative overflow-hidden billboard-grid">
      {/* Neon glowing aura in background */}
      <div className="absolute -left-10 top-0 w-44 h-full bg-[#FF2E63]/30 blur-2xl pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-44 h-full bg-[#FFB703]/30 blur-2xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs relative z-10">
        {/* Neon Crown Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#FFB703] to-[#FFA000] text-[#1D1E2C] px-2.5 py-0.5 rounded-full font-black text-[11px] shadow-md shadow-[#FFB703]/40 animate-pulse">
            <Crown className="w-3.5 h-3.5 fill-[#1D1E2C]" />
            <span className="tracking-tighter">실시간 1위 전광판</span>
          </div>
          
          <div className="flex items-center gap-1.5 font-black text-[#FFD700] text-gold-shadow">
            <span className="text-sm">👑</span>
            <span className="underline decoration-wavy decoration-[#FF2E63]">{topSupporter.nickname}</span>
            <span className="text-[11px] font-bold text-white/80 bg-white/10 px-1.5 py-0.2 rounded-md">
              {topSupporter.carrots.toLocaleString()}🥕
            </span>
          </div>
        </div>

        {/* Center: Live Pinned Supporter Speech */}
        <div className="flex-1 overflow-hidden mx-3 hidden sm:flex items-center gap-2 bg-white/5 py-1 px-3 rounded-full border border-white/10">
          <Megaphone className="w-3.5 h-3.5 text-[#FF2E63] shrink-0 animate-bounce" />
          <p className="truncate text-white font-semibold text-xs tracking-tight italic">
            "{topSupporter.message || '루나님 이번 일러스트북 대박나세요! 언제나 응원해요🥕✨'}"
          </p>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onOpenDonate}
          className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-[#FF2E63] to-[#FF7A00] text-white px-3 py-1 rounded-full text-xs font-black shadow-md shadow-[#FF2E63]/30 hover:scale-105 active:scale-95 transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
          <span>1위 역전</span>
        </button>
      </div>

      {/* Mobile pinned comment view */}
      <div className="sm:hidden mt-1.5 pt-1 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-white/90">
        <Sparkles className="w-3.5 h-3.5 text-[#FFB703] shrink-0" />
        <p className="truncate italic font-medium">
          "{topSupporter.message || '루나님 언제나 응원해요!'}"
        </p>
      </div>
    </div>
  );
}
