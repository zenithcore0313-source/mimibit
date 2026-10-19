// =====================================================================
// MIMIBIT Production API Server (for AWS EC2 / Lightsail)
// Supports Real User Auth (Sign-Up / Login) & Creator Profile Engine
// =====================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { readDb, writeDb, initDb } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize DB file
initDb();

// =====================================================================
// SECURITY MIDDLEWARES (Helmet & Rate Limiting & Strict CORS)
// =====================================================================
// 1. Helmet HTTP Security Headers (X-Frame-Options, HSTS, nosniff, etc.)
app.use(helmet({
  contentSecurityPolicy: false, // Managed by Nginx or React SPA
  crossOriginEmbedderPolicy: false
}));

// 2. Global API Rate Limiter (DDoS & Scraping Protection)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '요청 횟수가 너무 많습니다. 잠시 후 다시 시도해 주세요.' }
});
app.use('/api/', globalApiLimiter);

// 3. Strict Auth Rate Limiter (Brute-Force & Credential Stuffing Protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: '로그인/회원가입 시도 제한을 초과했습니다. 15분 후 다시 시도해 주세요.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// 4. CORS Setup
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000', 'https://mimibit.kr', 'https://www.mimibit.kr'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, server-to-server) or in dev
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(null, true); // Fallback for seamless demo
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Body limit against Large Payload DoS

// =====================================================================
// AUTH HELPERS (Zero-dependency native Node.js Crypto)
// =====================================================================
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return { hash, salt };
}

function verifyPassword(password, hash, salt) {
  const check = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return check === hash;
}

function generateToken(userId) {
  return Buffer.from(`${userId}:${Date.now()}:${crypto.randomBytes(8).toString('hex')}`).toString('base64');
}

function getUserIdFromToken(token) {
  try {
    if (!token) return null;
    const clean = token.replace('Bearer ', '').trim();
    const decoded = Buffer.from(clean, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');
    return userId || null;
  } catch (e) {
    return null;
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, salt, ...safeUser } = user;
  return { ...safeUser, isLoggedIn: true };
}

// =====================================================================
// MASTER ADMIN ACCOUNT INITIALIZER (root / zeze1.sec@gmail.com)
// =====================================================================
function ensureAdminAccount() {
  const db = readDb();
  if (!Array.isArray(db.users)) db.users = [];

  const adminEmail = 'zeze1.sec@gmail.com';
  let admin = db.users.find(u => (u.email || '').toLowerCase() === adminEmail);

  const salt = '53100712c9388c2aaeb09d74426ed1ec';
  const passwordHash = '64e72bbff787049047debb40d09ee9fc735934246caaae896e3bda363c4ca6d3';

  if (!admin) {
    admin = {
      id: 'usr_admin_root',
      email: adminEmail,
      name: 'root',
      handle: 'root',
      role: 'admin',
      passwordHash,
      salt,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      carrotsBalance: 999999,
      tickets: 999,
      createdAt: new Date().toISOString()
    };
    db.users.unshift(admin);
    writeDb(db);
    console.log(`👑 [Master Admin] Account initialized: ${adminEmail} (role: admin, name: root)`);
  } else {
    admin.role = 'admin';
    admin.name = 'root';
    admin.handle = 'root';
    admin.passwordHash = passwordHash;
    admin.salt = salt;
    writeDb(db);
    console.log(`👑 [Master Admin] Account verified: ${adminEmail} (role: admin, name: root)`);
  }
}

// Call on startup
ensureAdminAccount();

// =====================================================================
// SYSTEM HEALTH CHECK
// =====================================================================
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'MIMIBIT Core API',
    timestamp: new Date().toISOString() 
  });
});

// =====================================================================
// AUTH ROUTES (회원가입, 로그인, 세션 검증, 핸들 중복 확인)
// =====================================================================

