// =====================================================================
// MIMIBIT Persistent Data Engine (Zero-Config JSON Store)
// Guarantees 0-dependency native compilation issues on AWS Linux
// =====================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const INITIAL_DB = {
  creators: [
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
        message: '항상 곁에서 묵묵히 응원해 주셔서 진심으로 고마워요!'
      }
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
      }
    }
  ],
  donations: [],
  charges: [],
  payouts: [],
  messages: [],
  users: []
};

// Ensure data folder and file exist
export function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
  }
}

export function readDb() {
  initDb();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.users)) parsed.users = [];
    if (!Array.isArray(parsed.creators)) parsed.creators = INITIAL_DB.creators;
    if (!Array.isArray(parsed.donations)) parsed.donations = [];
    if (!Array.isArray(parsed.charges)) parsed.charges = [];
    if (!Array.isArray(parsed.bankTransfers)) parsed.bankTransfers = [];
    if (!Array.isArray(parsed.payouts)) parsed.payouts = [];
    return parsed;
  } catch (err) {
    return INITIAL_DB;
  }
}

export function writeDb(data) {
  initDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}
