import React, { useState } from 'react';
import { Copy, Check, Heart, Sparkles, Target, Share2, ExternalLink, BadgeCheck } from 'lucide-react';

export function CreatorHeader({ creator, onOpenDonate, onOpenTiers }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mimibit.me/${creator.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fundingPercent = Math.min(
    100,
    Math.round((creator.fundingGoal.currentCarrots / creator.fundingGoal.targetCarrots) * 100)
  );

  return (
    <div className="card-pop-3d rounded-3xl overflow-hidden mb-6 relative">
      {/* Visual Cover Banner with Pop Vibe */}
      <div className="h-44 sm:h-56 relative overflow-hidden bg-gradient-to-r from-[#E4092B] via-[#FA1A3C] to-[#9A101D]">
        <img
          src={creator.coverImage}
          alt="Cover"
          className="w-full h-full object-cover mix-blend-overlay opacity-90 scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

        {/* Decorative Floating Emojis */}
        <span className="absolute top-4 left-4 text-2xl filter drop-shadow animate-bounce">
          🎀
        </span>
        <span className="absolute top-10 right-28 text-xl filter drop-shadow opacity-90 hidden sm:block">
          ✨
        </span>

        {/* Share Link Pill Button */}
        <button
          onClick={handleCopyLink}
          className="absolute top-3.5 right-3.5 bg-white/90 hover:bg-white text-[#1C1215] backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-600">프로필 링크 복사됨!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#E4092B]" />
              <span className="font-outfit font-bold">mimibit.me/{creator.handle}</span>
            </>
          )}
        </button>

        {/* Follower Stats Floating Tag on Banner */}
        <div className="absolute bottom-3 right-4 bg-black/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 hidden sm:flex items-center gap-2">
          <span>팔로워 <strong className="text-[#FCD5DC]">{creator.followerCount}</strong></span>
          <span>·</span>
          <span>게시물 <strong className="text-[#FCD5DC]">{creator.postCount}</strong></span>
        </div>
      </div>

      {/* Profile Details Container */}
      <div className="px-5 sm:px-7 pb-6 pt-0 relative bg-white">
        {/* Avatar & Header Action Buttons */}
        <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-4">
          <div className="relative group">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 bg-white shadow-xl relative border-2 border-[#FCD5DC]">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute -bottom-1 -right-1 text-2xl filter drop-shadow-md">
                🐰
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onOpenTiers}
              className="btn-pop-secondary px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E4092B]" />
              <span className="hidden sm:inline">등급 혜택</span>
              <span className="sm:hidden">티어 혜택</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="btn-pop-primary px-5 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>당근 후원하기</span>
            </button>
          </div>
        </div>

        {/* Name and Creator Badges */}
        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bubble font-black text-[#1C1215] tracking-tight">
              {creator.name}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#E4092B] text-white shadow-xs">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>공식 크리에이터</span>
            </span>
          </div>
          <p className="text-xs text-[#6B5E62] font-bold mt-0.5">
            {creator.handle} · 일러스트레이터 & 서브컬처 코스어
          </p>
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-[#33354A] leading-relaxed mb-4 font-medium">
          {creator.bio}
        </p>

        {/* Social Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {creator.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF0F2] text-[#E4092B] border border-[#FCD5DC]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Goal Funding Interactive Widget */}
        <div className="bg-gradient-to-r from-[#FFF0F2] via-[#FFF5F6] to-[#FFF9E6] border-2 border-[#FCD5DC] rounded-3xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2 font-black text-[#E4092B]">
              <Target className="w-4 h-4 text-[#E4092B]" />
              <span className="text-xs sm:text-sm">{creator.fundingGoal.title}</span>
            </div>
            <span className="font-bubble font-black text-[#E4092B] text-base">
              {fundingPercent}% 달성
            </span>
          </div>

          {/* Animated Goal Progress Bar */}
          <div className="w-full h-4 bg-white rounded-full overflow-hidden p-0.5 border border-[#FCD5DC] relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#E4092B] via-[#FA1A3C] to-[#FFB703] rounded-full transition-all duration-1000 relative shine-box"
              style={{ width: `${fundingPercent}%` }}
            >
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex justify-between items-center text-xs text-[#6B5E62] mt-2.5 font-bold">
            <span className="flex items-center gap-1 text-[#1C1215]">
              <span>🥕 모인 당근:</span>
              <strong className="text-[#E4092B] font-black text-sm">
                {creator.fundingGoal.currentCarrots.toLocaleString()}개
              </strong>
              <span>({(creator.fundingGoal.currentCarrots * 100).toLocaleString()}원)</span>
            </span>
            <span className="text-[11px] text-[#6B5E62]">
              목표 {creator.fundingGoal.targetCarrots.toLocaleString()}🥕 (마감: {creator.fundingGoal.endDate})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