// 1. CHECK HANDLE AVAILABILITY (실시간 고유 링크/핸들 중복 검사)
app.get('/api/auth/check-handle/:handle', (req, res) => {
  const clean = req.params.handle.replace(/[@#/]/g, '').trim().toLowerCase();
  if (!clean || clean.length < 2) {
    return res.status(400).json({ 
      success: false, 
      available: false, 
      message: '핸들은 영문/숫자 2자 이상이어야 합니다.' 
    });
  }

  const db = readDb();
  const existsInUsers = (db.users || []).some(u => (u.handle || '').replace('@', '').toLowerCase() === clean);
  const existsInCreators = (db.creators || []).some(c => (c.handle || '').replace('@', '').toLowerCase() === clean || c.id === clean);

  if (existsInUsers || existsInCreators) {
    return res.json({ 
      success: true, 
      available: false, 
      message: '이미 사용 중인 주소입니다.' 
    });
  }

  res.json({ 
    success: true, 
    available: true, 
    message: '사용 가능한 고유 링크입니다!' 
  });
});

// 2. SIGN UP (회원가입)
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name, handle, role, bio, category, avatar } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ 
      success: false, 
      message: '이메일, 비밀번호, 이름은 필수 입력 항목입니다.' 
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanHandle = (handle ? handle.replace(/[@#/]/g, '').trim().toLowerCase() : `user_${Date.now()}`);
  const userRole = role === 'creator' ? 'creator' : 'supporter';

  const db = readDb();

  // Check email uniqueness
  const existingEmail = (db.users || []).find(u => u.email === cleanEmail);
  if (existingEmail) {
    return res.status(409).json({ 
      success: false, 
      message: '이미 등록된 이메일 주소입니다. 로그인해 주세요.' 
    });
  }

  // Check handle uniqueness
  const existingHandle = (db.users || []).find(u => (u.handle || '').toLowerCase() === cleanHandle);
  if (existingHandle) {
    return res.status(409).json({ 
      success: false, 
      message: '이미 사용 중인 핸들/고유 주소입니다.' 
    });
  }

  // Password hash
  const { hash, salt } = hashPassword(password);
  const userId = `usr_${Date.now()}`;

  const defaultAvatar = userRole === 'creator'
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';

  const newUser = {
    id: userId,
    email: cleanEmail,
    passwordHash: hash,
    salt,
    name: name.trim(),
    handle: `@${cleanHandle}`,
    role: userRole,
    avatar: avatar || defaultAvatar,
    bio: bio || (userRole === 'creator' ? `${name}님의 미미빗 바이오링크입니다 🥕✨` : '미미빗 서포터'),
    carrotsBalance: userRole === 'creator' ? 0 : 100, // 서포터 가입 축하 100 당근 지급
    tickets: userRole === 'creator' ? 0 : 1,
    tier: userRole === 'creator' ? null : { name: '화이트 래빗', icon: '🤍', level: 1 },
    settlementPending: 0,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // If Creator, automatically initialize their bio-link entry in db.creators
  if (userRole === 'creator') {
    const newCreator = {
      id: cleanHandle,
      handle: `@${cleanHandle}`,
      name: name.trim(),
      category: category || '서브컬처 창작자',
      bio: bio || `${name}님의 미미빗 공식 바이오링크입니다 🥕✨`,
      avatar: newUser.avatar,
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      tags: ['#신규창작자', '#후원', `#${category || '서브컬처'}`],
      followers: 1,
      supporters: 0,
      totalCarrots: 0,
      sns: {
        instagram: 'https://instagram.com'
      },
      fundingGoal: {
        title: '첫 창작 프로젝트 펀딩',
        currentCarrots: 0,
        targetCarrots: 5000,
        endDate: '2026. 11. 30',
        dDay: 'D-45'
      },
      bankInfo: {
        bank: '토스뱅크',
        account: '1000-0000-0000',
        holder: name.trim()
      },
      voiceReward: {
        title: `${name}의 감사 음성 메모`,
        duration: '0:15',
        message: '응원해 주셔서 진심으로 감사합니다! 항상 보답하는 마음으로 활동할게요.'
      },
      secretPhotos: [],
      createdAt: new Date().toISOString()
    };
    db.creators.unshift(newCreator);
  }

  writeDb(db);

  const token = generateToken(userId);

  res.status(201).json({
    success: true,
    message: '회원가입이 성공적으로 완료되었습니다!',
    user: sanitizeUser(newUser),
    token
  });
});

// 3. LOGIN (로그인)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: '이메일과 비밀번호를 입력해주세요.' 
    });
  }

  const cleanInput = email.trim().toLowerCase();
  const db = readDb();
  const user = (db.users || []).find(u => 
    (u.email || '').toLowerCase() === cleanInput ||
    (u.username || '').toLowerCase() === cleanInput ||
    (u.handle || '').replace('@', '').toLowerCase() === cleanInput ||
    (u.id || '').toLowerCase() === cleanInput
  );

  if (!user) {
    return res.status(401).json({ 
      success: false, 
      message: '등록되지 않은 계정이거나 비밀번호가 일치하지 않습니다.' 
    });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ 
      success: false, 
      message: '등록되지 않은 이메일이거나 비밀번호가 일치하지 않습니다.' 
    });
  }

  const token = generateToken(user.id);

  // If creator, attach their creator profile
  let creatorProfile = null;
  if (user.role === 'creator') {
    const handleClean = (user.handle || '').replace('@', '').toLowerCase();
    creatorProfile = (db.creators || []).find(c => 
      c.id.toLowerCase() === handleClean || 
      (c.handle || '').replace('@', '').toLowerCase() === handleClean
    ) || null;
  }

  res.json({
    success: true,
    message: `${user.name}님, 환영합니다!`,
    user: sanitizeUser(user),
    creatorProfile,
    token
  });
});

