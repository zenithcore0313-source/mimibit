import React from 'react';
import { ArrowRight, Sparkles, Users } from 'lucide-react';
import { getStoredCreators } from '../../services/api';

// Clean launch state: empty array (real creators will be registered dynamically)
export const SHOWCASE_CREATORS = [];

export function ToonCreatorShowcase({ onSelectCreator, onNavigate }) {
  const creators = getStoredCreators();

  if (!creators || creators.length === 0) {
    return (
      <section id="creators" className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-slate-100 font-sans overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-3xl bg-rose-50 flex items-center justify-center text-[#E4092B]">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 tracking-tight">
            지금 첫 번째 미미빗 크리에이터가 되어보세요
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            SNS 바이오링크 하나로 방송 없이 팬들의 즉시 후원과 1:1 시크릿톡을 시작할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('onboarding')}
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>크리에이터 링크 무료 개설하기</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="creators" className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-slate-100 font-sans overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-slate-200/80 gap-4">
          <div>
            <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60 inline-block mb-3">
              OFFICIAL CREATORS
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 tracking-tight">
              공식 활동 크리에이터
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1.5">
              미미빗 바이오링크로 팬들과 소통하고 있는 크리에이터들을 만나보세요.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {creators.map((c) => (
          <div
            key={c.id || c.handle}
            onClick={() => onSelectCreator && onSelectCreator(c)}
            className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-[#E4092B]/40 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center gap-3">
              <img 
                src={c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"} 
                alt={c.name}
                className="w-12 h-12 rounded-2xl object-cover ring-1 ring-black/5"
              />
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900">{c.name}</h3>
                <span className="text-xs text-slate-400 font-mono">{c.handle}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{c.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
