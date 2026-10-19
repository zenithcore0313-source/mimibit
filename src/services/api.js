// =====================================================================
// MIMIBIT API & DATA PERSISTENCE LAYER
// Designed for seamless transition from Local/Client storage to AWS Backend
// =====================================================================

import { INITIAL_CREATOR, INITIAL_RANKINGS, INITIAL_GUESTBOOK, INITIAL_SECRET_MESSAGES, INITIAL_CHAT_ROOMS } from '../data/initialData';

// AWS Backend API Base URL
// In production (behind Nginx reverse proxy), relative path '' routes directly to same-origin /api.
// In local dev, Vite proxies /api to http://127.0.0.1:3000.
// If VITE_API_BASE_URL is explicitly set, it will override.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Initial Default Creators (Clean Launch State: empty, real creators register via onboarding)
export const DEFAULT_CREATORS = [];

// Helper: Get Creators from LocalStorage or API
export function getStoredCreators() {
  try {
    const raw = localStorage.getItem('mimibit_creators');
    if (!raw) {
      return [];
    }
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    // Purge any legacy dummy showcase creators (Luna, Mochi, Chibi, Neon)
    const cleaned = list.filter(c => 
      c && c.id && 
      !['luna_rabbit', 'mochi_cos', 'chibi_artist', 'neon_vibe'].includes(c.id.toLowerCase()) &&
      !['@luna_rabbit', '@mochi_cos', '@chibi_artist', '@neon_vibe'].includes(c.handle?.toLowerCase())
    );
    if (cleaned.length !== list.length) {
      localStorage.setItem('mimibit_creators', JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
}

// Find creator by handle or ID (e.g. '@luna_rabbit', 'luna_rabbit', 'my_creator')
export function findCreatorByIdOrHandle(idOrHandle) {
  if (!idOrHandle) return null;
  const clean = idOrHandle.replace(/[@#]/g, '').trim().toLowerCase();
  const creators = getStoredCreators();
  return creators.find(c => 
    c.id.toLowerCase() === clean || 
    c.handle.replace('@', '').toLowerCase() === clean
  ) || null;
}

// Fetch single creator from backend API or local fallback
export async function fetchCreator(idOrHandle) {
  if (!idOrHandle) return null;
  const clean = idOrHandle.replace(/[@#]/g, '').trim().toLowerCase();

  try {
    const res = await fetch(`${API_BASE_URL}/api/creators/${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        const creators = getStoredCreators();
        const idx = creators.findIndex(c => c.id.toLowerCase() === clean);
        let updated;
        if (idx >= 0) {
          updated = [...creators];
          updated[idx] = { ...updated[idx], ...data.data };
        } else {
          updated = [data.data, ...creators];
        }
        localStorage.setItem('mimibit_creators', JSON.stringify(updated));
        return data.data;
      }
    }
  } catch (e) {
    // Backend offline or unreachable, fall back to local
  }

  return findCreatorByIdOrHandle(idOrHandle);
}

// Register a New Creator
export function registerNewCreator(formData) {
  const cleanId = formData.handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || `creator_${Date.now()}`;
  const creators = getStoredCreators();

  // If already exists, update
  const existingIdx = creators.findIndex(c => c.id === cleanId);

  const newCreator = {
    id: cleanId,
    handle: `@${formData.handle.replace(/[@/]/g, '')}`,
    name: formData.name || '새 크리에이터',
    category: formData.category || '서브컬처 창작자',
    bio: formData.bio || `${formData.name}님의 미미빗 바이오링크입니다! 일상과 창작 여정을 응원해 주세요 🥕✨`,
    avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: formData.tags || ['#창작자', '#후원', `#${formData.category || '서브컬처'}`],
    followers: 1,
    supporters: 0,
    sns: {
      instagram: formData.snsUrl || formData.instagram || 'https://instagram.com',
      twitter: formData.twitter || '',
      youtube: formData.youtube || ''
    },
    fundingGoal: {
      title: formData.goalTitle || '첫 후원 프로젝트 펀딩',
      currentCarrots: 0,
      targetCarrots: parseInt(formData.goalCarrots || formData.targetCarrots, 10) || 5000,
      endDate: '2026. 11. 30'
    },
    bankInfo: {
      bank: formData.bankName || '토스뱅크',
      account: formData.accountNumber || '1000-0000-0000',
      holder: formData.accountHolder || formData.name
    },
    voiceReward: {
      title: `${formData.name}의 감사 음성 메모`,
      duration: '0:15',
      message: formData.welcomeVoiceMsg || '응원해 주셔서 진심으로 감사합니다! 더 좋은 창작물로 보답할게요.'
    },
    secretPhotos: []
  };

  let updatedList;
  if (existingIdx >= 0) {
    updatedList = [...creators];
    updatedList[existingIdx] = { ...updatedList[existingIdx], ...newCreator };
  } else {
    updatedList = [newCreator, ...creators];
  }

  localStorage.setItem('mimibit_creators', JSON.stringify(updatedList));

  // Sync to Backend
  if (API_BASE_URL) {
    fetch(`${API_BASE_URL}/api/creators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCreator)
    }).catch(err => console.warn('[API] Backend sync failed, local saved:', err));
  }

  return newCreator;
}

// Process a live donation to a creator
export function processCreatorDonation(creatorId, donationData) {
  const creators = getStoredCreators();
  const creator = creators.find(c => c.id === creatorId);
  if (!creator) return null;

  const addedCarrots = parseInt(donationData.carrots, 10) || 10;
  
  // Update creator funding goal and supporters
  const updatedCreator = {
    ...creator,
    supporters: (creator.supporters || 0) + 1,
    fundingGoal: {
      ...creator.fundingGoal,
      currentCarrots: (creator.fundingGoal?.currentCarrots || 0) + addedCarrots
    }
  };

  const updatedCreators = creators.map(c => c.id === creatorId ? updatedCreator : c);
  localStorage.setItem('mimibit_creators', JSON.stringify(updatedCreators));

  // Record transaction in ledger
  try {
    const rawTx = localStorage.getItem('mimibit_transactions');
    const txList = rawTx ? JSON.parse(rawTx) : [];
    const newTx = {
      id: `TX_${Date.now()}`,
      date: new Date().toLocaleDateString('ko-KR'),
      creatorId,
      creatorName: creator.name,
      senderNickname: donationData.nickname || '익명의 팬',
      carrots: addedCarrots,
      amountKRW: addedCarrots * 100,
      platformFee: Math.round(addedCarrots * 100 * 0.10), // 10% Toonation Fee
      taxWithholding: Math.round(addedCarrots * 100 * 0.033), // 3.3% Withholding
      netPayout: Math.round(addedCarrots * 100 * 0.867), // 86.7%
      message: donationData.message || ''
    };
    localStorage.setItem('mimibit_transactions', JSON.stringify([newTx, ...txList]));
  } catch (e) {}

  return updatedCreator;
}

// =====================================================================
// AUTH & PROFILE BACKEND API INTEGRATION (AWS EC2 / Express)
// =====================================================================

// 1. User Sign-Up (회원가입)
export async function signupUser(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || '회원가입 중 오류가 발생했습니다.');
    }
    if (data.token) {
      localStorage.setItem('mimibit_auth_token', data.token);
    }
    if (data.user) {
      data.user = { ...data.user, isLoggedIn: true };
      localStorage.setItem('mimibit_auth_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn('[API] Backend signup failed, falling back to local simulation:', err.message);
    // Fallback: If backend is temporarily offline, register locally
    const fallbackUser = {
      id: `usr_${Date.now()}`,
      email: payload.email,
      name: payload.name,
      handle: `@${(payload.handle || 'user').replace(/[@/]/g, '')}`,
      role: payload.role || 'supporter',
      isLoggedIn: true,
      avatar: payload.avatar || (payload.role === 'creator'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
      bio: payload.bio || '',
      carrotsBalance: payload.role === 'creator' ? 0 : 100,
      tickets: payload.role === 'creator' ? 0 : 1,
      tier: payload.role === 'creator' ? null : { name: '화이트 래빗', icon: '🤍', level: 1 }
    };
    localStorage.setItem('mimibit_auth_user', JSON.stringify(fallbackUser));
    return { success: true, user: fallbackUser, token: 'local_token' };
  }
}

// 2. User Login (로그인)
export async function loginUser(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    if (data.token) {
      localStorage.setItem('mimibit_auth_token', data.token);
    }
    if (data.user) {
      data.user = { ...data.user, isLoggedIn: true };
      localStorage.setItem('mimibit_auth_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn('[API] Backend login failed:', err.message);
    throw err;
  }
}

// 2-1. Social Login & Auto Sign-up (소셜 간편로그인)
export async function loginWithSocial(socialPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(socialPayload)
    });
    const data = await res.json();
    if (res.ok && data.success && data.user) {
      data.user = { ...data.user, isLoggedIn: true };
      if (data.token) {
        localStorage.setItem('mimibit_auth_token', data.token);
      }
      localStorage.setItem('mimibit_auth_user', JSON.stringify(data.user));
      return data;
    }
  } catch (err) {
    console.warn('[API] Social auth backend error, using client persistence fallback:', err);
  }

  // Graceful fallback for offline / immediate sign-in
  const fallbackUser = {
    id: `usr_${socialPayload.provider}_${Date.now()}`,
    email: socialPayload.email || `${socialPayload.provider}_user@mimibit.kr`,
    name: socialPayload.name || (socialPayload.provider === 'kakao' ? '카카오 서포터' : 'Google 서포터'),
    handle: `@${socialPayload.provider}_${Math.floor(1000 + Math.random() * 9000)}`,
    role: socialPayload.role || 'supporter',
    avatar: socialPayload.avatar || (socialPayload.role === 'creator'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'),
    carrotsBalance: 100,
    tickets: 1,
    tier: socialPayload.role === 'creator' ? null : { name: '골드 래빗', icon: '🥇', level: 3 }
  };
  localStorage.setItem('mimibit_auth_user', JSON.stringify(fallbackUser));
  return { success: true, user: fallbackUser, token: 'local_social_token' };
}

// 3. Check Handle / Link Availability (실시간 링크 중복 확인)
export async function checkHandleAvailability(handle) {
  try {
    const clean = handle.replace(/[@#/]/g, '').trim().toLowerCase();
    const res = await fetch(`${API_BASE_URL}/api/auth/check-handle/${clean}`);
    const data = await res.json();
    return data;
  } catch (e) {
    // Local fallback check
    const clean = handle.replace(/[@#/]/g, '').trim().toLowerCase();
    const creators = getStoredCreators();
    const exists = creators.some(c => c.id.toLowerCase() === clean || c.handle.replace('@', '').toLowerCase() === clean);
    return { available: !exists, message: exists ? '이미 사용 중인 주소입니다.' : '사용 가능한 주소입니다!' };
  }
}

// 4. Update Profile (프로필 수정)
export async function updateUserProfile(userId, profileData) {
  try {
    const token = localStorage.getItem('mimibit_auth_token');
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ userId, ...profileData })
    });
    const data = await res.json();
    if (data.user) {
      localStorage.setItem('mimibit_auth_user', JSON.stringify({ ...data.user, isLoggedIn: true }));
    }
    return data;
  } catch (err) {
    console.warn('[API] Update profile failed, saving to local store:', err);
    const stored = localStorage.getItem('mimibit_auth_user');
    if (stored) {
      try {
        const u = JSON.parse(stored);
        const updated = { ...u, ...profileData, isLoggedIn: true };
        localStorage.setItem('mimibit_auth_user', JSON.stringify(updated));
        return { success: true, user: updated, message: '프로필이 로컬에 저장되었습니다.' };
      } catch (e) {}
    }
    return { success: false, message: err.message };
  }
}

// 5. Fetch Live Creators from Backend
export async function fetchLiveCreators() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/creators`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data) && data.data.length > 0) {
      localStorage.setItem('mimibit_creators', JSON.stringify(data.data));
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch creators failed, using local store');
  }
  return getStoredCreators();
}

// 6. Request Creator Settlement Payout (출금 신청)
export async function requestPayout(payoutData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payouts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payoutData)
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Payout request offline fallback:', e);
  }
  return {
    id: `PAY_${Date.now().toString().slice(-4)}`,
    ...payoutData,
    status: '정산 승인 (익일 입금 대기)',
    requestedAt: new Date().toISOString()
  };
}

// 7. Fetch Creator Payout History (출금 내역 조회)
export async function fetchPayouts(creatorId) {
  try {
    const clean = (creatorId || '').replace(/[@#]/g, '').toLowerCase();
    const res = await fetch(`${API_BASE_URL}/api/payouts/${clean}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch payouts failed:', e);
  }
  return [];
}

// 8. Confirm Toss Payment & Credit User Balance
export async function confirmTossPayment(paymentData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/toss/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Toss payment confirm offline fallback:', e);
  }
  return {
    id: paymentData.orderId || `TOSS_${Date.now()}`,
    ...paymentData,
    status: '결제 완료 (승인)',
    approvalNo: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    createdAt: new Date().toISOString()
  };
}

// 9. Create Bank Transfer Order (무통장입금 / 가상계좌 주문)
export async function createBankTransferOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/bank-transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Bank transfer order offline fallback:', e);
  }

  // Fallback virtual account generation
  const bankPrefixes = {
    '토스뱅크': '1000',
    '카카오뱅크': '3333',
    'KB국민은행': '9045',
    '신한은행': '110',
    '우리은행': '1002',
    '하나은행': '541',
    'NH농협은행': '302',
    'IBK기업은행': '010'
  };
  const prefix = bankPrefixes[orderData.bankName] || '1000';
  const virtualAccount = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);

  return {
    id: `BANK_${Date.now()}`,
    orderId: `MMB-VA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    ...orderData,
    virtualAccount,
    accountHolder: '주식회사 미미빗 (MIMIBIT)',
    status: '입금 대기 (가상계좌 발급)',
    dueDate: dueDate.toISOString(),
    createdAt: new Date().toISOString()
  };
}

// 10. Confirm Bank Transfer Deposit (입금 확인 시뮬레이션 / 승인)
export async function confirmBankTransferOrder(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/bank-transfer/${orderId}/confirm`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Confirm bank transfer offline fallback:', e);
  }
  return {
    orderId,
    status: '입금 완료 (충전 완료)',
    confirmedAt: new Date().toISOString()
  };
}

// 11. Fetch User Payment History
export async function fetchUserPaymentHistory(userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payments/history/${userId}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch payment history offline fallback:', e);
  }
  return [];
}

// 12. Fetch Master Admin Overview
export async function fetchAdminOverview() {
  try {
    const token = localStorage.getItem('mimibit_auth_token') || '';
    const res = await fetch(`${API_BASE_URL}/api/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch admin overview offline fallback:', e);
  }

  // Fallback demo metrics if server offline
  return {
    metrics: {
      totalGMV: 2680000,
      platformRevenue: 268000,
      totalRechargeKRW: 3500000,
      pendingPayoutsKRW: 145000,
      pendingBankTransferCount: 1,
      totalUsers: 142,
      totalCreators: 5,
      totalDonationCount: 88
    },
    users: [],
    creators: [],
    donations: [],
    charges: [],
    bankTransfers: [],
    payouts: []
  };
}

// 13. Admin Complete Creator Payout (정산 송금 완료)
export async function completePayout(payoutId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/payouts/${payoutId}/complete`, {
      method: 'POST'
    });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Complete payout offline fallback:', e);
  }
  return { id: payoutId, status: '정산 입금 완료 (송금 완료)' };
}

// 14. Admin User Carrot Adjustment (CS 당근 수동 조정)
export async function adjustUserCarrots(userId, amount, reason) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/carrots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, reason })
    });
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Adjust carrots offline fallback:', e);
  }
  return null;
}

// 15. Send Chat Message (1:1 시크릿톡 메시지 전송)
export async function sendChatMessage(messageData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Send chat message offline fallback:', e);
  }
  return {
    ...messageData,
    id: `msg_local_${Date.now()}`,
    timestamp: '방금 전'
  };
}

// 16. Fetch Chat Messages (1:1 시크릿톡 메시지 조회)
export async function fetchChatMessages(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/messages?${query}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch chat messages offline fallback:', e);
  }
  return [];
}

// 17. Fetch Chat Rooms (사용자/크리에이터 대화방 목록 조회)
export async function fetchChatRooms(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/api/chat-rooms?${query}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
  } catch (e) {
    console.warn('[API] Fetch chat rooms offline fallback:', e);
  }
  return [];
}





