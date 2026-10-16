import React from 'react';
import { ArrowRight, ExternalLink, Flame, Users, Sparkles } from 'lucide-react';

export const SHOWCASE_CREATORS = [
  {
    handle: '@Luna_Rabbit',
    name: 'Luna Rabbit (루나)',
    category: '일러스트 & 서브컬처 코스어',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    followers: '24.5K',
    currentCarrots: 8450,
    topSupporter: 'Chibi_Fan',
    tag: '월간 랭킹 1위',
    tagColor: 'bg-amber-100 text-amber-900 border border-amber-200/80'
  },
  {
    handle: '@Chibi_Artist',
    name: '치비 스케치',
    category: 'SD 캐릭터 & 인스타툰',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    followers: '18.2K',
    currentCarrots: 5200,
    topSupporter: 'Momo_Berry',
    tag: '급상승 서포트',
    tagColor: 'bg-rose-50 text-[#E4092B] border border-rose-200/80'
  },
  {
    handle: '@Mochi_Cos',
    name: '모치 (Mochi)',
    category: '코스프레 & 화보 일상',
    avatar: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80',
    followers: '31.0K',
    currentCarrots: 9100,
    topSupporter: 'SuperK',
    tag: '시크릿톡 오픈',
    tagColor: 'bg-slate-900 text-white'
  },
  {
    handle: '@Neon_Vibe',
    name: '네온 바이브',
    category: 'Lo-Fi 작곡 & 숏폼 일상',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    followers: '12.8K',
    currentCarrots: 3800,
    topSupporter: 'JazzLover',
    tag: '감사 보이스 리워드',
    tagColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200'
  },
  {
    handle: '@Yuki_Illust',
    name: '유키 (Yuki)',
    category: '서브컬처 캐릭터 일러스트',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=600&q=80',
    followers: '42.1K',
    currentCarrots: 11200,
    topSupporter: 'SnowWhite',
    tag: '다이아 래빗 12명',
    tagColor: 'bg-sky-50 text-sky-800 border border-sky-200'
  },
  {
    handle: '@Cherry_Shorts',
    name: '체리 댄스',
    category: '틱톡 챌린지 댄서',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
    followers: '56.3K',
    currentCarrots: 14500,
    topSupporter: 'BeatsMaker',
    tag: '스토리 공유 티켓',
    tagColor: 'bg-rose-50 text-[#E4092B] border border-rose-200'
  },
  {
    handle: '@Haru_Vocal',
    name: '하루 (Haru)',
    category: '인디 싱어송라이터 & 어쿠스틱',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    followers: '19.4K',
    currentCarrots: 4700,
    topSupporter: 'SpringBreeze',
    tag: '음성 리워드 인기',
    tagColor: 'bg-purple-50 text-purple-800 border border-purple-200'
  },
  {
    handle: '@Miu_Studio',
    name: '미우 스튜디오',
    category: '3D 버튜버 모델러 & 방송',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    followers: '28.9K',
    currentCarrots: 6950,
    topSupporter: 'CyberCat',
    tag: '신규 온보딩',
    tagColor: 'bg-indigo-50 text-indigo-800 border border-indigo-200'
  }
];

export function ToonCreatorShowcase({ onSelectCreator }) {
  const infiniteCreators = [...SHOWCASE_CREATORS, ...SHOWCASE_CREATORS];

  return (
    <section id="creators" className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-slate-100 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200/80 gap-4">
          <div>
            <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60 inline-block mb-3">
              FEATURED CREATORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              지금 미미빗과 함께하는 크리에이터
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              인스타그램과 틱톡 프로필 링크 하나로 충성도 높은 코어 팬덤을 연결하고 있습니다.
            </p>
          </div>

          <button
            onClick={() => onSelectCreator(SHOWCASE_CREATORS[0])}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 hover:text-[#E4092B] transition-colors shrink-0 cursor-pointer"
          >
            <span>루나 대표 프로필 열기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Infinite Horizontal Auto-scrolling Track */}
      <div className="w-full relative">
        {/* Soft edge blur masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#FAFAFB] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#FAFAFB] to-transparent z-10 pointer-events-none" />

        <div className="marquee-track-left gap-5 px-4 py-3">
          {infiniteCreators.map((c, idx) => (
            <div
              key={idx}
              onClick={() => onSelectCreator(c)}
              className="group cursor-pointer bg-white rounded-3xl border border-slate-200/80 hover:border-slate-400 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col w-72 sm:w-80 shrink-0 select-none"
            >
              {/* Cover Banner */}
              <div className="h-32 relative overflow-hidden bg-slate-100">
                <img
                  src={c.cover}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${c.tagColor}`}>
                  {c.tag}
                </span>
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-num">
                  팔로워 {c.followers}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
                <div>
                  {/* Avatar Overlap */}
                  <div className="relative -mt-9 mb-2.5 inline-block">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <h3 className="font-heading font-black text-base text-slate-900 group-hover:text-[#E4092B] transition-colors truncate">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal truncate mt-0.5">
                    {c.handle} · {c.category}
                  </p>
                </div>

                {/* Status Box */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">당월 후원 당근</span>
                    <span className="font-black text-[#E4092B] font-num text-sm">
                      {c.currentCarrots.toLocaleString()} 🥕
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">1위 서포터</span>
                    <span className="font-medium text-slate-800 truncate max-w-[130px]">
                      {c.topSupporter}
                    </span>
                  </div>
                </div>

                {/* Visit CTA */}
                <button
                  type="button"
                  className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-slate-900 text-slate-700 group-hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>프로필 방문 & 후원</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