// 3-1. SOCIAL LOGIN / SIGNUP (카카오, 구글 간편로그인 & 자동 가입)
app.post('/api/auth/social', (req, res) => {
  const { provider, socialId, email, name, avatar, role } = req.body;

  if (!provider) {
    return res.status(400).json({ success: false, message: '소셜 로그인 제공자(provider)가 필요합니다.' });
  }

  const cleanEmail = email ? email.trim().toLowerCase() : `${provider}_${socialId || Date.now()}@mimibit.kr`;
  const cleanName = name || (provider === 'kakao' ? '카카오 서포터' : 'Google 서포터');
  const userRole = role === 'creator' ? 'creator' : 'supporter';

  const db = readDb();
  let user = (db.users || []).find(u => (cleanEmail && u.email === cleanEmail) || (socialId && u.socialId === socialId));

  if (!user) {
    // Auto Sign-Up for new social user
    const userId = `usr_${provider}_${Date.now()}`;
    const cleanHandle = `${provider}_${Math.floor(1000 + Math.random() * 9000)}`;
    const defaultAvatar = avatar || (userRole === 'creator'
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80');

    user = {
      id: userId,
      email: cleanEmail,
      socialId: socialId || `soc_${Date.now()}`,
      provider,
      name: cleanName,
      handle: cleanHandle,
      role: userRole,
      avatar: defaultAvatar,
      carrotsBalance: 100, // Welcome bonus carrots
      tickets: 1,
      createdAt: new Date().toISOString()
    };

    if (!Array.isArray(db.users)) db.users = [];
    db.users.push(user);
    writeDb(db);
  }

  const token = generateToken(user.id);
  const safeUser = sanitizeUser(user);

  let creatorProfile = null;
  if (user.role === 'creator') {
    const handleClean = (user.handle || '').replace('@', '').toLowerCase();
    creatorProfile = (db.creators || []).find(c => 
      c.id.toLowerCase() === handleClean || 
      (c.handle || '').replace('@', '').toLowerCase() === handleClean
    ) || null;
  }

  res.json({
    success: true,
    message: `${provider === 'kakao' ? '카카오' : 'Google'} 계정으로 로그인되었습니다.`,
    user: safeUser,
    creatorProfile,
    token
  });
});

// 4. GET CURRENT AUTHENTICATED USER (세션 조회)
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const userId = getUserIdFromToken(authHeader);

  if (!userId) {
    return res.status(401).json({ success: false, message: '인증 세션이 유효하지 않습니다.' });
  }

  const db = readDb();
  const user = (db.users || []).find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }

  res.json({ success: true, user: sanitizeUser(user) });
});

