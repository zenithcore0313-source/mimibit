// Initial data representing MIMIBIT ecosystem based on IR Pitch Deck

export const RABBIT_TIERS = [
  {
    level: 1,
    id: 'white',
    name: '화이트 래빗',
    enName: 'White Rabbit',
    threshold: 1000,
    carrots: 10,
    badgeColor: '#E2E8F0',
    textColor: '#4A5568',
    icon: '🤍',
    perks: ['첫 후원 환영 배지 부여', '방명록 응원 댓글 작성 권한'],
    ticketCount: 0,
    borderStyle: '1px solid #CBD5E1',
    description: '작은 첫걸음! 루나의 방명록에 첫 응원을 남길 수 있어요.'
  },
  {
    level: 2,
    id: 'silver',
    name: '실버 래빗',
    enName: 'Silver Rabbit',
    threshold: 30000,
    carrots: 300,
    badgeColor: '#CBD5E1',
    textColor: '#FF2E63',
    icon: '🥈',
    perks: ['닉네임 체리 레드 하이라이트', '창작자 전용 감정표현 이모티콘'],
    ticketCount: 0,
    borderStyle: '2px solid #94A3B8',
    description: '눈에 띄는 체리 레드 닉네임과 루나 전용 이모티콘 팩 지급!'
  },
  {
    level: 3,
    id: 'gold',
    name: '골드 래빗',
    enName: 'Gold Rabbit',
    threshold: 100000,
    carrots: 1000,
    badgeColor: '#FEF08A',
    textColor: '#B45309',
    icon: '🥇',
    perks: ['★ 1:1 시크릿 메신저 잠금 해제', '월 5회 소통 메시지 티켓 지급', '프로필 서포터 골드 테두리'],
    ticketCount: 5,
    borderStyle: '2px solid #F59E0B',
    highlight: true,
    description: '★ 핵심 리워드! 창작자와 직접 닿는 1:1 비밀 라운지 해금!'
  },
  {
    level: 4,
    id: 'diamond',
    name: '다이아 래빗',
    enName: 'Diamond Rabbit',
    threshold: 300000,
    carrots: 3000,
    badgeColor: '#BAE6FD',
    textColor: '#0369A1',
    icon: '💎',
    perks: ['월 15회 소통 메시지 티켓 지급', '창작자 미공개 사진 리워드 갤러리 열람', '명예의 전당 Top 5 도전'],
    ticketCount: 15,
    borderStyle: '2px solid #0EA5E9',
    description: '미공개 고화질 화보/스케치 리워드와 넉넉한 15회 티켓!'
  },
  {
    level: 5,
    id: 'royal',
    name: '당근 로열 래빗',
    enName: 'Royal Carrot Rabbit',
    threshold: 500000,
    carrots: 5000,
    badgeColor: '#FFD700',
    textColor: '#78350F',
    icon: '👑',
    perks: ['창작자 단독 감사 보이스 노트 리워드', '메인 골드 왕관 테두리 장착', 'Top 1위 시 단독 전광판 고정 게시'],
    ticketCount: 30,
    borderStyle: '3px solid #F59E0B',
    isRoyal: true,
    description: '최상위 로열 서포터! 루나의 단독 음성 리워드 및 왕관 테두리!'
  }
];

export const INITIAL_CREATOR = {
  id: 'luna_rabbit',
  handle: '@Luna_Rabbit',
  name: 'Luna Rabbit (루나)',
  bio: '일러스트레이터 & 서브컬처 코스어 🎀 주말마다 감성 포토와 드로잉 일상을 공유해요! 따뜻한 커피 한 잔과 당근 후원은 큰 힘이 됩니다 🥕✨',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  tags: ['#일러스트', '#코스어', '#마이크로팬덤', '#서브컬처'],
  followerCount: '24.5K',
  postCount: '128',
  fundingGoal: {
    title: '🎀 루나의 2026 봄 코스프레 화보집 & 굿즈 제작 펀딩',
    currentCarrots: 0,
    targetCarrots: 10000,
    endDate: '2026. 12. 31'
  },
  voiceReward: {
    title: '루나의 10월 감사 보이스 노트 🎧',
    duration: '0:18',
    previewAudio: 'https://cdn.freesound.org/previews/612/612081_5674468-lq.mp3',
    message: '"항상 곁에서 묵묵히 응원해 주셔서 진심으로 고마워요! 이번 화보집도 온 마음을 다해 준비할게요🥕💕"'
  },
  secretPhotos: [
    {
      id: 1,
      title: '가을 핑크 로리타 미공개 B컷 #01',
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
      date: '10월 18일'
    },
    {
      id: 2,
      title: '작업실 새벽 드로잉 비하인드 #02',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      date: '10월 18일'
    }
  ]
};

