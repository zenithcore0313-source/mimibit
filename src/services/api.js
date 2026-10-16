// =====================================================================
// MIMIBIT API & DATA PERSISTENCE LAYER
// Designed for seamless transition from Local/Client storage to AWS Backend
// =====================================================================

import { INITIAL_CREATOR, INITIAL_RANKINGS, INITIAL_GUESTBOOK, INITIAL_SECRET_MESSAGES, INITIAL_CHAT_ROOMS } from '../data/initialData';

// AWS Backend API Base URL (defaults to local express server http://localhost:3000)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Initial 4 Default Creators
export const DEFAULT_CREATORS = [
  {
    id: 'luna_rabbit',
    handle: '@Luna_Rabbit',
    name: 'Luna Rabbit (루나)',
    category: '일러스트레이터 & 서브컬처 코스어',
    bio: '주말마다 감성 포토와 드로잉 일상을 공유해요! 따뜻한 커피 한 잔과 당근 후원은 창작 활동에 가장 큰 힘이 됩니다 🥕✨',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    tags: ['#일러스트', '#코스어', '#서브컬처', '#굿즈제작'],
    followers: 24500,
    supporters: 342,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      chzzk: 'https://chzzk.naver.com'
    },
    fundingGoal: {
      title: '2026 봄 코스프레 화보집 & 굿즈 제작 펀딩',
      currentCarrots: 8450,
      targetCarrots: 10000,
      endDate: '2026. 10. 31'
    },
    bankInfo: {
      bank: '토스뱅크',
      account: '1000-1234-5678',
      holder: '루나'
    },
    voiceReward: {
      title: '루나의 10월 감사 보이스 노트',
      duration: '0:18',
      message: '항상 곁에서 묵묵히 응원해 주셔서 진심으로 고마워요! 이번 화보집도 온 마음을 다해 준비할게요.'
    },
    secretPhotos: [
      {
        id: 1,
        title: '가을 핑크 로리타 미공개 B컷 #01',
        url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80',
        date: '10월 12일',
        tierRequired: '다이아 래빗 이상'
      },
      {
        id: 2,
        title: '작업실 새벽 드로잉 비하인드 #02',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        date: '10월 08일',
        tierRequired: '다이아 래빗 이상'
      }
    ]
  },
  {
    id: 'mochi_cos',
    handle: '@Mochi_Cos',
    name: '모치 (Mochi)',
    category: '프로 코스튬 플레이어',
    bio: '좋아하는 게임 & 애니메이션 캐릭터를 코스프레합니다. 후원해 주시는 분들께 매달 디지털 미공개 화보 팩을 선물해 드려요 📸',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    tags: ['#코스프레', '#게임코스어', '#서브컬처', '#화보촬영'],
    followers: 18200,
    supporters: 215,
    sns: {
      instagram: 'https://instagram.com',
      twitter: 'https://twitter.com'
    },
    fundingGoal: {
      title: '지스타(G-STAR) 메인 코스프레 의상 제작비 펀딩',
      currentCarrots: 4200,
      targetCarrots: 8000,
      endDate: '2026. 11. 10'
    },
    bankInfo: {
      bank: '카카오뱅크',
      account: '3333-01-9988776',
      holder: '모치'
    },
    voiceReward: {
      title: '모치의 지스타 응원 감사 음성 메모',
      duration: '0:15',
      message: '지스타 현장에서 만나면 꼭 인사 나눠요! 항상 큰 힘이 되어주셔서 감사합니다.'
    },
    secretPhotos: [
      {
        id: 11,
        title: '신작 게임 캐릭터 스튜디오 조명 A컷',
        url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        date: '10월 11일',
        tierRequired: '골드 래빗 이상'
      }
    ]
  },
  {
    id: 'chibi_artist',
    handle: '@Chibi_Artist',
    name: '치비 (Chibi)',
    category: 'SD 캐릭터 & 이모티콘 작가',
    bio: '귀여운 말랑 토끼 캐릭터와 일상 툰을 그립니다 🐰 매달 후원 랭킹 1위 서포터님께 커스텀 SD 프로필 일러스트를 그려드려요!',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    tags: ['#SD캐릭터', '#이모티콘', '#웹툰', '#캐릭터디자인'],
    followers: 12900,
    supporters: 180,
    sns: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com'
    },
    fundingGoal: {
      title: '2026 말랑 토끼 탁상 캘린더 & 스티커팩 인쇄',
      currentCarrots: 6500,
      targetCarrots: 6000,
      endDate: '2026. 10. 25'
    },
    bankInfo: {
      bank: '신한은행',
      account: '110-345-678901',
      holder: '치비'
    },
    voiceReward: {
      title: '치비의 귀여운 응원 보이스',
      duration: '0:12',
      message: '오늘 하루도 정말 고생 많으셨어요! 말랑 토끼가 항상 응원할게요.'
    },
    secretPhotos: [
      {
        id: 21,
        title: '2026 캘린더 미공개 표지 러프 스케치',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        date: '10월 09일',
        tierRequired: '실버 래빗 이상'
      }
    ]
  },
  {
    id: 'neon_vibe',
    handle: '@Neon_Vibe',
    name: '네온 바이브',
    category: 'Lo-Fi 작곡 & 비트메이커',
    bio: '새벽 감성 Lo-Fi & 신스웨이브 음악을 작곡합니다. 후원자 전원에게 매주 미공개 음원 데모 트랙을 보내드려요 🎧',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    tags: ['#로파이', '#작곡', '#비트메이커', '#신스웨이브'],
    followers: 31400,
    supporters: 389,
    sns: {
      youtube: 'https://youtube.com',
      twitter: 'https://twitter.com'
    },
    fundingGoal: {
      title: '첫 정규 바이닐(LP) 한정판 프레싱 펀딩',
      currentCarrots: 9800,
      targetCarrots: 12000,
      endDate: '2026. 11. 20'
    },
    bankInfo: {
      bank: '국민은행',
      account: '234502-04-123456',
      holder: '네온바이브'
    },
    voiceReward: {
      title: 'LP 제작 비하인드 코멘터리 트랙',
      duration: '0:25',
      message: 'LP 믹싱 작업 중 가장 마음에 드는 아날로그 질감 트랙을 먼저 들려드립니다.'
    },
    secretPhotos: [
      {
        id: 31,
        title: '아날로그 신디사이저 홈스튜디오 작업실 컷',
        url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
        date: '10월 05일',
        tierRequired: '골드 래빗 이상'
      }
    ]
  }
];

// Helper: Get Creators from LocalStorage or Default
export function getStoredCreators() {
  try {
    const raw = localStorage.getItem('mimibit_creators');
    if (!raw) {
      localStorage.setItem('mimibit_creators', JSON.stringify(DEFAULT_CREATORS));
      return DEFAULT_CREATORS;
    }
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length > 0 ? list : DEFAULT_CREATORS;
  } catch (e) {
    return DEFAULT_CREATORS;
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
      localStorage.setItem('mimibit_auth_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn('[API] Backend login failed:', err.message);
    throw err;
  }
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
      localStorage.setItem('mimibit_auth_user', JSON.stringify(data.user));
    }
    return data;
  } catch (err) {
    console.warn('[API] Update profile failed:', err);
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



