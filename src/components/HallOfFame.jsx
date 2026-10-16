import React from 'react';
import { Trophy, Crown, Flame, Sparkles, Clock, ArrowUpRight, ShieldCheck, Zap, Medal } from 'lucide-react';

export function HallOfFame({ rankings, onOpenDonate, onSelectSupporter }) {
  const top1 = rankings[0];
  const top2 = rankings[1];
  const top3 = rankings[2];
  const restRankings = rankings.slice(3, 5);

  return (
    <div className="card-pop-3d rounded-3xl p-5 sm:p-6 mb-6 relative overflow-hidden bg-white">
      {/* Header with Game Trophy Icon */}
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b-2 border-[#FCE7EC]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFB703] to-[#FF7A00] text-white flex items-center justify-center font-black shadow-md shadow-[#FFB703]/30">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bubble font-black text-[#1D1E2C] tracking-tight">
                Hall of Fame : Top 5 명예의 전당
              </h2>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FF2E63] text-white flex items-center gap-1 shadow-xs animate-pulse">
                <span>🔥</span> 실시간 랭킹전
              </span>
            </div>
            <p className="text-xs text-[#64748B] font-medium">
              모든 팬에게 프로필 최상단에 공개되는 10월 명예의 전당입니다
            </p>
          </div>
        </div>

        {/* Season countdown pill */}
        <div className="text-right hidden sm:block">
          <div className="inline-flex items-center gap-1.5 bg-[#FFF0F4] text-[#FF2E63] px-3 py-1 rounded-full text-xs font-black border border-[#FFCCD5]">
            <Clock className="w-3.5 h-3.5" />
            <span>시즌 마감 D-17</span>
          </div>
          <span className="text-[10px] text-[#94A3B8] block mt-0.5 font-bold">
            매월 1일 00:00 순위 리셋
          </span>
        </div>
      </div>

      {/* Podium Grid (Top 1, 2, 3 Visual Showcase) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5 items-end">
        {/* 2nd Place Card (Silver) */}
        {top2 && (
          <div className="order-2 md:order-1 p-4 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#EDF2F7] border-2 border-[#CBD5E1] text-center shadow-xs hover:scale-[1.02] transition-all relative">
            <div className="w-7 h-7 mx-auto -mt-7 mb-1 bg-[#94A3B8] text-white rounded-full font-black text-xs flex items-center justify-center shadow-md">
              2
            </div>
            <img
              src={top2.avatar}
              alt={top2.nickname}
              className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-[#CBD5E1] shadow-xs"
            />
            <div className="mt-2">
              <span className="text-[10px] font-bold text-[#64748B] bg-white px-2 py-0.5 rounded-full border border-[#CBD5E1]">
                🥈 {top2.badge}
              </span>
              <h4 className="text-sm font-black text-[#1D1E2C] mt-1 truncate">
                {top2.nickname}
              </h4>
              <p className="text-xs font-black text-[#FF7A00] font-outfit mt-0.5">
                {top2.carrots.toLocaleString()} 🥕
              </p>
            </div>
          </div>
        )}

        {/* 1st Place Hero Card (Gold Champion - Center & Taller) */}
        {top1 && (
          <div className="order-1 md:order-2 p-5 rounded-3xl bg-gradient-to-b from-[#FFFDF0] via-[#FFF8D6] to-[#FFEAB5] border-3 border-[#FFB703] shadow-lg shadow-[#FFB703]/25 text-center relative shine-box hover:scale-[1.02] transition-all">
            {/* Crown Ribbon */}
            <div className="w-10 h-10 mx-auto -mt-9 mb-1 bg-gradient-to-r from-[#FFB703] to-[#FF8C00] text-white rounded-full font-black text-sm flex items-center justify-center shadow-md border-2 border-white animate-bounce">
              <Crown className="w-5 h-5 fill-white" />
            </div>

            <div className="relative inline-block mx-auto">
              <img
                src={top1.avatar}
                alt={top1.nickname}
                className="w-18 h-18 rounded-full object-cover border-3 border-[#FFB703] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-[#FF2E63] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                👑 1위
              </span>
            </div>

            <div className="mt-2">
              <span className="text-[11px] font-black text-[#78350F] bg-[#FDE68A] px-2.5 py-0.5 rounded-full inline-block">
                {top1.badge}
              </span>
              <h3 className="text-base font-bubble font-black text-[#78350F] mt-1">
                {top1.nickname}
              </h3>
              <p className="text-sm font-black text-[#B45309] font-outfit">
                총 {top1.carrots.toLocaleString()} 당근 후원 🥕
              </p>
            </div>

            {/* Pinned Billboard Speech Bubble */}
            <div className="mt-3 bg-white/95 rounded-2xl p-2.5 border border-[#FDE68A] shadow-xs text-left">
              <span className="text-[10px] font-black text-[#B45309] block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FFB703]" />
                루나의 프로필 최상단 고정 한마디:
              </span>
              <p className="text-xs text-[#78350F] font-semibold italic mt-0.5 truncate">
                "{top1.message || '루나님 항상 최고예요!'}"
              </p>
            </div>

            {/* Challenge 1st Place Button */}
            <button
              onClick={() => onOpenDonate(top1.carrots + 50)}
              className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-[#FF2E63] to-[#FF7A00] text-white text-xs font-black shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>1위 전광판 탈환하기 ({top1.carrots + 50}🥕)</span>
            </button>
          </div>
        )}

        {/* 3rd Place Card (Bronze) */}
        {top3 && (
          <div className="order-3 p-4 rounded-2xl bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] border-2 border-[#FED7AA] text-center shadow-xs hover:scale-[1.02] transition-all relative">
            <div className="w-7 h-7 mx-auto -mt-7 mb-1 bg-[#D97706] text-white rounded-full font-black text-xs flex items-center justify-center shadow-md">
              3
            </div>
            <img
              src={top3.avatar}
              alt={top3.nickname}
              className="w-14 h-14 rounded-full mx-auto object-cover border-2 border-[#FED7AA] shadow-xs"
            />
            <div className="mt-2">
              <span className="text-[10px] font-bold text-[#9A3412] bg-white px-2 py-0.5 rounded-full border border-[#FED7AA]">
                🥉 {top3.badge}
              </span>
              <h4 className="text-sm font-black text-[#1D1E2C] mt-1 truncate">
                {top3.nickname}
              </h4>
              <p className="text-xs font-black text-[#FF7A00] font-outfit mt-0.5">
                {top3.carrots.toLocaleString()} 🥕
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rankings 4th & 5th Supporters Row */}
      <div className="space-y-2 mb-4">
        {restRankings.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-[#FAFAFC] hover:bg-[#FFF5F7] border border-[#FCE7EC] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-200 text-[#475569] font-black text-xs flex items-center justify-center font-outfit">
                {item.rank}
              </div>

              <img
                src={item.avatar}
                alt={item.nickname}
                className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
              />

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#1D1E2C] group-hover:text-[#FF2E63] transition-colors">
                    {item.nickname}
                  </span>
                  <span className="text-[10px] font-bold text-[#64748B]">
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] truncate max-w-[200px] sm:max-w-md">
                  {item.message}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-sm font-black text-[#FF2E63] font-outfit">
                {item.carrots.toLocaleString()} 🥕
              </span>
              <span className="text-[10px] text-[#94A3B8] block font-bold">
                {(item.carrots * 100).toLocaleString()}원
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gamification Booster Banner */}
      <div className="p-3 bg-gradient-to-r from-[#FFF0F4] to-[#FFF9E6] rounded-2xl border border-[#FFCCD5] flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-bold text-[#FF2E63]">
          <ShieldCheck className="w-4 h-4 text-[#00B4D8]" />
          <span>익명 토끼 프로필로 부담 없이 랭킹전에 참여하세요</span>
        </span>
        <button
          onClick={() => onOpenDonate()}
          className="font-black text-[#FF2E63] hover:underline flex items-center gap-1"
        >
          <span>내 순위 올리기</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
