import React, { useState, useEffect } from 'react';
import { ToonNavbar } from './components/toonation/ToonNavbar';
import { ToonHero } from './components/toonation/ToonHero';
import { ToonCreatorShowcase } from './components/toonation/ToonCreatorShowcase';
import { ToonContentMarquee } from './components/toonation/ToonContentMarquee';
import { ToonFeeCalculator } from './components/toonation/ToonFeeCalculator';
import { ToonMobileFeatureSection } from './components/toonation/ToonMobileFeatureSection';
import { ToonFooter } from './components/toonation/ToonFooter';
import { FloatingMenu } from './components/toonation/FloatingMenu';

// Subpages
import { CreatorsPage } from './pages/CreatorsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FeesPage } from './pages/FeesPage';
import { AboutPage } from './pages/AboutPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { FaqPage } from './pages/FaqPage';
import { CreatorBioPage } from './pages/CreatorBioPage';

// Auth Components
import { AuthModal } from './components/auth/AuthModal';
import { MyPageModal } from './components/auth/MyPageModal';
import { ChargeModal } from './components/charge/ChargeModal';
import { KakaoSecretMessengerModal } from './components/KakaoSecretMessengerModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Creator & interactive feature components
import { BillboardTicker } from './components/BillboardTicker';
import { CreatorHeader } from './components/CreatorHeader';
import { HallOfFame } from './components/HallOfFame';
import { SecretMessenger } from './components/SecretMessenger';
import { GuestbookFeed } from './components/GuestbookFeed';
import { CreatorStudio } from './components/CreatorStudio';
import { RabbitTiersModal } from './components/RabbitTiersModal';
import { DonationModal } from './components/DonationModal';
import { ReceiptTicketModal } from './components/ReceiptTicketModal';