// 런칭용 클린 랭킹 (초기 빈 배열 - 실제 유저 후원 시 실시간 등록)
export const INITIAL_RANKINGS = [];

// 런칭용 클린 방명록 (초기 빈 배열 - 실제 유저 응원 시 등록)
export const INITIAL_GUESTBOOK = [];

// 런칭용 클린 1:1 시크릿 메시지
export const INITIAL_SECRET_MESSAGES = [];

export const DONATION_PACKAGES = [
  { carrots: 10, price: 1000, label: '커피 한 입', tierBenefit: '화이트 래빗' },
  { carrots: 300, price: 30000, label: '체리 레드 닉네임', tierBenefit: '실버 래빗', recommended: false },
  { carrots: 1000, price: 100000, label: '1:1 시크릿 메신저 해금', tierBenefit: '골드 래빗', popular: true },
  { carrots: 3000, price: 300000, label: '미공개 화보 팩', tierBenefit: '다이아 래빗' },
  { carrots: 5000, price: 500000, label: '전광판 1위 정복', tierBenefit: '당근 로열 래빗', isRoyal: true }
];

// 카카오톡 형식 멀티 크리에이터 1:1 대화방 (클린 웰컴 상태)
export const INITIAL_CHAT_ROOMS = [
  {
    id: 'room_luna',
    creatorId: 'luna_rabbit',
    creatorName: 'Luna Rabbit (루나)',
    handle: '@Luna_Rabbit',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    category: '일러스트 & 서브컬처 코스어',
    tierName: '골드 래빗',
    tierIcon: '🥇',
    tierLevel: 3,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '방금 전',
    requiredCarrots: 1000,
    messages: [
      {
        id: 'msg_luna_welcome',
        sender: 'Luna Rabbit',
        senderTier: 'creator',
        isCreator: true,
        text: '루나의 1:1 시크릿 라운지에 오신 것을 환영해요! 편하게 비밀 질문이나 응원을 남겨주세요 🥕✨',
        timestamp: '공지',
        isSpecialGift: false
      }
    ]
  },
  {
    id: 'room_mochi',
    creatorId: 'mochi_cos',
    creatorName: '모치 (Mochi)',
    handle: '@Mochi_Cos',
    avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80',
    category: '코스프레 & 화보 일상',
    tierName: '골드 래빗',
    tierIcon: '🥇',
    tierLevel: 3,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '방금 전',
    requiredCarrots: 1000,
    messages: [
      {
        id: 'msg_mochi_welcome',
        sender: '모치 (Mochi)',
        senderTier: 'creator',
        isCreator: true,
        text: '모치의 프라이빗 라운지입니다! 의상 제작기나 촬영 비하인드에 대해 언제든 물어보세요 🥰',
        timestamp: '공지',
        isSpecialGift: false
      }
    ]
  },
  {
    id: 'room_chibi',
    creatorId: 'chibi_artist',
    creatorName: '치비 스케치',
    handle: '@Chibi_Artist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    category: 'SD 캐릭터 & 인스타툰',
    tierName: '골드 래빗',
    tierIcon: '🥇',
    tierLevel: 3,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '방금 전',
    requiredCarrots: 1000,
    messages: [
      {
        id: 'msg_chibi_welcome',
        sender: '치비 스케치',
        senderTier: 'creator',
        isCreator: true,
        text: '치비 스케치와 1:1로 소통하는 비밀 창구입니다! 캐릭터 리퀘스트나 응원을 편하게 보내주세요 🎨',
        timestamp: '공지'
      }
    ]
  },
  {
    id: 'room_neon',
    creatorId: 'neon_vibe',
    creatorName: '네온 바이브',
    handle: '@Neon_Vibe',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    category: 'Lo-Fi 작곡 & 숏폼 일상',
    tierName: '골드 래빗',
    tierIcon: '🥇',
    tierLevel: 3,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '방금 전',
    requiredCarrots: 1000,
    messages: [
      {
        id: 'msg_neon_welcome',
        sender: '네온 바이브',
        senderTier: 'creator',
        isCreator: true,
        text: '네온 바이브의 작업실 1:1 채널입니다. 음악이나 새벽 감성 이야기 언제든 환영해요 🎧',
        timestamp: '공지'
      }
    ]
  }
];