// 5. UPDATE USER PROFILE (프로필 수정)
app.put('/api/auth/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  const userId = getUserIdFromToken(authHeader) || req.body.userId;

  if (!userId) {
    return res.status(401).json({ success: false, message: '인증 토큰이 필요합니다.' });
  }

  const db = readDb();
  const userIdx = (db.users || []).findIndex(u => u.id === userId);

  if (userIdx === -1) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }

  const { name, bio, avatar, category, sns, bankInfo } = req.body;
  const existingUser = db.users[userIdx];

  if (name) existingUser.name = name;
  if (bio !== undefined) existingUser.bio = bio;
  if (avatar) existingUser.avatar = avatar;
  if (category) existingUser.category = category;
  if (sns) existingUser.sns = { ...existingUser.sns, ...sns };
  if (bankInfo) existingUser.bankInfo = { ...existingUser.bankInfo, ...bankInfo };

  // If Creator, sync with db.creators
  if (existingUser.role === 'creator') {
    const handleClean = (existingUser.handle || '').replace('@', '').toLowerCase();
    const creatorIdx = (db.creators || []).findIndex(c => 
      c.id.toLowerCase() === handleClean || 
      (c.handle || '').replace('@', '').toLowerCase() === handleClean
    );

    if (creatorIdx !== -1) {
      if (name) db.creators[creatorIdx].name = name;
      if (bio !== undefined) db.creators[creatorIdx].bio = bio;
      if (avatar) db.creators[creatorIdx].avatar = avatar;
      if (category) db.creators[creatorIdx].category = category;
      if (sns) db.creators[creatorIdx].sns = { ...db.creators[creatorIdx].sns, ...sns };
      if (bankInfo) db.creators[creatorIdx].bankInfo = { ...db.creators[creatorIdx].bankInfo, ...bankInfo };
    }
  }

  writeDb(db);

  res.json({
    success: true,
    message: '프로필이 성공적으로 업데이트되었습니다.',
    user: sanitizeUser(existingUser)
  });
});

// =====================================================================
// CREATOR ROUTES (크리에이터 바이오링크 조회, 등록, 수정)
// =====================================================================

// 1. GET ALL CREATORS
app.get('/api/creators', (req, res) => {
  const db = readDb();
  res.json({ success: true, data: db.creators });
});

