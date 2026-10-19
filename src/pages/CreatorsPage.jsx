import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, Search, Filter, Crown, Sparkles, ArrowRight, ExternalLink, 
  Users, Heart, TrendingUp, CheckCircle, ArrowLeft, Trophy, UserPlus
} from 'lucide-react';
import { getStoredCreators } from '../services/api';

const CATEGORIES = ['전체', '일러스트', '코스프레', '인스타툰', '음악/Lo-Fi', '버튜버', '댄스/숏폼'];

export function CreatorsPage({ onSelectCreator, onBackToHome, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('ranking'); // 'ranking', 'followers'
  const [creators, setCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real registered creators from localStorage and backend
    const loadRealCreators = async () => {
      setIsLoading(true);
      try {
        const local = getStoredCreators();
        setCreators(local);

        // Try backend API if available
        try {
          const res = await fetch('/api/creators');
          if (res.ok) {
            const data = await res.json();
            const list = data.data || data.creators;
            if (data.success && Array.isArray(list)) {
              setCreators(list);
            }
          }
        } catch (e) {
          // Backend offline or local dev fallback
        }
      } catch (err) {
        console.error('Failed to load creators:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRealCreators();
  }, []);

  const filteredCreators = useMemo(() => {
    return (creators || []).filter((c) => {
      const matchCat = 
        selectedCategory === '전체' || 
        (c.category && c.category.includes(selectedCategory));
      
      const matchQuery = 
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.handle && c.handle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchCat && matchQuery;
    }).sort((a, b) => {
      if (sortBy === 'ranking') return (b.totalCarrots || 0) - (a.totalCarrots || 0);
      if (sortBy === 'followers') return (b.followers || 0) - (a.followers || 0);
      return 0;
    });
  }, [creators, selectedCategory, searchQuery, sortBy]);

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
            <span>메인으로 돌아가기</span>
          </button>
          <span className="text-xs font-semibold text-white/40 tracking-wider uppercase">
            MIMIBIT OFFICIAL CREATORS
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <Flame className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>실시간 후원 펀딩 랭킹 크리에이터</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            팬들과 소통하는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              공식 활동 크리에이터.
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

        {/* Creators Grid / Empty State */}
        {filteredCreators.length === 0 ? (
          <div className="py-20 px-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center max-w-2xl mx-auto space-y-5 my-8">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-[#FF4D6D]">
              <Users className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading font-black text-xl text-white">
                {searchQuery || selectedCategory !== '전체' 
                  ? '조건에 맞는 크리에이터가 없습니다' 
                  : '등록된 공식 크리에이터가 아직 없습니다'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                지금 첫 번째 미미빗 공식 크리에이터로 등록하고, 나만의 바이오링크와 1:1 시크릿톡 후원을 바로 시작해보세요!
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('onboarding');
                  else if (onSelectCreator) onSelectCreator('onboarding');
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E4092B] to-[#FF4D6D] hover:from-[#CC0022] hover:to-[#E4092B] text-white font-heading font-black text-xs sm:text-sm shadow-xl shadow-[#E4092B]/30 cursor-pointer active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>크리에이터 링크 무료 개설하기</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredCreators.map((creator, index) => (
              <div
                key={creator.id || creator.handle}
                onClick={() => onSelectCreator(creator.handle ? creator.handle.replace('@', '') : creator.id)}
                className="group p-6 rounded-3xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E4092B]/40 backdrop-blur-xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl"
              >
                {/* Top Banner Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-slate-300 backdrop-blur-md">
                    {creator.category || '크리에이터'}
                  </span>
                  <span className="text-xs font-black text-[#FF4D6D] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    TOP {index + 1}
                  </span>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={creator.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={creator.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-[#E4092B] transition-all"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading font-black text-lg text-white group-hover:text-[#FF4D6D] transition-colors truncate">
                      {creator.name}
                    </h3>
                    <div className="text-xs text-slate-400 font-num truncate">
                      {creator.handle} · 팬 {(creator.followers || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Funding Bar */}
                <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">누적 후원</span>
                    <span className="font-bold text-[#FF4D6D] font-num">
                      {(creator.totalCarrots || 0).toLocaleString()} 🥕
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF4D6D] to-[#E4092B] rounded-full" 
                      style={{ width: `${Math.min(100, ((creator.totalCarrots || 0) / 10000) * 100)}%` }} 
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
        )}

      </div>

    </div>
  );
}
