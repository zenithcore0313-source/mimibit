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
import { 
  getStoredCreators, 
  findCreatorByIdOrHandle, 
  registerNewCreator, 
  deleteCreatorProfile, 
  deleteUserProfile, 
  fetchLiveCreators, 
  processCreatorDonation, 
  confirmTossPayment, 
  fetchChatRooms 
} from './services/api';

export function App() {
  // Page Routing State ('home', 'creators', 'features', 'fees', 'about', 'onboarding', 'faq', 'bio')
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const validPages = ['creators', 'features', 'fees', 'about', 'onboarding', 'faq', 'bio'];
    if (hash === 'bio' || hash.startsWith('@')) return 'bio';
    return validPages.includes(hash) ? hash : 'home';
  });
  const [selectedBioCreatorId, setSelectedBioCreatorId] = useState(null);

  // Modal / View Overlay states
  const [activeModal, setActiveModal] = useState(null); // null, 'creator', 'studio', 'secret'
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);
  const [myPageTab, setMyPageTab] = useState('sponsorships');
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [selectedMessengerRoomId, setSelectedMessengerRoomId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const handleOpenMyPage = (tab = 'sponsorships') => {
    setMyPageTab(tab);
    setIsMyPageOpen(true);
  };

  // Authenticated User State (Restored reliably from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mimibit_auth_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && (parsed.id || parsed.email || parsed.name)) {
        // Clean legacy hardcoded dummy sponsorships / receipts / messages if present
        const cleanedUser = {
          ...parsed,
          sponsorships: Array.isArray(parsed.sponsorships)
            ? parsed.sponsorships.filter(s => s && s.creatorName && !s.creatorName.includes('Luna') && s.carrots > 0)
            : [],
          receiptTickets: Array.isArray(parsed.receiptTickets)
            ? parsed.receiptTickets.filter(t => t && t.id !== 1024 && !t.creatorName?.includes('Luna'))
            : [],
          recentMessages: Array.isArray(parsed.recentMessages)
            ? parsed.recentMessages.filter(m => m && !m.content?.includes('인쇄 잘되길'))
            : [],
          isLoggedIn: true
        };
        return cleanedUser;
      }
    } catch (e) {
      console.warn('Failed to parse auth user from localStorage:', e);
    }
    return null;
  });

  // Multi-creator chat rooms (KakaoTalk style: clean launch state)
  const [chatRooms, setChatRooms] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('mimibit_chat_rooms');
        localStorage.removeItem('mimibit_chat_rooms_v2');
        localStorage.removeItem('mimibit_chat_rooms_v3');
        localStorage.removeItem('mimibit_chat_rooms_v4');
      } catch (e) {}
    }
    try {
      const saved = localStorage.getItem('mimibit_chat_rooms_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const DUMMY_ROOMS = ['room_luna', 'room_mochi', 'room_chibi', 'room_neon'];
          return parsed.filter(r => !DUMMY_ROOMS.includes(r.id?.toLowerCase()));
        }
      }
    } catch (e) {}
    return INITIAL_CHAT_ROOMS; // []
  });

  // Fetch real chat rooms from server on mount & sync across accounts
  useEffect(() => {
    fetchChatRooms().then(rooms => {
      if (rooms && rooms.length > 0) {
        setChatRooms(prev => {
          const merged = [...rooms];
          prev.forEach(p => {
            const existingIdx = merged.findIndex(m => m.id === p.id);
            if (existingIdx === -1) {
              merged.push(p);
            } else {
              // merge messages
              const currentMsgs = merged[existingIdx].messages || [];
              (p.messages || []).forEach(msg => {
                if (!currentMsgs.some(m => m.id === msg.id)) {
                  currentMsgs.push(msg);
                }
              });
              merged[existingIdx].messages = currentMsgs;
            }
          });
          return merged;
        });
      }
    });
  }, [currentUser?.id]);

  // Auto-sync creators between local and server (ensures creators created on any account are visible to all)
  useEffect(() => {
    fetchLiveCreators().then(serverCreators => {
      const localCreators = getStoredCreators();
      if (localCreators && localCreators.length > 0) {
        localCreators.forEach(c => {
          if (!c || !c.name || !c.handle) return;
          const cleanH = (c.handle || '').replace(/[@/]/g, '').toLowerCase();
          const existsOnServer = (serverCreators || []).some(sc => 
            sc.id?.toLowerCase() === c.id?.toLowerCase() || 
            (sc.handle || '').replace(/[@/]/g, '').toLowerCase() === cleanH
          );
          if (!existsOnServer) {
            fetch('/api/creators', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(c)
            }).then(() => {
              console.log('[AutoSync] Synced local creator to server:', c.name);
            }).catch(() => {});
          }
        });
      }
    });
  }, []);

  // Live sync rankings & guestbook from backend donations
  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // 1. Calculate live rankings
          const map = {};
          data.data.forEach(d => {
            const nick = d.nickname || '익명의 팬';
            if (!map[nick]) {
              map[nick] = {
                id: d.id,
                nickname: nick,
                carrots: 0,
                message: d.message || '',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
              };
            }
            map[nick].carrots += (d.carrots || 0);
            if (d.message) map[nick].message = d.message;
          });
          const sorted = Object.values(map).sort((a, b) => b.carrots - a.carrots).slice(0, 5).map((item, idx) => ({
            ...item,
            rank: idx + 1,
            isTop1: idx === 0,
            badge: idx === 0 ? '👑 루비 래빗' : idx === 1 ? '🥇 다이아 래빗' : idx === 2 ? '🥈 플래티넘 래빗' : '🥉 골드 래빗'
          }));
          if (sorted.length > 0) {
            setRankings(sorted);
          }

          // 2. Format live guestbook
          const gb = data.data.map(d => ({
            id: d.id,
            nickname: d.nickname || '익명의 서포터',
            carrots: d.carrots,
            content: d.message || `${d.carrots.toLocaleString()} 🥕 당근을 선물하고 응원을 보냈습니다! ✨`,
            createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('ko-KR') : '최근'
          }));
          if (gb.length > 0) {
            setGuestbook(gb);
          }
        }
      })
      .catch(() => {});
  }, []);

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
  const [activeCreatorProfile, setActiveCreatorProfile] = useState(null);

  // Persisted state simulation
  const [creator, setCreator] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mimibit_creator');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id && parsed.id !== 'luna_rabbit') {
            return parsed;
          }
        }
      } catch (e) {}
    }
    return null;
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
          const stored = getStoredCreators();
          setSelectedBioCreatorId(stored.length > 0 ? stored[0].id : null);
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
    if (!c) {
      handleNavigate('bio');
      return;
    }
    if (typeof c === 'string') {
      const handleClean = c.replace(/[@#]/g, '');
      setSelectedBioCreatorId(handleClean);
      window.location.hash = `#/@${handleClean}`;
      setCurrentPage('bio');
      return;
    }
    const creatorId = c.id || (c.handle ? c.handle.replace(/[@#]/g, '') : null);
    setSelectedBioCreatorId(creatorId);
    setActiveCreatorProfile(c);
    if (creatorId) {
      window.location.hash = `#/@${creatorId}`;
    }
    setCurrentPage('bio');
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

  // Delete Creator Profile & Biolink Handler
  const handleDeleteCreatorProfile = async (creatorId) => {
    try {
      const targetId = creatorId || currentUser?.handle || currentUser?.id;
      await deleteCreatorProfile(targetId);

      // Revert current user role to supporter if this creator was current user
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          role: currentUser.role === 'admin' ? 'admin' : 'supporter',
          handle: currentUser.role === 'admin' ? currentUser.handle : undefined
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('mimibit_auth_user', JSON.stringify(updatedUser));
      }

      setCreator(null);
      setActiveCreatorProfile(null);
      setSelectedBioCreatorId(null);
      setActiveModal(null);
      setIsMyPageOpen(false);
      handleNavigate('home');
      triggerToast('🗑️ 크리에이터 프로필 및 바이오링크가 삭제되었습니다.');
    } catch (err) {
      console.error('Delete creator error:', err);
      triggerToast('크리에이터 프로필 삭제 중 오류가 발생했습니다.');
    }
  };

  // Delete User Account / Profile Handler (회원 탈퇴)
  const handleDeleteAccount = async (userId) => {
    try {
      const targetId = userId || currentUser?.id;
      if (currentUser?.handle) {
        await deleteCreatorProfile(currentUser.handle);
      }
      await deleteUserProfile(targetId);
      handleLogout();
      triggerToast('🚪 회원 탈퇴 및 계정 프로필 데이터가 완전히 삭제되었습니다.');
    } catch (err) {
      console.error('Delete account error:', err);
      triggerToast('회원 탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  // Creator Studio 1:1 Secret Talk reply handler
  const handleCreatorStudioReply = (roomId, replyText, attachVoice, attachPhoto) => {
    const creatorName = currentUser?.name || activeCreatorProfile?.name || creator?.name || '크리에이터';
    const creatorId = activeCreatorProfile?.id || creator?.id || (roomId ? roomId.replace('room_', '') : 'creator');
    const effectiveRoomId = roomId || `room_${creatorId}`;

    const newReply = {
      id: `msg_reply_${Date.now()}`,
      roomId: effectiveRoomId,
      creatorId,
      creatorName,
      senderId: currentUser?.id || 'creator',
      sender: creatorName,
      senderTier: 'creator',
      text: replyText,
      timestamp: '방금 전',
      isCreator: true,
      voiceNote: attachVoice ? {
        label: `${creatorName}의 1:1 보이스 답례 메모`,
        duration: '0:15'
      } : null,
      photoUrl: attachPhoto ? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80' : null
    };

    // Save reply to backend server so supporter on Account 2 receives it
    sendChatMessage(newReply);

    setChatRooms(prev => prev.map(room => {
      const isMatch = room.id === effectiveRoomId || (room.creatorId && room.creatorId === creatorId);
      if (isMatch) {
        return {
          ...room,
          lastUpdated: '방금 전',
          messages: [...(room.messages || []), newReply]
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
    localStorage.setItem('mimibit_chat_rooms_v5', JSON.stringify(chatRooms));
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

  // Handle Toss Payments Redirect Success / Failure Callback
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash || '';
      const queryFromHash = hash.includes('?') ? new URLSearchParams(hash.split('?')[1]) : null;
      
      const paymentKey = searchParams.get('paymentKey') || queryFromHash?.get('paymentKey');
      const orderId = searchParams.get('orderId') || queryFromHash?.get('orderId');
      const amount = searchParams.get('amount') || queryFromHash?.get('amount');

      const failCode = searchParams.get('code') || queryFromHash?.get('code');
      const failMessage = searchParams.get('message') || queryFromHash?.get('message');

      // Failure redirect handling
      if (failCode || failMessage || hash.includes('payment_fail')) {
        triggerToast(`결제가 취소되었거나 진행되지 않았습니다. (${failMessage || '사용자 취소'})`);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      // Success redirect handling
      if (paymentKey && orderId && amount) {
        const parsedAmount = parseInt(amount, 10);

        // Standard Carrot Package Lookup Table
        const PACKAGE_TABLE = [
          { totalPrice: 1100, cash: 1000, bonus: 0 },
          { totalPrice: 3300, cash: 3000, bonus: 0 },
          { totalPrice: 5500, cash: 5000, bonus: 200 },
          { totalPrice: 11000, cash: 10000, bonus: 1000 },
          { totalPrice: 33000, cash: 30000, bonus: 4000 },
          { totalPrice: 55000, cash: 50000, bonus: 8000 },
          { totalPrice: 110000, cash: 100000, bonus: 20000 },
        ];

        const matchedPkg = PACKAGE_TABLE.find(p => p.totalPrice === parsedAmount);
        const chargedCarrots = matchedPkg ? matchedPkg.cash : Math.round(parsedAmount / 1.1);
        const bonusCarrots = matchedPkg ? matchedPkg.bonus : 0;
        const totalCarrots = chargedCarrots + bonusCarrots;

        // Resolve userId securely from state or persistent storage
        let activeUserId = currentUser?.id;
        if (!activeUserId) {
          try {
            const rawUser = localStorage.getItem('mimibit_auth_user');
            if (rawUser) {
              activeUserId = JSON.parse(rawUser)?.id;
            }
          } catch (e) {}
        }

        confirmTossPayment({
          paymentKey,
          orderId,
          amount: parsedAmount,
          userId: activeUserId,
          carrots: chargedCarrots,
          bonusCarrots: bonusCarrots,
          method: '토스페이먼츠'
        }).then(record => {
          handleChargeSuccess({
            orderId,
            chargedCarrots,
            bonusCarrots,
            totalCarrots,
            price: parsedAmount,
            paymentMethod: record?.method || '토스페이먼츠'
          });
          window.history.replaceState({}, document.title, window.location.pathname);
        }).catch(err => {
          console.warn('[Toss redirect confirm]', err);
          triggerToast('결제 승인 처리 중 문제가 발생했습니다. 고객센터로 문의해 주세요.');
          window.history.replaceState({}, document.title, window.location.pathname);
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

    // If logged in user (supporter or admin), update carrots balance
    if (currentUser) {
      setCurrentUser(prev => ({
        ...prev,
        carrotsBalance: Math.max(0, (prev.carrotsBalance || 0) - data.carrots),
        tickets: (prev.tickets || 0) + addedTickets
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

  // Direct Carrot Gifting from Wallet Balance (선물하기 버튼 클릭 시)
  const handleGiftCarrots = (targetCreator, carrotAmount, cheerMessage) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const availableCarrots = currentUser.carrotsBalance || 0;
    if (availableCarrots < carrotAmount) {
      if (window.confirm(`보유 당근(${availableCarrots.toLocaleString()}개)이 부족합니다. 당근 충전소로 이동하시겠습니까?`)) {
        setIsChargeOpen(true);
      }
      return;
    }

    // 1. Deduct carrots from user wallet
    const nextBalance = Math.max(0, availableCarrots - carrotAmount);
    const addedTickets = carrotAmount >= 1000 ? 5 : 1;
    const updatedUser = {
      ...currentUser,
      carrotsBalance: nextBalance,
      tickets: (currentUser.tickets || 0) + addedTickets
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('mimibit_auth_user', JSON.stringify(updatedUser));

    // 2. Persist donation to backend API
    processCreatorDonation(targetCreator.id || targetCreator.handle, {
      carrots: carrotAmount,
      nickname: currentUser.name || currentUser.nickname || '익명의 팬',
      message: cheerMessage || '',
      userId: currentUser.id
    });

    // 3. Ensure 1:1 chat room is created / unlocked for this creator
    const isRoot = currentUser.role === 'admin';
    const rId = `room_${targetCreator.id}`;
    setChatRooms(prev => {
      const exists = prev.find(r => r.id === rId);
      if (exists) {
        return prev.map(r => r.id === rId ? {
          ...r,
          isUnlocked: true,
          tickets: isRoot ? 9999 : (r.tickets || 0) + addedTickets,
          lastUpdated: '방금 전'
        } : r);
      }
      return [
        {
          id: rId,
          creatorId: targetCreator.id,
          creatorName: targetCreator.name,
          handle: targetCreator.handle,
          avatar: targetCreator.avatar,
          category: targetCreator.category,
          tierName: isRoot ? '최고 관리자' : '골드 래빗',
          tierIcon: isRoot ? '👑' : '🥇',
          tierLevel: isRoot ? 5 : 3,
          isUnlocked: true,
          tickets: isRoot ? 9999 : addedTickets,
          unreadCount: 0,
          lastUpdated: '방금 전',
          messages: []
        },
        ...prev
      ];
    });

    triggerToast(`🥕 ${targetCreator.name}님에게 ${carrotAmount.toLocaleString()} 당근을 성공적으로 선물했습니다! (잔여: ${nextBalance.toLocaleString()}개)`);
  };

  // Open Secret Messenger with a Specific Creator directly
  const handleOpenBioMessenger = (targetCreator) => {
    if (targetCreator) {
      const isRoot = currentUser?.role === 'admin';
      const cleanId = targetCreator.id || targetCreator.handle?.replace(/[@#]/g, '') || 'creator';
      const rId = `room_${cleanId}`;
      setChatRooms(prev => {
        const exists = prev.find(r => r.id === rId);
        if (exists) {
          if (isRoot) return prev.map(r => r.id === rId ? { ...r, isUnlocked: true, tickets: 9999 } : r);
          return prev;
        }
        return [
          {
            id: rId,
            creatorId: cleanId,
            creatorName: targetCreator.name || '크리에이터',
            handle: targetCreator.handle || `@${cleanId}`,
            avatar: targetCreator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            category: targetCreator.category || '공식 크리에이터',
            tierName: isRoot ? '최고 관리자' : '골드 래빗',
            tierIcon: isRoot ? '👑' : '🥇',
            tierLevel: isRoot ? 5 : 3,
            isUnlocked: isRoot || Boolean(targetCreator.isUnlocked),
            tickets: isRoot ? 9999 : 5,
            unreadCount: 0,
            lastUpdated: '방금 전',
            messages: []
          },
          ...prev
        ];
      });
      setSelectedMessengerRoomId(rId);
    }
    setIsMessengerOpen(true);
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
        onOpenCreatorDemo={() => handleNavigate('bio')}
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
              handleNavigate('bio');
              handleOpenDonate(rankings[0]?.carrots ? rankings[0].carrots + 100 : 100);
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
            onNavigate={handleNavigate}
          />
        )}

        {/* 3. FEATURES & TIER MATRIX GUIDE PAGE */}
        {currentPage === 'features' && (
          <FeaturesPage
            onOpenCreatorDemo={() => handleNavigate('bio')}
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
            onGiftCarrots={handleGiftCarrots}
            onOpenCharge={() => setIsChargeOpen(true)}
            onOpenMessenger={handleOpenBioMessenger}
            onBackToHome={() => handleNavigate('home')}
            onNavigate={handleNavigate}
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
      {/* FULLSCREEN / MODAL EXPERIENCE: CREATOR STUDIO                  */}
      {/* ============================================================== */}

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
              onDeleteCreatorProfile={handleDeleteCreatorProfile}
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
        onDeleteCreatorProfile={handleDeleteCreatorProfile}
        onDeleteAccount={handleDeleteAccount}
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
        onClose={() => {
          setIsMessengerOpen(false);
          setSelectedMessengerRoomId(null);
        }}
        chatRooms={chatRooms}
        setChatRooms={setChatRooms}
        currentUser={currentUser}
        theme={theme}
        initialRoomId={selectedMessengerRoomId}
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
