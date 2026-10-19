import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, User, Flame, Calculator, HelpCircle, ArrowRight, Menu, X, 
  PlusCircle, LogIn, LogOut, ChevronDown, ChevronRight, Wallet, Ticket, 
  ShieldCheck, Copy, Check, MessageCircle, Sun, Moon, Crown 
} from 'lucide-react';

export function ToonNavbar({ 
  currentPage, 
  onNavigate, 
  onOpenCreatorDemo, 
  onOpenStudio, 
  currentUser, 
  onOpenAuth, 
  onOpenMyPage, 
  onOpenCharge,
  onOpenMessenger,
  onOpenAdmin,
  onLogout,
  theme = 'dark',
  onToggleTheme 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const dropdownRef = useRef(null);

  const [isScrolled, setIsScrolled] = useState(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position for transparent navbar over hero video
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (pageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyCreatorLink = () => {
    if (currentUser?.handle) {
      navigator.clipboard.writeText(`https://mimibit.me/@${currentUser.handle}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isHome = currentPage === 'home';
  const isTransparent = isHome && !isScrolled;
  const isLoggedIn = Boolean(currentUser && (currentUser.isLoggedIn !== false) && (currentUser.id || currentUser.email || currentUser.name));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#06080D]/85 backdrop-blur-xl border-b border-white/10 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">

        {/* Brand Logo & Nav */}
        <div className="flex items-center gap-8">
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <img 
              src="/logo.png" 
              alt="MIMIBIT" 
              className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-all brightness-110" 
            />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-bold text-slate-300">
            <button 
              onClick={() => handleNavClick('creators')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer ${
                currentPage === 'creators' ? 'text-white' : ''
              }`}
            >
              인기 크리에이터
              {currentPage === 'creators' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('bio')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer flex items-center gap-1.5 ${
                currentPage === 'bio' ? 'text-white' : ''
              }`}
            >
              <span>바이오링크 홈</span>
              <span className="text-[9px] bg-rose-500/20 text-[#FF4D6D] border border-rose-500/30 px-1.5 py-0.2 rounded-full font-bold">
                LIVE
              </span>
              {currentPage === 'bio' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('features')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer ${
                currentPage === 'features' ? 'text-white' : ''
              }`}
            >
              후원 콘텐츠
              {currentPage === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('fees')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer ${
                currentPage === 'fees' ? 'text-white' : ''
              }`}
            >
              수수료 & 정산
              {currentPage === 'fees' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('about')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer ${
                currentPage === 'about' ? 'text-white' : ''
              }`}
            >
              미미빗 소개
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
            <button 
              onClick={() => handleNavClick('faq')} 
              className={`hover:text-white transition-colors py-2 relative cursor-pointer ${
                currentPage === 'faq' ? 'text-white' : ''
              }`}
            >
              이용 가이드
              {currentPage === 'faq' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B] rounded-full shadow-[0_0_8px_#E4092B]"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Right CTA / Auth Status */}
        <div className="hidden sm:flex items-center gap-3">

          {/* CASE 1: LOGGED IN USER */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              {/* Supporter Carrot Charge Pill Button */}
              {/* Carrot Charge & Secret Messenger Pill Buttons */}
              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-heading font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer ring-2 ring-amber-300/60"
                  title="통합 관리자 콘솔"
                >
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                  <span>관리자 콘솔</span>
                </button>
              )}

              <button
                type="button"
                onClick={onOpenCharge}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-[#FFE0E5] text-[#E4092B] border border-slate-200/80 font-heading font-black text-xs transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                <span>당근 충전</span>
              </button>

              <button
                type="button"
                onClick={onOpenMessenger}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-black text-white font-medium text-xs transition-all shadow-xs active:scale-95 cursor-pointer relative"
                title="1:1 시크릿톡 열기"
              >
                <MessageCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>시크릿톡</span>
                <span className="w-2 h-2 rounded-full bg-[#E4092B] absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-full bg-white hover:bg-slate-50 border-2 border-slate-200/80 hover:border-[#E4092B] transition-all cursor-pointer shadow-xs"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200/80"
                  />
                  <div className="text-left text-xs">
                    <div className="font-heading font-black text-[#140E10] flex items-center gap-1">
                      <span className="truncate max-w-[90px]">{currentUser.name}</span>
                      {currentUser.role === 'admin' && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold">ROOT</span>
                      )}
                    </div>
                    <div className="text-[10px] font-bold text-[#E4092B] font-num">
                      {currentUser.role === 'admin'
                        ? '슈퍼 관리자'
                        : currentUser.role === 'creator'
                        ? `정산 ${Math.round(currentUser.settlementPending / 10000)}만`
                        : `${currentUser.carrotsBalance.toLocaleString()} 당근`}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A696E]" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border-2 border-slate-200/80 shadow-xl py-2 z-50 text-xs animate-fade-in divide-y divide-slate-100">
                    {/* User Profile Header */}
                    <div className="p-3 bg-slate-50 flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          currentUser.role === 'admin' 
                            ? 'text-amber-800 bg-amber-100'
                            : currentUser.role === 'creator'
                            ? 'text-rose-800 bg-rose-100'
                            : 'text-[#E4092B] bg-rose-50'
                        }`}>
                          {currentUser.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : currentUser.role === 'creator' ? 'CREATOR ACCOUNT' : 'SUPPORTER ACCOUNT'}
                        </span>
                        <div className="font-heading font-black text-sm text-[#140E10] mt-1 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-[#7A696E] truncate">{currentUser.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setUserDropdownOpen(false); onOpenMyPage('profile'); }}
                        className="px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-[#E4092B] text-[10px] font-bold shadow-2xs cursor-pointer shrink-0 ml-2"
                        title="프로필 편집"
                      >
                        수정
                      </button>
                    </div>

                    {/* Admin Direct Button in dropdown */}
                    {currentUser.role === 'admin' && (
                      <div className="p-2 bg-amber-500/10">
                        <button
                          onClick={() => { setUserDropdownOpen(false); onOpenAdmin?.(); }}
                          className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs flex items-center justify-between cursor-pointer shadow-xs transition-all"
                        >
                          <span className="flex items-center gap-1.5">
                            <Crown className="w-4 h-4 fill-slate-950" />
                            <span>통합 관리자 콘솔 열기</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Admin & Creator: Studio Direct Access */}
                    {(currentUser.role === 'creator' || currentUser.role === 'admin') && (
                      <div className="py-1">
                        <button
                          onClick={() => { setUserDropdownOpen(false); onOpenStudio(); }}
                          className="w-full px-4 py-2 text-left hover:bg-rose-50 font-black text-[#E4092B] flex items-center justify-between cursor-pointer"
                        >
                          <span>{currentUser.role === 'admin' ? '크리에이터 스튜디오 (root 마스터)' : '내 크리에이터 스튜디오 열기'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {currentUser.handle && (
                          <button
                            onClick={handleCopyCreatorLink}
                            className="w-full px-4 py-2 text-left hover:bg-slate-50 font-bold text-[#140E10] flex items-center justify-between cursor-pointer"
                          >
                            <span>내 링크 복사 ({currentUser.handle})</span>
                            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#E4092B]" /> : <Copy className="w-3.5 h-3.5 text-[#7A696E]" />}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Common Options: Profile Setting, Charge, Secret Talk, Wallet */}
                    <div className="py-1">
                      <button
                        onClick={() => { setUserDropdownOpen(false); onOpenMyPage('profile'); }}
                        className="w-full px-4 py-2.5 text-left hover:bg-rose-50 font-black text-slate-800 hover:text-[#E4092B] flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4 text-[#E4092B]" />
                          <span className="text-xs">내 프로필 설정 (닉네임/사진)</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onOpenMessenger(); }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 font-bold text-slate-800 flex items-center justify-between cursor-pointer transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-[#E4092B]" />
                          <span className="text-xs">1:1 시크릿톡 라운지</span>
                          <span className="text-[9px] bg-rose-50 text-[#E4092B] border border-rose-100 px-1.5 py-0.2 rounded-full font-bold">VIP</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onOpenCharge(); }}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 font-black text-[#E4092B] flex items-center justify-between cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>당근 충전하기</span>
                          <span className="text-[9px] bg-[#E4092B] text-white px-1.5 py-0.2 rounded-full font-bold">+보너스</span>
                        </span>
                        <PlusCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => { setUserDropdownOpen(false); onOpenMyPage('sponsorships'); }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 font-bold text-[#140E10] flex items-center justify-between cursor-pointer"
                      >
                        <span>내 팬덤 지갑 & 영수증</span>
                        <Wallet className="w-3.5 h-3.5 text-[#7A696E]" />
                      </button>

                    </div>

                    {/* Logout */}
                    <div className="pt-1">
                      <button
                        onClick={() => { setUserDropdownOpen(false); onLogout(); }}
                        className="w-full px-4 py-2 text-left text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  </div>
              )}
              </div>
            </div>
          ) : (
            /* CASE 2: LOGGED OUT - SHOW LOGIN / SIGNUP */
            <>
              <button
                type="button"
                onClick={onOpenAuth}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isHome
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md'
                    : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-[#E4092B] border border-slate-200/80 shadow-2xs'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-[#E4092B]" />
                <span>로그인</span>
              </button>

              <button
                onClick={() => handleNavClick('onboarding')}
                className="px-5 py-2.5 rounded-full bg-[#E4092B] hover:bg-[#CC0022] text-white text-xs font-black shadow-md shadow-[#E4092B]/25 hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>내 링크 만들기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Light / Dark Mode Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20 text-amber-400 border border-white/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300/80'
            }`}
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="화면 모드 전환"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Header Buttons (Right) */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Light / Dark Mode Toggle Button (Mobile) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-all flex items-center justify-center cursor-pointer ${
              theme === 'dark'
                ? 'bg-white/10 text-amber-400 border border-white/20'
                : 'bg-slate-100 text-slate-700 border border-slate-300'
            }`}
            title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
            aria-label="화면 모드 전환"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {isLoggedIn ? (
            <button
              onClick={currentUser.role === 'creator' ? onOpenStudio : onOpenMyPage}
              className="px-3 py-1.5 rounded-full bg-rose-50 text-[#E4092B] text-xs font-black border border-slate-200/80"
            >
              {currentUser.role === 'creator' ? '스튜디오' : '마이페이지'}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-full bg-[#E4092B] text-white text-xs font-black"
            >
              로그인
            </button>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-[#E4092B] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200/80 px-6 py-4 space-y-3 font-extrabold text-sm text-[#140E10] shadow-lg animate-fade-in">
          {isLoggedIn && (
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <div className="font-heading font-black text-xs text-[#140E10]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#E4092B]">
                    {currentUser.role === 'creator' ? '🎨 크리에이터' : `🥕 ${currentUser.carrotsBalance.toLocaleString()} 당근`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                className="text-xs text-rose-600 font-bold"
              >
                로그아웃
              </button>
            </div>
          )}

          <button 
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'home' ? 'text-[#E4092B]' : ''}`}
          >
            홈 (랜딩)
          </button>
          <button 
            onClick={() => handleNavClick('creators')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'creators' ? 'text-[#E4092B]' : ''}`}
          >
            인기 크리에이터 탐색
          </button>
          <button 
            onClick={() => handleNavClick('bio')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] font-bold text-[#E4092B] ${currentPage === 'bio' ? 'text-[#E4092B]' : ''}`}
          >
            크리에이터 바이오링크 (LIVE)
          </button>
          <button 
            onClick={() => handleNavClick('features')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'features' ? 'text-[#E4092B]' : ''}`}
          >
            후원 콘텐츠 & 티어 안내
          </button>
          <button 
            onClick={() => handleNavClick('fees')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'fees' ? 'text-[#E4092B]' : ''}`}
          >
            수수료 & 정산 가이드
          </button>
          <button 
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'about' ? 'text-[#E4092B]' : ''}`}
          >
            미미빗 브랜드 소개
          </button>
          <button 
            onClick={() => handleNavClick('faq')}
            className={`block w-full text-left py-2 hover:text-[#E4092B] ${currentPage === 'faq' ? 'text-[#E4092B]' : ''}`}
          >
            이용 가이드 & FAQ
          </button>

          <div className="pt-2 border-t border-slate-200/80 flex flex-col gap-2">
            {!isLoggedIn ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 rounded-xl bg-[#E4092B] text-white font-black text-center text-xs"
              >
                카카오 / 구글 3초 로그인
              </button>
            ) : currentUser.role === 'admin' ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('profile'); }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-900 border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <User className="w-4 h-4 text-[#E4092B]" />
                  <span>내 프로필 설정 (닉네임/사진)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdmin?.(); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-center text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>통합 관리자 콘솔 열기</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenStudio(); }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-center text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>크리에이터 스튜디오 (root 마스터)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMessenger(); }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-[#E4092B] border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-rose-500" />
                  <span>1:1 시크릿톡 VIP 라운지</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenCharge(); }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-[#E4092B] border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>당근 충전소 (+보너스)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('sponsorships'); }}
                  className="w-full py-2.5 rounded-xl bg-[#E4092B] text-white font-black text-center text-xs cursor-pointer"
                >
                  <span>내 팬덤 지갑 & 마이페이지</span>
                </button>
              </>
            ) : currentUser.role === 'creator' ? (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('profile'); }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-900 border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <User className="w-4 h-4 text-[#E4092B]" />
                  <span>내 프로필 설정 (닉네임/사진)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenStudio(); }}
                  className="w-full py-2.5 rounded-xl bg-[#E4092B] text-white font-black text-center text-xs cursor-pointer"
                >
                  <span>내 크리에이터 스튜디오</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('sponsorships'); }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-black text-center text-xs cursor-pointer"
                >
                  <span>내 지갑 & 마이페이지</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('profile'); }}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-900 border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <User className="w-4 h-4 text-[#E4092B]" />
                  <span>내 프로필 설정 (닉네임/사진)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMessenger(); }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-center text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-rose-400" />
                  <span>1:1 시크릿톡 라운지 (VIP)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenCharge(); }}
                  className="w-full py-2.5 rounded-xl bg-rose-50 text-[#E4092B] border border-slate-200/80 font-black text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <span>당근 충전소 (+보너스)</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenMyPage('sponsorships'); }}
                  className="w-full py-2.5 rounded-xl bg-[#E4092B] text-white font-black text-center text-xs"
                >
                  <span>내 팬덤 지갑 & 마이페이지</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
