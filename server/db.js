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
      id: "luna_rabbit",
      handle: "@Luna_Rabbit",
      name: "Luna Rabbit (루나)",
      category: "일러스트 & 서브컬처 코스어",
      bio: "주말마다 감성 포토와 드로잉 일상을 공유해요! 따뜻한 커피 한 잔과 당근 후원은 창작 활동에 가장 큰 힘이 됩니다 🥕✨",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      tags: ["#일러스트", "#코스어", "#서브컬처", "#굿즈제작"],
      followers: 24500,
      supporters: 0,
      totalCarrots: 0,
      sns: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com",
        youtube: "https://youtube.com"
      },
      fundingGoal: {
        title: "2026 봄 코스프레 화보집 & 굿즈 제작 펀딩",
        currentCarrots: 0,
        targetCarrots: 10000,
        endDate: "2026. 12. 31",
        dDay: "D-74"
      },
      bankInfo: {
        bank: "토스뱅크",
        account: "1000-1234-5678",
        holder: "루나"
      },
      voiceReward: {
        title: "10월 서포터 감사 보이스 리워드",
        duration: "0:15",
        message: "따뜻한 응원 감사드려요! 여러분의 응원 덕분에 오늘도 힘내서 그림을 그립니다 🥕💕"
      },
      secretPhotos: [
        {
          id: 1,
          title: "가을 코스프레 화보 미공개 비하인드 컷",
          url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
          date: "10월 18일",
          tierRequired: "다이아 래빗 이상"
        }
      ],
      createdAt: "2026-10-18T00:00:00.000Z"
    },
    {
      id: "mochi_cos",
      handle: "@Mochi_Cos",
      name: "모치 (Mochi)",
      category: "코스프레 & 화보 일상",
      bio: "서브컬처 코스프레 의상 제작과 화보 촬영 일상을 전합니다. 항상 곁에서 응원해주시는 팬분들 사랑해요 💖",
      avatar: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      tags: ["#코스프레", "#의상제작", "#미공개화보"],
      followers: 31200,
      supporters: 0,
      totalCarrots: 0,
      sns: {
        instagram: "https://instagram.com",
        twitter: "https://twitter.com"
      },
      fundingGoal: {
        title: "겨울 시즌 한정 코스프레 사진집 제작",
        currentCarrots: 0,
        targetCarrots: 8000,
        endDate: "2026. 12. 15",
        dDay: "D-58"
      },
      bankInfo: {
        bank: "카카오뱅크",
        account: "3333-01-9876543",
        holder: "모치"
      },
      voiceReward: {
        title: "모치의 1:1 감사 음성 메시지",
        duration: "0:12",
        message: "소중한 후원 진심으로 감사드려요! 더 멋진 의상과 퀄리티로 보답할게요 🥰"
      },
      secretPhotos: [
        {
          id: 1,
          title: "촬영장 대기실 셀카 미공개 B컷",
          url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80",
          date: "10월 18일",
          tierRequired: "골드 래빗 이상"
        }
      ],
      createdAt: "2026-10-18T00:00:00.000Z"
    },
    {
      id: "chibi_artist",
      handle: "@Chibi_Artist",
      name: "치비 스케치",
      category: "SD 캐릭터 & 인스타툰",
      bio: "귀여운 SD 캐릭터 드로잉과 일상툰을 그립니다! 매주 월/목 새로운 만화가 연재돼요 🎨",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      tags: ["#SD캐릭터", "#인스타툰", "#스티커굿즈"],
      followers: 18400,
      supporters: 0,
      totalCarrots: 0,
      sns: {
        instagram: "https://instagram.com"
      },
      fundingGoal: {
        title: "치비 스티커팩 & 아크릴 키링 굿즈 펀딩",
        currentCarrots: 0,
        targetCarrots: 6000,
        endDate: "2026. 11. 30",
        dDay: "D-43"
      },
      bankInfo: {
        bank: "신한은행",
        account: "110-345-678901",
        holder: "치비스케치"
      },
      voiceReward: {
        title: "치비의 귀여운 응원 보이스",
        duration: "0:10",
        message: "오늘 하루도 너무 수고 많으셨어요! 치비 그림 보고 행복한 밤 되세요 ✨"
      },
      secretPhotos: [],
      createdAt: "2026-10-18T00:00:00.000Z"
    },
    {
      id: "neon_vibe",
      handle: "@Neon_Vibe",
      name: "네온 바이브",
      category: "Lo-Fi 작곡 & 숏폼 일상",
      bio: "새벽에 편안하게 들을 수 있는 감성 Lo-Fi 비트를 만듭니다. 음악을 사랑하는 모든 분들을 환영해요 🎧",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      tags: ["#LoFi", "#비트메이커", "#새벽감성"],
      followers: 12900,
      supporters: 0,
      totalCarrots: 0,
      sns: {
        youtube: "https://youtube.com",
        spotify: "https://spotify.com"
      },
      fundingGoal: {
        title: "새벽 감성 2집 디지털 EP 앨범 펀딩",
        currentCarrots: 0,
        targetCarrots: 5000,
        endDate: "2026. 11. 30",
        dDay: "D-43"
      },
      bankInfo: {
        bank: "토스뱅크",
        account: "1000-5555-7777",
        holder: "네온바이브"
      },
      voiceReward: {
        title: "네온 바이브의 작업실 코멘터리",
        duration: "0:20",
        message: "새로운 비트 작업을 시작했습니다. 후원자 여러분들께 가장 먼저 데모 트랙을 공유할게요!"
      },
      secretPhotos: [],
      createdAt: "2026-10-18T00:00:00.000Z"
    }
  ],
  donations: [],
  charges: [],
  bankTransfers: [],
  payouts: [],
  messages: [],
  users: [
    {
      id: "usr_admin_root",
      email: "zeze1.sec@gmail.com",
      name: "root",
      handle: "root",
      role: "admin",
      passwordHash: "64e72bbff787049047debb40d09ee9fc735934246caaae896e3bda363c4ca6d3",
      salt: "53100712c9388c2aaeb09d74426ed1ec",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      carrotsBalance: 999999,
      tickets: 999,
      createdAt: "2026-10-17T16:28:59.697Z"
    }
  ]
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
