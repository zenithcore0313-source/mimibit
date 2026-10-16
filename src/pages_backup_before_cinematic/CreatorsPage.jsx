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

  // Extended creator directory
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
    <div className="min-h-screen bg-[#FAFAFB] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#E4092B] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 홈으로 돌아가기</span>
          </button>

          <span className="text-xs font-bold text-slate-400">
            MIMIBIT · 크리에이터 탐색 디렉토리
          </span>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E4092B] text-xs font-black border border-slate-200/80 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>10월 실시간 크리에이터 후원 랭킹</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            인기 크리에이터 탐색
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 mt-2.5 font-medium leading-relaxed">
            인스타그램과 틱톡 링크 하나로 팬들과 활발히 교감 중인 미미빗 공식 크리에이터들을 만나보세요
          </p>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {allCreators.slice(0, 3).map((c, i) => (
            <div
              key={c.handle}
              onClick={() => onSelectCreator(c)}
              className={`p-5 rounded-3xl cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-sm relative overflow-hidden flex items-center gap-4 ${
                i === 0 
                  ? 'bg-gradient-to-br from-[#FEF3C7] to-amber-50 border-2 border-[#FFB703]' 
                  : i === 1 
                  ? 'bg-white border-2 border-slate-200' 
                  : 'bg-white border-2 border-slate-200/80'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-heading font-black text-xl shrink-0 shadow-md bg-white">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-[#E4092B] bg-rose-50 px-2 py-0.5 rounded-full">
                    {i === 0 ? '월간 1위' : `${i + 1}위`}
                  </span>
                  <span className="text-xs text-slate-400 truncate font-medium">{c.category}</span>
                </div>
                <h3 className="font-heading font-black text-base text-slate-900 truncate mt-0.5">
                  {c.name}
                </h3>
                <div className="text-xs font-black text-[#E4092B] font-num mt-1">
                  이번 달 {c.currentCarrots.toLocaleString()} 🥕 후원 달성
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-slate-200/80 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="크리에이터 이름, 핸들, 키워드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#E4092B]"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs font-bold text-slate-600">정렬 기준:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-black text-slate-900 focus:outline-none focus:border-[#E4092B]"
              >
                <option value="ranking">🏆 이번달 당근 랭킹순</option>
                <option value="followers">👥 팔로워 많은순</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#E4092B] text-white shadow-xs'
                    : 'bg-rose-50 text-slate-600 hover:bg-[#FCD5DC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((c) => (
            <div
              key={c.handle}
              onClick={() => onSelectCreator(c)}
              className="bg-white rounded-3xl border-2 border-slate-200/80 hover:border-[#E4092B] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer"
            >
              {/* Cover Banner */}
              <div className="h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={c.cover}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${c.tagColor}`}>
                  {c.tag}
                </span>
                <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full font-num">
                  팔로워 {c.followers}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 pt-0 relative flex-1 flex flex-col justify-between">
                <div>
                  {/* Avatar Overlap */}
                  <div className="relative -mt-12 mb-3 inline-block">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-18 h-18 rounded-2xl object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 text-base">🐰</span>
                  </div>

                  <h3 className="font-heading font-black text-lg text-slate-900 group-hover:text-[#E4092B] transition-colors truncate">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                    {c.handle} · {c.category}
                  </p>
                </div>

                {/* Status Box */}
                <div className="mt-4 pt-3.5 border-t border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-[11px] font-medium">이번달 당근 후원</span>
                    <span className="font-black text-[#E4092B] font-num text-base">
                      {c.currentCarrots.toLocaleString()} 🥕
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-400">1위 서포터</span>
                    <span className="font-bold text-slate-900 truncate max-w-[140px]">
                      👑 {c.topSupporter}
                    </span>
                  </div>
                </div>

                {/* Visit CTA */}
                <button
                  type="button"
                  className="mt-4 w-full py-2.5 rounded-xl bg-rose-50 group-hover:bg-[#E4092B] text-[#E4092B] group-hover:text-white text-xs font-black transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>프로필 열기 & 후원하기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80">
            <p className="text-sm font-bold text-slate-400">
              검색 조건에 맞는 크리에이터가 없습니다.
            </p>
            <button
              onClick={() => { setSelectedCategory('전체'); setSearchQuery(''); }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#E4092B] text-white text-xs font-black"
            >
              필터 초기화
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
