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
    description: '작은 첫걸음! 크리에이터 방명록에 첫 응원을 남길 수 있어요.'
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
    description: '눈에 띄는 체리 레드 닉네임과 창작자 전용 감정표현 팩 지급!'
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
    description: '최상위 로열 서포터! 크리에이터의 단독 감사 음성 리워드 및 왕관 테두리!'
  }
];

// 런칭용 클린 상태 (실제 활동 크리에이터 가입 시 등록)
export const INITIAL_CREATOR = null;

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

// 카카오톡 형식 멀티 크리에이터 1:1 대화방 (클린 런칭 상태: 빈 배열)
export const INITIAL_CHAT_ROOMS = [];


