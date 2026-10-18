import React from 'react';
import { Sparkles, Heart, Smartphone, Monitor, MessageSquareHeart, UserCheck, Flame, ChevronRight } from 'lucide-react';

export function Navbar({ 
  activeTab, 
  setActiveTab, 
  userState, 
  onOpenDonate, 
  onOpenTiers,
  isPhoneFrame,
  setIsPhoneFrame
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-[#FCD5DC] shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        {/* Official MIMIBIT Logo Image */}
        <div 
          onClick={() => setActiveTab('profile')} 
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="h-10 sm:h-11 flex items-center">
            <img 
              src="/logo.png" 
              alt="MIMIBIT" 
              className="h-9 sm:h-10 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform" 
            />
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E4092B] text-white shadow-xs hidden sm:inline">
            D2C
          </span>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#FFF0F2] p-1 rounded-2xl border border-[#FCD5DC]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'profile'
                ? 'bg-[#E4092B] text-white shadow-sm'
                : 'text-[#6B5E62] hover:text-[#1C1215]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>크리에이터</span>
          </button>

          <button
            onClick={() => setActiveTab('secret')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'secret'
                ? 'bg-[#E4092B] text-white shadow-sm'
                : 'text-[#6B5E62] hover:text-[#1C1215]'
            }`}
          >
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1:1 시크릿</span>
            <span className="sm:hidden">시크릿</span>
            {userState.tierLevel >= 3 && (
              <span className="w-2 h-2 rounded-full bg-[#FFB703] animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'studio'
                ? 'bg-[#E4092B] text-white shadow-sm'
                : 'text-[#6B5E62] hover:text-[#1C1215]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>스튜디오</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
              activeTab === 'about'
                ? 'bg-[#E4092B] text-white shadow-sm'
                : 'text-[#6B5E62] hover:text-[#1C1215]'
            }`}
          >
            <span className="hidden md:inline">사업 계획서</span>
            <span className="md:hidden">IR</span>
          </button>
        </nav>

        {/* Right: Device View Switcher & Action CTA */}
        <div className="flex items-center gap-2">
          {/* Phone Mockup Frame Toggle */}
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAFC] hover:bg-[#FFF0F2] border border-[#FCD5DC] text-xs font-bold text-[#6B5E62] hover:text-[#E4092B] transition-all shadow-xs"
            title="인스타 인앱 모바일 화면으로 보기"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#E4092B]" />
                <span>와이드 뷰</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#E4092B]" />
                <span>모바일 뷰</span>
              </>
            )}
          </button>

          {/* User Tier Status Button */}
          <button
            onClick={onOpenTiers}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FFF5F6] to-[#FFF9E6] border border-[#FCD5DC] text-xs font-extrabold text-[#1C1215] hover:border-[#E4092B] transition-all shadow-xs"
          >
            <span className="text-sm">{userState.tierIcon}</span>
            <span className="text-[#E4092B]">{userState.tierName}</span>
          </button>

          {/* Pop Carrot Donation Button */}
          <button
            onClick={onOpenDonate}
            className="btn-pop-primary px-3.5 py-2 text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>당근 후원</span>
          </button>
        </div>
      </div>
    </header>
  );
}