import { 
  INITIAL_CREATOR, 
  INITIAL_RANKINGS, 
  INITIAL_GUESTBOOK, 
  INITIAL_SECRET_MESSAGES, 
  INITIAL_CHAT_ROOMS,
  RABBIT_TIERS 
} from './data/initialData';
import { X, Smartphone, Monitor, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { getStoredCreators, findCreatorByIdOrHandle, registerNewCreator, processCreatorDonation, confirmTossPayment } from './services/api';

export function App() {
  // Page Routing State ('home', 'creators', 'features', 'fees', 'about', 'onboarding', 'faq', 'bio')
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const validPages = ['creators', 'features', 'fees', 'about', 'onboarding', 'faq', 'bio'];
    if (hash === 'bio' || hash.startsWith('@')) return 'bio';
    return validPages.includes(hash) ? hash : 'home';
  });
  const [selectedBioCreatorId, setSelectedBioCreatorId] = useState('luna_rabbit');

  // Modal / View Overlay states
  const [activeModal, setActiveModal] = useState(null); // null, 'creator', 'studio', 'secret'
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [myPageTab, setMyPageTab] = useState('sponsorships');
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleOpenMyPage = (tab = 'sponsorships') => {
    setMyPageTab(tab);
    setIsMyPageOpen(true);
  };

  // Multi-creator chat rooms (KakaoTalk style)
  const [chatRooms, setChatRooms] = useState(() => {
    const saved = localStorage.getItem('mimibit_chat_rooms');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_ROOMS;
  });

  // Authenticated User State (Restored reliably from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mimibit_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.id || parsed.email || parsed.name)) {
        return { ...parsed, isLoggedIn: true };
      }
    } catch (e) {
      console.warn('Failed to parse auth user from localStorage:', e);
    }
    return null;
  });

  // Transaction History (Carrots recharging & payments)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('mimibit_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // Theme state: defaults to user's system preference ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('mimibit_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark mode
  });

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mimibit_theme', theme);
  }, [theme]);

  // Listen to system theme changes if not manually overridden
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const saved = localStorage.getItem('mimibit_theme');
      if (!saved) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Selected Creator for profile view
  const [activeCreatorProfile, setActiveCreatorProfile] = useState(INITIAL_CREATOR);

  // Persisted state simulation
  const [creator, setCreator] = useState(() => {
    const saved = localStorage.getItem('mimibit_creator');
    return saved ? JSON.parse(saved) : INITIAL_CREATOR;
  });

  const [rankings, setRankings] = useState(() => {
    const saved = localStorage.getItem('mimibit_rankings');
    return saved ? JSON.parse(saved) : INITIAL_RANKINGS;
  });

  const [guestbook, setGuestbook] = useState(() => {
    const saved = localStorage.getItem('mimibit_guestbook');
    return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mimibit_messages');
    return saved ? JSON.parse(saved) : INITIAL_SECRET_MESSAGES;
  });

  // User state
  const [userState, setUserState] = useState(() => {
    const saved = localStorage.getItem('mimibit_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.nickname && parsed.nickname !== 'Alex G.') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      nickname: '익명의 서포터',
      tierId: 'white',
      tierLevel: 0,
      tierName: '새싹 서포터',
      tierIcon: '🌱',
      totalDonatedCarrots: 0,
      tickets: 0
    };
  });

  // Action Modals
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [presetCarrots, setPresetCarrots] = useState(null);
  const [isTiersOpen, setIsTiersOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [latestDonation, setLatestDonation] = useState(null);

  // Hash Navigation Sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (hash === 'admin') {
        setIsAdminOpen(true);
        return;
      }
      const validPages = ['creators', 'features', 'fees', 'about', 'onboarding', 'faq', 'bio'];
      if (hash === 'bio' || hash.startsWith('@') || hash.startsWith('bio?')) {
        const queryHandle = hash.replace(/^bio\/?(\?)?(creator=)?/, '').replace(/^@/, '');
        if (queryHandle) {
          const matched = findCreatorByIdOrHandle(queryHandle);
          if (matched) {
            setSelectedBioCreatorId(matched.id);
            setActiveCreatorProfile(matched);
          } else {
            setSelectedBioCreatorId(queryHandle);
          }
        } else {
          setSelectedBioCreatorId('luna_rabbit');
        }
        setCurrentPage('bio');
      } else {
        setCurrentPage(validPages.includes(hash) ? hash : 'home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial run on mount
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCreator = (c) => {
    if (c?.id) {
      setSelectedBioCreatorId(c.id);
      setActiveCreatorProfile(c);
      window.location.hash = `#/@${(c.handle || c.id).replace('@', '')}`;
      return;
    }
    if (c?.handle?.toLowerCase().includes('mochi') || c?.name?.includes('모치')) {
      setSelectedBioCreatorId('mochi_cos');
    } else if (c?.handle?.toLowerCase().includes('chibi') || c?.name?.includes('치비')) {
      setSelectedBioCreatorId('chibi_artist');
    } else if (c?.handle?.toLowerCase().includes('neon') || c?.name?.includes('네온')) {
      setSelectedBioCreatorId('neon_vibe');
    } else {
      setSelectedBioCreatorId('luna_rabbit');
    }
    handleNavigate('bio');
  };

  // Complete Onboarding Handler: Saves creator, updates user session, syncs to DB
  const handleCompleteOnboarding = async (formData) => {
    try {
      const created = await registerNewCreator(formData);
      const cleanHandle = (formData.handle || '').replace(/[@/]/g, '').trim();

      const updatedUser = {
        ...(currentUser || {}),
        id: currentUser?.id || `usr_${created.id || cleanHandle}`,
        name: formData.name,
        handle: `@${cleanHandle}`,
        email: currentUser?.email || `${cleanHandle.toLowerCase()}@mimibit.me`,
        role: 'creator',
        isLoggedIn: true,
        avatar: created.avatar || formData.avatar,
        bio: formData.bio,
        carrotsBalance: currentUser?.carrotsBalance || 0,
        settlementPending: 0
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('mimibit_auth_user', JSON.stringify(updatedUser));
      setSelectedBioCreatorId(created.id || cleanHandle);
      setActiveCreatorProfile(created);

      triggerToast(`🎉 @${cleanHandle} 님의 미미빗 바이오링크가 성공적으로 개설되었습니다!`);
    } catch (err) {
      console.error('Onboarding completion error:', err);
      triggerToast('바이오링크 개설 처리 중 오류가 발생했습니다.');
    }
  };

  // Creator Studio 1:1 Secret Talk reply handler
  const handleCreatorStudioReply = (roomId, replyText, attachVoice, attachPhoto) => {
    const creatorName = currentUser?.name || activeCreatorProfile?.name || creator?.name || '크리에이터';
    const newReply = {
      id: `msg_reply_${Date.now()}`,
      sender: creatorName,
      text: replyText,
      timestamp: '방금 전',
      isCreator: true,
      voiceNote: attachVoice ? {
        label: `${creatorName}의 1:1 보이스 답례 메모`,
        duration: '0:15'
      } : null,
      secretPhotoUrl: attachPhoto ? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' : null
    };

    setChatRooms(prev => prev.map(room => {
      const isMatch = roomId ? room.id === roomId : (room.id === 'room_luna' || room.creatorName?.includes(creatorName));
      if (isMatch) {
        return {
          ...room,
          lastUpdated: '방금 전',
          messages: [...room.messages, newReply]
        };
      }
      return room;
    }));

    triggerToast(`💌 ${creatorName}님의 1:1 시크릿톡 답장이 서포터에게 발송되었습니다!`);
  };

  // Toast Helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mimibit_creator', JSON.stringify(creator));
  }, [creator]);

  useEffect(() => {
    localStorage.setItem('mimibit_rankings', JSON.stringify(rankings));
  }, [rankings]);

  useEffect(() => {
    localStorage.setItem('mimibit_guestbook', JSON.stringify(guestbook));
  }, [guestbook]);

  useEffect(() => {
    localStorage.setItem('mimibit_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('mimibit_user', JSON.stringify(userState));
  }, [userState]);

  useEffect(() => {
    if (currentUser && (currentUser.id || currentUser.email)) {
      localStorage.setItem('mimibit_auth_user', JSON.stringify({ ...currentUser, isLoggedIn: true }));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mimibit_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mimibit_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  // Handle successful carrot recharge via PG simulator
  const handleChargeSuccess = (orderData) => {
    setTransactions(prev => [orderData, ...prev]);

    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        carrotsBalance: (prev.carrotsBalance || 0) + orderData.totalCarrots
      }));
    } else {
      // Auto-create active supporter profile so carrots are stored safely
      const guestSupporter = {
        id: `supporter_${Date.now()}`,
        name: '새싹 서포터',
        email: 'guest@mimibit.me',
        role: 'supporter',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        carrotsBalance: orderData.totalCarrots,
        tickets: 1,
        isLoggedIn: true,
        tier: { name: '브론즈 래빗', icon: '🥉' }
      };
      setCurrentUser(guestSupporter);
    }

    triggerToast(`+${orderData.totalCarrots.toLocaleString()} 🥕 당근 충전이 완료되었습니다! ✨`);
  };

  // Handle Toss Payments Redirect Success Callback
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || '';
      const queryFromHash = hash.includes('?') ? new URLSearchParams(hash.split('?')[1]) : null;
      
      const paymentKey = searchParams.get('paymentKey') || queryFromHash?.get('paymentKey');
      const orderId = searchParams.get('orderId') || queryFromHash?.get('orderId');
      const amount = searchParams.get('amount') || queryFromHash?.get('amount');

      if (paymentKey && orderId && amount) {
        const parsedAmount = parseInt(amount, 10);
        const estimatedCarrots = Math.round(parsedAmount / 1.1);
        confirmTossPayment({
          paymentKey,
          orderId,
          amount: parsedAmount,
          userId: currentUser?.id,
          carrots: estimatedCarrots,
          bonusCarrots: 0,
          method: '토스페이먼츠'
        }).then(record => {
          handleChargeSuccess({
            orderId,
            chargedCarrots: estimatedCarrots,
            bonusCarrots: 0,
            totalCarrots: estimatedCarrots,
            price: parsedAmount,
            paymentMethod: '토스페이먼츠'
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch(err => {
          console.warn('[Toss redirect confirm]', err);
        });
      }
    } catch (e) {
      console.warn('Failed to parse payment redirect:', e);
    }
  }, []);

  // Auth Handlers
  const handleLoginSuccess = (user, options = {}) => {
    const sessionUser = { ...user, isLoggedIn: true };
    setCurrentUser(sessionUser);
    localStorage.setItem('mimibit_auth_user', JSON.stringify(sessionUser));
    triggerToast(`${sessionUser.name || '회원'}님, 미미빗에 오신 것을 환영합니다! ✨`);
    if (sessionUser.role === 'supporter') {
      setUserState(prev => ({
        ...prev,
        nickname: sessionUser.name,
        tierName: sessionUser.tier?.name || prev.tierName,
        tierIcon: sessionUser.tier?.icon || prev.tierIcon
      }));
    }
    if (options.isNewUser) {
      setMyPageTab('profile');
      setIsMyPageOpen(true);
    }
  };

  const handleUpdateUser = (updatedData) => {
    const merged = { ...currentUser, ...updatedData };
    setCurrentUser(merged);
    localStorage.setItem('mimibit_auth_user', JSON.stringify(merged));
    setUserState(prev => ({
      ...prev,
      nickname: merged.name || prev.nickname
    }));
    triggerToast(`✨ ${merged.name}님의 프로필 정보가 업데이트되었습니다!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mimibit_auth_user');
    localStorage.removeItem('mimibit_auth_token');
    triggerToast('정상적으로 로그아웃되었습니다.');
  };

  // Handle new donation
  const handleCompleteDonation = (data) => {
    const newTotal = userState.totalDonatedCarrots + data.carrots;

    // Calculate updated tier
    let newTier = RABBIT_TIERS[0];
    for (let i = RABBIT_TIERS.length - 1; i >= 0; i--) {
      if (newTotal >= RABBIT_TIERS[i].carrots) {
        newTier = RABBIT_TIERS[i];
        break;
      }
    }

    const addedTickets = newTier.ticketCount > userState.tickets ? newTier.ticketCount : userState.tickets;

    const updatedUser = {
      ...userState,
      nickname: data.nickname,
      tierId: newTier.id,
      tierLevel: newTier.level,
      tierName: newTier.name,
      tierIcon: newTier.icon,
      totalDonatedCarrots: newTotal,
      tickets: addedTickets
    };
    setUserState(updatedUser);

    // If logged in supporter, update carrots balance
    if (currentUser && currentUser.role === 'supporter') {
      setCurrentUser(prev => ({
        ...prev,
        carrotsBalance: Math.max(0, prev.carrotsBalance - data.carrots),
        tickets: prev.tickets + addedTickets
      }));
    }

    // Persist donation to active creator and transaction ledger
    processCreatorDonation(selectedBioCreatorId, data);

    // Update creator funding goal
    setCreator((prev) => ({
      ...prev,
      fundingGoal: {
        ...prev.fundingGoal,
        currentCarrots: prev.fundingGoal.currentCarrots + data.carrots
      }
    }));

    // Update rankings
    const existingIndex = rankings.findIndex((r) => r.nickname === data.nickname);
    let updatedRankings = [...rankings];

    if (existingIndex >= 0) {
      updatedRankings[existingIndex].carrots += data.carrots;
      updatedRankings[existingIndex].message = data.message;
      updatedRankings[existingIndex].badge = `${newTier.icon} ${newTier.name}`;
      updatedRankings[existingIndex].tierId = newTier.id;
    } else {
      updatedRankings.push({
        id: `supporter_${Date.now()}`,
        rank: 99,
        nickname: data.nickname,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        carrots: newTotal,
        tierId: newTier.id,
        badge: `${newTier.icon} ${newTier.name}`,
        message: data.message,
        isTop1: false
      });
    }

    updatedRankings.sort((a, b) => b.carrots - a.carrots);
    updatedRankings = updatedRankings.slice(0, 5).map((item, idx) => ({
      ...item,
      rank: idx + 1,
      isTop1: idx === 0
    }));
    setRankings(updatedRankings);

    // Add to guestbook
    setGuestbook((prev) => [
      {
        id: Date.now(),
        nickname: data.nickname,
        tierId: newTier.id,
        carrots: data.carrots,
        content: data.message || `${data.carrots}당근을 선물하고 응원을 보냈습니다! 🥕`,
        createdAt: '방금 전',
        likes: 1
      },
      ...prev
    ]);

    setIsDonateOpen(false);
    setLatestDonation(data);
    setIsReceiptOpen(true);
  };

  const handleOpenDonate = (preset = null) => {
    setPresetCarrots(preset);
    setIsDonateOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 relative ${
      theme === 'dark' ? 'bg-[#06080D] text-white selection:bg-[#E4092B]/30 selection:text-white' : 'bg-[#F8F9FA] text-[#0F172A] selection:bg-[#E4092B]/20 selection:text-[#E4092B]'
    }`}>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#140E10] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-black animate-bounce border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-[#E4092B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 투네이션 스타일 메인 글로벌 헤더 */}
      <ToonNavbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyPage={handleOpenMyPage}
        onOpenCharge={() => setIsChargeOpen(true)}
        onOpenMessenger={() => setIsMessengerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLogout={handleLogout}
        onOpenCreatorDemo={() => setActiveModal('creator')}
        onOpenStudio={() => setActiveModal('studio')}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Router */}
      <main className={`flex-1 ${currentPage !== 'home' ? 'pt-20' : ''}`}>
        {/* 1위 서포터 실시간 전광판 알림바 (서브페이지 상단 얇은 알림) */}
        {currentPage !== 'home' && (
          <BillboardTicker
            topSupporter={rankings[0]}
            onOpenDonate={() => {
              setActiveModal('creator');
              handleOpenDonate(rankings[0].carrots + 100);
            }}
          />
        )}
        {/* 1. HOME LANDING PAGE (Socar-like Pure Continuous Flow) */}
        {currentPage === 'home' && (
          <ToonHero
            onOpenCreatorDemo={() => handleNavigate('bio')}
            onOpenStudio={() => setActiveModal('studio')}
            onOpenOnboarding={() => handleNavigate('onboarding')}
          />
        )}

        {/* 2. CREATORS EXPLORE DIRECTORY PAGE */}
        {currentPage === 'creators' && (
          <CreatorsPage
            onSelectCreator={handleSelectCreator}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 3. FEATURES & TIER MATRIX GUIDE PAGE */}
        {currentPage === 'features' && (
          <FeaturesPage
            onOpenCreatorDemo={() => setActiveModal('creator')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 4. FEES & SETTLEMENT GUIDE PAGE */}
        {currentPage === 'fees' && (
          <FeesPage
            onOpenStudio={() => setActiveModal('studio')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 5. ABOUT MIMIBIT PAGE */}
        {currentPage === 'about' && (
          <AboutPage
            onOpenStudio={() => setActiveModal('studio')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 6. ONBOARDING & LINK CREATION PAGE */}
        {currentPage === 'onboarding' && (
          <OnboardingPage
            onCompleteOnboarding={handleCompleteOnboarding}
            onBackToHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        )}

        {/* 7. FAQ & CUSTOMER SUPPORT PAGE */}
        {currentPage === 'faq' && (
          <FaqPage
            onOpenStudio={() => setActiveModal('studio')}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {/* 8. CREATOR BIO-LINK DEDICATED PAGE (mimibit.me/@creator) */}
        {currentPage === 'bio' && (
          <CreatorBioPage
            initialCreatorId={selectedBioCreatorId}
            currentUser={currentUser}
            onOpenDonate={handleOpenDonate}
            onOpenCharge={() => setIsChargeOpen(true)}
            onOpenMessenger={() => setIsMessengerOpen(true)}
            onBackToHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Floating Menu (Support, Kakao, Scroll Top) */}
      <FloatingMenu 
        onNavigate={handleNavigate} 
        onOpenMessenger={() => setIsMessengerOpen(true)}
      />

      {/* Corporate Professional Footer */}
      <ToonFooter onNavigate={handleNavigate} />



      {/* ============================================================== */}
      {/* FULLSCREEN / MODAL EXPERIENCE: CREATOR PROFILE & STUDIO DEMO */}
      {/* ============================================================== */}

      {/* 1. CREATOR PROFILE DEMO MODAL */}
      {activeModal === 'creator' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto animate-fade-in custom-scrollbar">
          {/* Modal Top Control Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between py-3 px-4 bg-[#1C1215] text-white rounded-2xl mb-4 shadow-xl border border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>닫기</span>
              </button>
              <span className="text-xs font-bold text-white/70 hidden sm:inline">
                | 크리에이터 바이오링크 공식 프로필
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Phone Mockup Toggle */}
              <button
                onClick={() => setIsPhoneFrame(!isPhoneFrame)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                title="모바일 프레임으로 보기"
              >
                {isPhoneFrame ? <Monitor className="w-3.5 h-3.5 text-[#FFB703]" /> : <Smartphone className="w-3.5 h-3.5 text-[#FFB703]" />}
                <span>{isPhoneFrame ? '와이드 뷰' : '모바일 뷰'}</span>
              </button>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Container */}
          <div className={`w-full ${isPhoneFrame ? 'iphone-frame shadow-2xl my-2' : 'max-w-4xl'}`}>
            {isPhoneFrame && (
              <div className="bg-[#1C1215] text-white pt-2 pb-1.5 px-6 flex items-center justify-between text-[11px] font-bold">
                <span>09:41</span>
                <div className="iphone-notch">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800"></span>
                  <span className="w-10 h-2.5 rounded-full bg-slate-800"></span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
            )}
            {isPhoneFrame && (
              <div className="bg-white px-3 py-1.5 border-b border-[#FCD5DC] flex items-center justify-between text-[11px] text-[#6B5E62]">
                <span className="truncate font-semibold">🔒 mimibit.me/{activeCreatorProfile.handle}</span>
                <span className="text-[10px] font-bold bg-[#FFF0F2] text-[#E4092B] px-2 py-0.5 rounded-full">인앱 브라우저</span>
              </div>
            )}

            <div className={isPhoneFrame ? 'p-3 max-h-[820px] overflow-y-auto custom-scrollbar bg-[#FFF5F6]' : 'bg-[#FFF5F6] p-4 sm:p-6 rounded-3xl'}>
              <CreatorHeader
                creator={activeCreatorProfile}
                onOpenDonate={() => handleOpenDonate()}
                onOpenTiers={() => setIsTiersOpen(true)}
              />

              <HallOfFame
                rankings={rankings}
                onOpenDonate={() => handleOpenDonate(rankings[0].carrots + 50)}
                onSelectSupporter={(s) => console.log(s)}
              />

              <GuestbookFeed
                guestbook={guestbook}
                onAddComment={(comment) => setGuestbook([comment, ...guestbook])}
                userState={userState}
                onOpenDonate={handleOpenDonate}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. CREATOR STUDIO MODAL */}
      {activeModal === 'studio' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-6 overflow-y-auto animate-fade-in custom-scrollbar">
          <div className="w-full max-w-4xl flex items-center justify-between py-3 px-4 bg-[#1C1215] text-white rounded-2xl mb-4 shadow-xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveModal(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>닫기</span>
            </button>
            <span className="text-xs font-bold text-white/70">
              미미빗 창작자 전용 관리자 대시보드
            </span>
            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full max-w-4xl">
            <CreatorStudio
              creator={(currentUser?.role === 'creator' && currentUser?.handle) ? (findCreatorByIdOrHandle(currentUser.handle) || activeCreatorProfile || creator) : (activeCreatorProfile || creator)}
              setCreator={setCreator}
              currentUser={currentUser}
              chatRooms={chatRooms}
              setChatRooms={setChatRooms}
              theme={theme}
              onSendCreatorReply={handleCreatorStudioReply}
              onClose={() => setActiveModal(null)}
              rankings={rankings}
              onBanUser={(nickname) => setRankings((prev) => prev.filter((r) => r.nickname !== nickname))}
            />
          </div>
        </div>
      )}

      {/* Donation & Tiers & Receipt Modals */}
      <RabbitTiersModal
        isOpen={isTiersOpen}
        onClose={() => setIsTiersOpen(false)}
        userTierLevel={userState.tierLevel}
        onSelectTierToDonate={(carrots) => handleOpenDonate(carrots)}
      />

      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        creator={activeCreatorProfile}
        presetCarrots={presetCarrots}
        currentUser={currentUser}
        onCompleteDonation={handleCompleteDonation}
      />

      <ReceiptTicketModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        donationData={latestDonation}
        creator={activeCreatorProfile}
      />

      {/* Auth & Member Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <MyPageModal
        isOpen={isMyPageOpen}
        onClose={() => setIsMyPageOpen(false)}
        user={currentUser}
        initialTab={myPageTab}
        onUpdateUser={handleUpdateUser}
        onLogout={handleLogout}
        onOpenDonate={() => {
          setIsMyPageOpen(false);
          setActiveModal('creator');
          handleOpenDonate();
        }}
        onSwitchToCreator={() => {
          setIsMyPageOpen(false);
          setActiveModal('studio');
        }}
        onOpenCharge={() => {
          setIsMyPageOpen(false);
          setIsChargeOpen(true);
        }}
        onOpenMessenger={() => {
          setIsMyPageOpen(false);
          setIsMessengerOpen(true);
        }}
        transactions={transactions}
      />

      {/* Carrot Wallet Recharge PG Simulator Modal */}
      <ChargeModal
        isOpen={isChargeOpen}
        onClose={() => setIsChargeOpen(false)}
        currentUser={currentUser}
        theme={theme}
        onChargeSuccess={handleChargeSuccess}
        onOpenMyPage={() => {
          setIsChargeOpen(false);
          setIsMyPageOpen(true);
        }}
        onOpenAuth={() => {
          setIsChargeOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* KakaoTalk Style 1:1 Secret Messenger Multi-Creator Modal */}
      <KakaoSecretMessengerModal
        isOpen={isMessengerOpen}
        onClose={() => setIsMessengerOpen(false)}
        chatRooms={chatRooms}
        setChatRooms={setChatRooms}
        currentUser={currentUser}
        theme={theme}
        onOpenDonate={() => {
          setIsMessengerOpen(false);
          setActiveModal('creator');
          handleOpenDonate();
        }}
        onOpenCharge={() => {
          setIsMessengerOpen(false);
          setIsChargeOpen(true);
        }}
      />

      {/* MIMIBIT Master Admin Console (zeze1.sec@gmail.com / root) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
        theme={theme}
      />
    </div>
  );
}

export default App;
