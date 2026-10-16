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
    currentCarrots: 8450,
    targetCarrots: 10000,
    endDate: '2026. 10. 31'
  },
  voiceReward: {
    title: '루나의 10월 감사 보이스 노트 🎧',
    duration: '0:18',
    previewAudio: 'https://cdn.freesound.org/previews/612/612081_5674468-lq.mp3', // cute chime sound demo
    message: '"항상 곁에서 묵묵히 응원해 주셔서 진심으로 고마워요! 이번 화보집도 온 마음을 다해 준비할게요🥕💕"'
  },
  secretPhotos: [
    {
      id: 1,
      title: '가을 핑크 로리타 미공개 B컷 #01',
      url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
      date: '10월 12일'
    },
    {
      id: 2,
      title: '작업실 새벽 드로잉 비하인드 #02',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      date: '10월 08일'
    }
  ]
};

export const INITIAL_RANKINGS = [
  {
    rank: 1,
    id: 'supporter_1',
    nickname: 'Chibi_Fan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    carrots: 5400,
    tierId: 'royal',
    badge: '👑 당근 로열 래빗',
    message: '루나님 이번 일러스트북 대박나세요! 언제나 묵묵히 뒤에서 응원해요 🥕✨',
    highlightComment: '루나님 이번 일러스트북 대박나세요! 언제나 묵묵히 뒤에서 응원해요 🥕✨',
    isTop1: true
  },
  {
    rank: 2,
    id: 'supporter_2',
    nickname: 'BunnyLover',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    carrots: 4150,
    tierId: 'diamond',
    badge: '💎 다이아 래빗',
    message: '코스프레 사진 너무 예뻐요! 다음 주말 촬영도 화이팅!',
    isTop1: false
  },
  {
    rank: 3,
    id: 'supporter_3',
    nickname: 'CarrotQueen',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    carrots: 2800,
    tierId: 'gold',
    badge: '🥇 골드 래빗',
    message: '루나님 그림 보면서 매일 힐링 중입니다 항상 건강 챙기세요!',
    isTop1: false
  },
  {
    rank: 4,
    id: 'supporter_4',
    nickname: 'CozyGamer',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=150&q=80',
    carrots: 1950,
    tierId: 'gold',
    badge: '🥇 골드 래빗',
    message: '따뜻한 일상 공유해주셔서 감사합니다.',
    isTop1: false
  },
  {
    rank: 5,
    id: 'supporter_5',
    nickname: 'StarryEyes',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    carrots: 1200,
    tierId: 'gold',
    badge: '🥇 골드 래빗',
    message: '행복한 하루 되세요!',
    isTop1: false
  }
];

export const INITIAL_GUESTBOOK = [
  {
    id: 101,
    nickname: 'Chibi_Fan',
    tierId: 'royal',
    carrots: 500,
    content: '루나님 이번 달 펀딩 거의 다 찼네요! 끝까지 함께 달려요 🥕🔥',
    createdAt: '10분 전',
    likes: 12
  },
  {
    id: 102,
    nickname: '하늘토끼',
    tierId: 'silver',
    carrots: 30,
    content: '체리 레드 닉네임 얻고 싶어서 첫 후원했어요! 루나님 너무 사랑스러워요 💕',
    createdAt: '1시간 전',
    likes: 5
  },
  {
    id: 103,
    nickname: 'Berry_Pink',
    tierId: 'white',
    carrots: 10,
    content: '인스타 릴스 보고 넘어왔어요. 그림체 너무 제 취향입니다 🤍',
    createdAt: '3시간 전',
    likes: 3
  }
];

export const INITIAL_SECRET_MESSAGES = [
  {
    id: 'msg_01',
    sender: 'Alex G. (당신)',
    senderTier: 'gold',
    isCreator: false,
    text: '루나님 안녕하세요! 지난번 올려주신 드로잉 팁 영상 보고 디지털 드로잉 시작했습니다. 항상 감사드려요 🎨',
    timestamp: '어제 오후 08:30',
    ticketCost: 1
  },
  {
    id: 'msg_02',
    sender: 'Luna Rabbit',
    senderTier: 'creator',
    isCreator: true,
    text: 'Alex님! 제 영상이 작은 용기가 되었다니 그림 그리는 사람으로서 정말 벅차고 기뻐요 🥺 편하실 때 그림 언제든 자랑해 주세요! 항상 응원할게요 🥕',
    voiceNote: {
      duration: '0:14',
      label: 'Luna의 감사 보이스 메모'
    },
    secretPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    timestamp: '오늘 오전 11:05',
    isSpecialGift: true
  }
];

