import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageCircle, ArrowUp, Sparkles } from 'lucide-react';

export function FloatingMenu({ onNavigate, onOpenMessenger }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      {/* 1:1 Secret Talk Button */}
      {onOpenMessenger && (
        <button
          type="button"
          onClick={onOpenMessenger}
          className="group flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-4 py-2.5 rounded-full font-bold text-xs shadow-[0_8px_25px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
          title="1:1 시크릿톡 열기"
        >
          <MessageCircle className="w-4 h-4 text-rose-400" />
          <span>시크릿톡</span>
          <span className="w-2 h-2 rounded-full bg-[#E4092B] ring-2 ring-slate-900"></span>
        </button>
      )}

      {/* Guide Center */}
      <button
        onClick={() => onNavigate && onNavigate('faq')}
        className="flex items-center gap-2 bg-white/95 hover:bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-full font-bold text-xs shadow-md hover:border-slate-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <HelpCircle className="w-4 h-4 text-slate-500" />
        <span className="hidden sm:inline">이용 가이드</span>
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#1C1215] text-white flex items-center justify-center shadow-lg hover:bg-[#E4092B] transition-colors cursor-pointer"
          title="상단으로 이동"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
