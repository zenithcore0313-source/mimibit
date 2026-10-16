import React, { useState, useMemo } from 'react';
import { 
  Flame, Search, Filter, Crown, Sparkles, ArrowRight, ExternalLink, 
  Users, Heart, TrendingUp, CheckCircle, ArrowLeft, Trophy 
} from 'lucide-react';
import { SHOWCASE_CREATORS } from '../components/toonation/ToonCreatorShowcase';

const CATEGORIES = ['전체', '일러스트', '코스프레', '인스타툰', '음악/Lo-Fi', '버튜버', '댄스/숏폼'];

export function CreatorsPage({ onSelectCreator, onBackToHome }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ranking'); // 'ranking', 'followers', 'new'

  const allCreators = useMemo(() => {
    return [
      ...SHOWCASE_CREATORS,
      {
        handle: '@Rin_Illust',
        name: '린 (Rin)',
        category: '동양풍 판타지 일러스트',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
        followers: '35.4K',
        currentCarrots: 7800,
        topSupporter: 'MoonLight',
        tag: '🎨 신작 화보집 펀딩',
        tagColor: 'bg-indigo-600 text-white'
      },
      {
        handle: '@Sora_Vocal',
        name: '소라 (Sora)',
        category: '서브컬처 애니송 커버 보컬',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        followers: '21.0K',
        currentCarrots: 5900,
        topSupporter: 'AriaFan',
        tag: '🎧 15초 보이스 노트',
        tagColor: 'bg-emerald-600 text-white'
      }
    ];
  }, []);

  const filteredCreators = useMemo(() => {
    return allCreators.filter((c) => {
      const matchCat = 
        selectedCategory === '전체' || 
        c.category.includes(selectedCategory) ||
        (selectedCategory === '음악/Lo-Fi' && (c.category.includes('작곡') || c.category.includes('보컬')));
      
      const matchQuery = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'ranking') return b.currentCarrots - a.currentCarrots;
      if (sortBy === 'followers') return parseFloat(b.followers) - parseFloat(a.followers);
      return 0;
    });
  }, [allCreators, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 right-1/4 w-[700px] h-[500px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">

        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>메인 플로우로 돌아가기</span>
          </button>
          <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">
            MIMIBIT TOP CREATORS DIRECTORY
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <Flame className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>실시간 후원 펀딩 랭킹 TOP 크리에이터</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            매일 수만 명의 팬들이<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              응원하는 인기 창작자들.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed pt-2">
            인스타툰, 서브컬처 일러스트, 코스프레, Lo-Fi 음악까지.<br />
            방송 없이도 팬들과 가장 끈끈하게 교감하는 미미빗 크리에이터들의 프로필을 만나보세요.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="크리에이터 이름, 핸들 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-[#E4092B] transition-colors"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E4092B] text-white shadow-md shadow-[#E4092B]/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredCreators.map((creator, index) => (
            <div
              key={creator.handle}
              onClick={() => onSelectCreator(creator.handle.replace('@', ''))}
              className="group p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E4092B]/40 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl"
            >
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300 backdrop-blur-md">
                  {creator.category}
                </span>
                <span className="text-xs font-black text-[#FF4D6D] flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  TOP {index + 1}
                </span>
              </div>

              {/* Avatar & Info */}
              <div className="flex items-center gap-4">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-[#E4092B] transition-all"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-black text-lg text-white group-hover:text-[#FF4D6D] transition-colors truncate">
                    {creator.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-num truncate">
                    {creator.handle} · 팬 {creator.followers}
                  </div>
                </div>
              </div>

              {/* Funding Bar */}
              <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">{creator.tag}</span>
                  <span className="font-bold text-[#FF4D6D] font-num">
                    {creator.currentCarrots.toLocaleString()} 🥕
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] rounded-full" 
                    style={{ width: `${Math.min(100, (creator.currentCarrots / 10000) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* CTA Pill */}
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                <span>프로필 방문 및 후원하기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E4092B]" />
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