export const DONATION_PACKAGES = [
  { carrots: 10, price: 1000, label: '커피 한 입 ☕', tierBenefit: '화이트 래빗 🤍' },
  { carrots: 300, price: 30000, label: '체리 레드 닉네임 🍒', tierBenefit: '실버 래빗 🥈', recommended: false },
  { carrots: 1000, price: 100000, label: '1:1 시크릿 메신저 해금 💌', tierBenefit: '골드 래빗 🥇', popular: true },
  { carrots: 3000, price: 300000, label: '미공개 화보 팩 📸', tierBenefit: '다이아 래빗 💎' },
  { carrots: 5000, price: 500000, label: '전광판 1위 정복 👑', tierBenefit: '당근 로열 래빗 👑', isRoyal: true }
];

// 카카오톡 형식 멀티 크리에이터 1:1 대화방 데이터
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
    isUnlocked: true,
    tickets: 5,
    unreadCount: 1,
    lastUpdated: '오전 11:05',
    messages: [
      {
        id: 'msg_luna_1',
        sender: 'Alex G. (당신)',
        senderTier: 'gold',
        isCreator: false,
        text: '루나님 안녕하세요! 지난번 올려주신 드로잉 팁 영상 보고 디지털 드로잉 시작했습니다. 항상 감사드려요 🎨',
        timestamp: '어제 오후 08:30',
        ticketCost: 1
      },
      {
        id: 'msg_luna_2',
        sender: 'Luna Rabbit',
        senderTier: 'creator',
        isCreator: true,
        text: 'Alex님! 제 영상이 작은 용기가 되었다니 그림 그리는 사람으로서 정말 벅차고 기뻐요 🥺 편하실 때 그림 언제든 자랑해 주세요! 항상 응원할게요 🥕',
        voiceNote: {
          duration: '0:14',
          label: 'Luna의 감사 보이스 메모 🎧'
        },
        secretPhotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        timestamp: '오늘 오전 11:05',
        isSpecialGift: true
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
    tierName: '다이아 래빗',
    tierIcon: '💎',
    tierLevel: 4,
    isUnlocked: true,
    tickets: 12,
    unreadCount: 0,
    lastUpdated: '어제',
    messages: [
      {
        id: 'msg_mochi_1',
        sender: 'Alex G. (당신)',
        senderTier: 'diamond',
        isCreator: false,
        text: '모치님 이번 코스프레 의상 제작기 너무 흥미롭게 봤어요! 다음 작품도 기대할게요 💖',
        timestamp: '10월 12일 오후 02:15',
        ticketCost: 1
      },
      {
        id: 'msg_mochi_2',
        sender: '모치 (Mochi)',
        senderTier: 'creator',
        isCreator: true,
        text: 'Alex 서포터님 항상 큰 힘이 됩니다! 다음 주말 촬영본에서 가장 마음에 드는 B컷 미공개 화보 먼저 선물해드려요 🥰',
        voiceNote: {
          duration: '0:12',
          label: '모치의 1:1 보이스 인사 🎧'
        },
        secretPhotoUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
        timestamp: '어제 오후 05:40',
        isSpecialGift: true
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
    tierName: '실버 래빗',
    tierIcon: '🥈',
    tierLevel: 2,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '3일 전',
    requiredCarrots: 700,
    messages: [
      {
        id: 'msg_chibi_info',
        sender: '시스템 알림',
        senderTier: 'system',
        isCreator: true,
        text: '치비 스케치님과의 1:1 시크릿 메신저는 골드 래빗(누적 1,000 🥕) 달성 시 활성화됩니다. 현재 300 🥕 후원 완료 (700 🥕 추가 후원 필요)',
        timestamp: '3일 전'
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
    tierName: '화이트 래빗',
    tierIcon: '🤍',
    tierLevel: 1,
    isUnlocked: false,
    tickets: 0,
    unreadCount: 0,
    lastUpdated: '1주일 전',
    requiredCarrots: 990,
    messages: [
      {
        id: 'msg_neon_info',
        sender: '시스템 알림',
        senderTier: 'system',
        isCreator: true,
        text: '네온 바이브님과의 1:1 시크릿 메신저는 골드 래빗(누적 1,000 🥕) 달성 시 활성화됩니다. 현재 10 🥕 후원 완료',
        timestamp: '1주일 전'
      }
    ]
  }
];