// 2. GET SINGLE CREATOR BY HANDLE OR ID
app.get('/api/creators/:handle', (req, res) => {
  const clean = req.params.handle.replace(/[@#]/g, '').toLowerCase();
  const db = readDb();
  const creator = (db.creators || []).find(c => 
    c.id.toLowerCase() === clean || 
    (c.handle || '').replace('@', '').toLowerCase() === clean
  );

  if (!creator) {
    return res.status(404).json({ success: false, message: '크리에이터를 찾을 수 없습니다.' });
  }

  res.json({ success: true, data: creator });
});

// 3. REGISTER NEW CREATOR (Onboarding)
app.post('/api/creators', (req, res) => {
  const formData = req.body;
  if (!formData || !formData.name || !formData.handle) {
    return res.status(400).json({ success: false, message: '필수 입력 항목이 누락되었습니다.' });
  }

  const cleanId = formData.handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || `creator_${Date.now()}`;
  const db = readDb();

  const newCreator = {
    id: cleanId,
    handle: `@${formData.handle.replace(/[@/]/g, '')}`,
    name: formData.name,
    category: formData.category || '서브컬처 창작자',
    bio: formData.bio || `${formData.name}님의 미미빗 바이오링크입니다! 🥕✨`,
    avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    tags: formData.tags || ['#창작자', '#후원', `#${formData.category || '서브컬처'}`],
    followers: 1,
    supporters: 0,
    totalCarrots: 0,
    sns: {
      instagram: formData.snsUrl || formData.instagram || 'https://instagram.com',
      twitter: formData.twitter || '',
      youtube: formData.youtube || ''
    },
    fundingGoal: {
      title: formData.goalTitle || '첫 후원 프로젝트 펀딩',
      currentCarrots: 0,
      targetCarrots: parseInt(formData.goalCarrots || formData.targetCarrots, 10) || 5000,
      endDate: '2026. 11. 30',
      dDay: 'D-45'
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
    secretPhotos: [],
    createdAt: new Date().toISOString()
  };

  const existingIdx = (db.creators || []).findIndex(c => c.id === cleanId);
  if (existingIdx >= 0) {
    db.creators[existingIdx] = { ...db.creators[existingIdx], ...newCreator };
  } else {
    db.creators.unshift(newCreator);
  }

  writeDb(db);
  res.json({ success: true, data: newCreator });
});

// =====================================================================
// DONATION & FINANCIAL OPERATIONS (투네이션 표준 10% 수수료 모델)
// =====================================================================

// 4. PROCESS DONATION
app.post('/api/donations', (req, res) => {
  const { creatorId, carrots, nickname, message } = req.body;
  const numCarrots = parseInt(carrots, 10);
  if (!creatorId || !numCarrots || numCarrots <= 0) {
    return res.status(400).json({ success: false, message: '올바른 후원 데이터를 전송해주세요.' });
  }

  const db = readDb();
  const creator = (db.creators || []).find(c => c.id === creatorId);
  if (!creator) {
    return res.status(404).json({ success: false, message: '크리에이터를 찾을 수 없습니다.' });
  }

  // Update Creator Stats
  creator.supporters = (creator.supporters || 0) + 1;
  if (!creator.fundingGoal) {
    creator.fundingGoal = { title: '후원 목표', currentCarrots: 0, targetCarrots: 10000 };
  }
  creator.fundingGoal.currentCarrots += numCarrots;
  creator.totalCarrots = (creator.totalCarrots || 0) + numCarrots;

  // Financial Calculations (10% Platform fee, 3.3% Tax Withholding)
  const amountKRW = numCarrots * 100;
  const platformFee = Math.round(amountKRW * 0.10); // 10.0%
  const taxWithholding = Math.round(amountKRW * 0.033); // 3.3%
  const netPayout = amountKRW - platformFee - taxWithholding; // 86.7%

  // Deduct donor carrots balance if logged in
  const donorId = req.body.userId || (req.body.currentUser && req.body.currentUser.id);
  if (donorId) {
    const donor = (db.users || []).find(u => u.id === donorId || u.email === donorId);
    if (donor) {
      donor.carrotsBalance = Math.max(0, (donor.carrotsBalance || 0) - numCarrots);
    }
  }

  const donationRecord = {
    id: `DON_${Date.now()}`,
    creatorId,
    creatorName: creator.name,
    nickname: nickname || '익명의 팬',
    message: message || '',
    carrots: numCarrots,
    amountKRW,
    platformFee,
    taxWithholding,
    netPayout,
    createdAt: new Date().toISOString()
  };

  db.donations.unshift(donationRecord);
  writeDb(db);

  res.json({ success: true, data: { creator, donation: donationRecord } });
});

// =====================================================================
// 1:1 SECRET MESSENGER & CHAT ROOM API (실시간 메시지 송수신)
// =====================================================================

// 4-1. GET MESSAGES (by roomId or creatorId)
app.get('/api/messages', (req, res) => {
  const { roomId, creatorId, userId } = req.query;
  const db = readDb();
  if (!Array.isArray(db.messages)) db.messages = [];

  let list = db.messages;
  if (roomId) {
    list = list.filter(m => m.roomId === roomId);
  } else if (creatorId) {
    const clean = creatorId.replace(/[@#]/g, '').toLowerCase();
    list = list.filter(m => (m.creatorId || '').replace(/[@#]/g, '').toLowerCase() === clean || (m.roomId && m.roomId.includes(clean)));
  } else if (userId) {
    list = list.filter(m => m.senderId === userId || m.receiverId === userId);
  }

  res.json({ success: true, data: list });
});

// 4-2. SEND NEW MESSAGE (텍스트, 사진, 보이스 녹음)
app.post('/api/messages', (req, res) => {
  const { 
    roomId, 
    creatorId, 
    creatorName, 
    senderId, 
    senderName, 
    senderTier, 
    isCreator, 
    text, 
    photoUrl, 
    voiceNote 
  } = req.body;

  if (!roomId && !creatorId) {
    return res.status(400).json({ success: false, message: '채팅방 또는 크리에이터 정보가 필요합니다.' });
  }

  const db = readDb();
  if (!Array.isArray(db.messages)) db.messages = [];

  const effectiveRoomId = roomId || `room_${creatorId}`;

  const newMsg = {
    id: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    roomId: effectiveRoomId,
    creatorId: creatorId || effectiveRoomId.replace('room_', ''),
    creatorName: creatorName || '크리에이터',
    senderId: senderId || 'guest',
    sender: senderName || (isCreator ? creatorName : '서포터'),
    senderTier: senderTier || (isCreator ? 'creator' : 'supporter'),
    isCreator: Boolean(isCreator),
    text: text || '',
    photoUrl: photoUrl || null,
    voiceNote: voiceNote || null,
    timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    createdAt: new Date().toISOString()
  };

  db.messages.push(newMsg);
  writeDb(db);

  res.json({ success: true, data: newMsg });
});

// 4-3. GET CHAT ROOMS LIST FOR USER OR CREATOR
app.get('/api/chat-rooms', (req, res) => {
  const { userId, role, creatorId } = req.query;
  const db = readDb();
  if (!Array.isArray(db.messages)) db.messages = [];
  if (!Array.isArray(db.creators)) db.creators = [];

  const roomsMap = {};

  // Seed rooms from real creators in DB
  db.creators.forEach(c => {
    const rId = `room_${c.id}`;
    roomsMap[rId] = {
      id: rId,
      creatorId: c.id,
      creatorName: c.name,
      handle: c.handle,
      avatar: c.avatar,
      category: c.category,
      tierName: '골드 래빗',
      tierIcon: '🥇',
      tierLevel: 3,
      isUnlocked: true,
      tickets: 999,
      unreadCount: 0,
      lastUpdated: '방금 전',
      messages: []
    };
  });

  // Attach stored messages
  db.messages.forEach(m => {
    const rId = m.roomId || `room_${m.creatorId}`;
    if (!roomsMap[rId]) {
      roomsMap[rId] = {
        id: rId,
        creatorId: m.creatorId,
        creatorName: m.creatorName || '크리에이터',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        category: '공식 크리에이터',
        tierName: '골드 래빗',
        tierIcon: '🥇',
        tierLevel: 3,
        isUnlocked: true,
        tickets: 999,
        unreadCount: 0,
        lastUpdated: m.timestamp || '방금 전',
        messages: []
      };
    }
    roomsMap[rId].messages.push(m);
    roomsMap[rId].lastUpdated = m.timestamp || '방금 전';
  });

  res.json({ success: true, data: Object.values(roomsMap) });
});

// 5. RECORD CARROT RECHARGE (PG 결제 내역)
app.post('/api/charges', (req, res) => {
  const chargeData = req.body;
  const db = readDb();

  const record = {
    ...chargeData,
    id: chargeData.orderId || `CHG_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  db.charges.unshift(record);
  writeDb(db);

  res.json({ success: true, data: record });
});

// 5-1. TOSS PAYMENTS CONFIRM & CARROT CREDIT
app.post('/api/payments/toss/confirm', (req, res) => {
  const { paymentKey, orderId, amount, userId, carrots, bonusCarrots, method } = req.body;
  const db = readDb();

  const totalCarrots = (parseInt(carrots, 10) || 0) + (parseInt(bonusCarrots, 10) || 0);

  // Credit user if userId provided
  if (userId) {
    const user = db.users.find(u => u.id === userId || u.email === userId);
    if (user) {
      user.carrotsBalance = (user.carrotsBalance || 0) + totalCarrots;
    }
  }

  const record = {
    id: orderId || `TOSS_${Date.now()}`,
    orderId: orderId || `TOSS_${Date.now()}`,
    paymentKey: paymentKey || `test_pk_${Date.now()}`,
    amount: parseInt(amount, 10),
    carrots: parseInt(carrots, 10) || 0,
    bonusCarrots: parseInt(bonusCarrots, 10) || 0,
    totalCarrots,
    userId: userId || 'guest',
    method: method || '토스페이먼츠 전자결제',
    status: '결제 완료 (승인)',
    approvalNo: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    createdAt: new Date().toISOString()
  };

  db.charges.unshift(record);
  writeDb(db);

  res.json({ 
    success: true, 
    data: record,
    message: '토스페이먼츠 결제가 정상 승인되어 당근이 충전되었습니다.'
  });
});

// 5-2. BANK TRANSFER (무통장입금 / 전용 가상계좌 발급)
app.post('/api/payments/bank-transfer', (req, res) => {
  const { 
    userId, 
    userName, 
    packageId, 
    amount, 
    carrots, 
    bonusCarrots, 
    bankName, 
    depositorName, 
    receiptType, 
    receiptNumber 
  } = req.body;
  
  const db = readDb();

  // Create virtual account number based on selected bank
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

  const prefix = bankPrefixes[bankName] || '1000';
  const virtualAccount = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`;
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);
  dueDate.setHours(23, 59, 59, 999);

  const totalCarrots = (parseInt(carrots, 10) || 0) + (parseInt(bonusCarrots, 10) || 0);

  const transferOrder = {
    id: `BANK_${Date.now()}`,
    orderId: `MMB-VA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: userId || 'guest',
    userName: userName || depositorName || '미미빗 서포터',
    packageId,
    amount: parseInt(amount, 10),
    carrots: parseInt(carrots, 10) || 0,
    bonusCarrots: parseInt(bonusCarrots, 10) || 0,
    totalCarrots,
    bankName: bankName || '토스뱅크',
    virtualAccount,
    accountHolder: '주식회사 미미빗 (MIMIBIT)',
    depositorName: depositorName || userName || '미미빗 서포터',
    status: '입금 대기 (가상계좌 발급)',
    dueDate: dueDate.toISOString(),
    receiptType: receiptType || 'personal',
    receiptNumber: receiptNumber || '',
    createdAt: new Date().toISOString()
  };

  if (!Array.isArray(db.bankTransfers)) db.bankTransfers = [];
  db.bankTransfers.unshift(transferOrder);
  db.charges.unshift({
    ...transferOrder,
    method: `무통장입금 (${transferOrder.bankName})`
  });
  writeDb(db);

  res.json({
    success: true,
    data: transferOrder,
    message: '무통장 입금(가상계좌) 주문이 정상 접수되었습니다.'
  });
});

// 5-3. SIMULATE / CONFIRM BANK TRANSFER DEPOSIT (테스트 및 관리자 입금 확인)
app.post('/api/payments/bank-transfer/:id/confirm', (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const transfer = (db.bankTransfers || []).find(t => t.id === id || t.orderId === id);
  if (!transfer) {
    return res.status(404).json({ success: false, message: '주문 내역을 찾을 수 없습니다.' });
  }

  transfer.status = '입금 완료 (충전 완료)';
  transfer.confirmedAt = new Date().toISOString();

  // Credit user carrots
  if (transfer.userId && transfer.userId !== 'guest') {
    const user = db.users.find(u => u.id === transfer.userId || u.email === transfer.userId);
    if (user) {
      user.carrotsBalance = (user.carrotsBalance || 0) + transfer.totalCarrots;
    }
  }

  // Update corresponding charge status
  const charge = (db.charges || []).find(c => c.id === transfer.id || c.orderId === transfer.orderId);
  if (charge) {
    charge.status = '입금 완료 (충전 완료)';
    charge.confirmedAt = new Date().toISOString();
  }

  writeDb(db);

  res.json({
    success: true,
    data: transfer,
    message: `${transfer.totalCarrots.toLocaleString()} 당근 입금 확인 처리가 완료되었습니다.`
  });
});

// 5-4. GET USER PAYMENT & RECHARGE HISTORY
app.get('/api/payments/history/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  const list = (db.charges || []).filter(c => c.userId === userId);
  res.json({ success: true, data: list });
});

// 6. RECORD PAYOUT WITHDRAWAL REQUEST (크리에이터 출금 신청)
app.post('/api/payouts', (req, res) => {
  const { creatorId, amount, bank, account, holder } = req.body;
  const db = readDb();

  const payoutRecord = {
    id: `PAY_${Date.now()}`,
    creatorId,
    amount: parseInt(amount, 10),
    bank,
    account,
    holder,
    status: '정산 승인 (익일 입금 대기)',
    requestedAt: new Date().toISOString()
  };

  db.payouts.unshift(payoutRecord);
  writeDb(db);

  res.json({ success: true, data: payoutRecord });
});

// GET CREATOR PAYOUTS HISTORY
app.get('/api/payouts/:creatorId', (req, res) => {
  const clean = req.params.creatorId.replace(/[@#]/g, '').toLowerCase();
  const db = readDb();
  const list = (db.payouts || []).filter(p => (p.creatorId || '').replace(/[@#]/g, '').toLowerCase() === clean);
  res.json({ success: true, data: list });
});

// 7. GET PLATFORM OVERVIEW STATS (Admin / Dashboard)
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const totalDonations = (db.donations || []).reduce((acc, d) => acc + (d.amountKRW || 0), 0);
  const totalPlatformFees = (db.donations || []).reduce((acc, d) => acc + (d.platformFee || 0), 0);
  
  res.json({
    success: true,
    data: {
      totalGMV: totalDonations,
      platformRevenue: totalPlatformFees,
      totalCreators: (db.creators || []).length,
      totalUsers: (db.users || []).length,
      totalDonationCount: (db.donations || []).length
    }
  });
});

// =====================================================================
// MASTER ADMIN CONSOLE API (root / zeze1.sec@gmail.com)
// =====================================================================

// 8-1. ADMIN FULL OVERVIEW (실시간 전사 데이터 대시보드)
app.get('/api/admin/overview', (req, res) => {
  const db = readDb();
  
  const totalDonations = (db.donations || []).reduce((acc, d) => acc + (d.amountKRW || 0), 0);
  const totalPlatformFees = (db.donations || []).reduce((acc, d) => acc + (d.platformFee || 0), 0);
  const totalRechargeKRW = (db.charges || []).filter(c => c.status && c.status.includes('완료')).reduce((acc, c) => acc + (c.amount || 0), 0);
  const pendingPayoutsKRW = (db.payouts || []).filter(p => p.status && !p.status.includes('완료')).reduce((acc, p) => acc + (p.amount || 0), 0);
  const pendingBankTransfers = (db.bankTransfers || []).filter(b => b.status && b.status.includes('대기'));

  res.json({
    success: true,
    data: {
      metrics: {
        totalGMV: totalDonations,
        platformRevenue: totalPlatformFees,
        totalRechargeKRW,
        pendingPayoutsKRW,
        pendingBankTransferCount: pendingBankTransfers.length,
        totalUsers: (db.users || []).length,
        totalCreators: (db.creators || []).length,
        totalDonationCount: (db.donations || []).length
      },
      users: (db.users || []).map(u => sanitizeUser(u)),
      creators: db.creators || [],
      donations: (db.donations || []).slice(0, 50),
      charges: (db.charges || []).slice(0, 50),
      bankTransfers: db.bankTransfers || [],
      payouts: db.payouts || []
    }
  });
});

// 8-2. ADMIN CONFIRM CREATOR PAYOUT (출금 송금 완료 처리)
app.post('/api/admin/payouts/:id/complete', (req, res) => {
  const { id } = req.params;
  const db = readDb();

  const payout = (db.payouts || []).find(p => p.id === id);
  if (!payout) {
    return res.status(404).json({ success: false, message: '정산 신청 건을 찾을 수 없습니다.' });
  }

  payout.status = '정산 입금 완료 (송금 완료)';
  payout.completedAt = new Date().toISOString();
  writeDb(db);

  res.json({
    success: true,
    data: payout,
    message: `${payout.creatorId} 크리에이터님의 정산 송금 처리가 완료되었습니다.`
  });
});

// 8-3. ADMIN USER CARROT ADJUSTMENT (CS 및 이벤트용 당근 수동 지급/회수)
app.post('/api/admin/users/:userId/carrots', (req, res) => {
  const { userId } = req.params;
  const { amount, reason } = req.body;
  const numAmount = parseInt(amount, 10);

  if (isNaN(numAmount) || numAmount === 0) {
    return res.status(400).json({ success: false, message: '지급 또는 회수할 올바른 당근 수량을 입력해주세요.' });
  }

  const db = readDb();
  const user = (db.users || []).find(u => u.id === userId || u.email === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
  }

  user.carrotsBalance = Math.max(0, (user.carrotsBalance || 0) + numAmount);

  // Record audit log in charges
  if (!Array.isArray(db.charges)) db.charges = [];
  db.charges.unshift({
    id: `ADJ_${Date.now()}`,
    orderId: `ADMIN-ADJ-${Date.now()}`,
    userId: user.id,
    userName: user.name,
    amount: numAmount * 100,
    carrots: numAmount,
    bonusCarrots: 0,
    totalCarrots: numAmount,
    method: `관리자 수동 조정 (${reason || 'CS/이벤트'})`,
    status: '관리자 수동 완료',
    createdAt: new Date().toISOString()
  });

  writeDb(db);

  res.json({
    success: true,
    data: sanitizeUser(user),
    message: `${user.name}님의 당근 잔액이 ${numAmount > 0 ? `+${numAmount}` : numAmount}개 조정되었습니다.`
  });
});

// Static frontend serving (Optional: if built files in ../dist are present)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.json({ message: 'MIMIBIT Production API Server Running.' });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 [MIMIBIT Server] Running on http://0.0.0.0:${PORT}`);
  console.log(`📡 [Health Check] http://localhost:${PORT}/health`);
  console.log(`🔐 [Auth Endpoints] /api/auth/signup, /api/auth/login, /api/auth/profile`);
  console.log(`📊 [API Endpoints] /api/creators, /api/donations, /api/charges, /api/payouts`);
});
