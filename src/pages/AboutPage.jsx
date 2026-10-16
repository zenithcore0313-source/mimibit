import React from 'react';
import { 
  Sparkles, Target, Users, Shield, Zap, Globe, Rocket, Heart, 
  ArrowLeft, ArrowRight, CheckCircle2, TrendingUp, Award, Check, X 
} from 'lucide-react';

export function AboutPage({ onOpenStudio, onBackToHome }) {
  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/4 w-[800px] h-[500px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

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
            ABOUT MIMIBIT · PHILOSOPHY & VISION
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <Heart className="w-3.5 h-3.5 fill-[#FF4D6D] text-[#FF4D6D]" />
            <span>비방송 창작자를 위한 지속 가능한 생태계</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            모든 작은 창작자가 존중받고<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              자생하는 세상을 만듭니다.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed pt-2">
            미미빗(MIMIBIT)은 복잡한 방송 장비나 OBS 송출 없이, 인스타그램과 틱톡 바이오 링크 하나로 코어 팬덤과 지속 가능한 게이미피케이션 후원을 시작할 수 있는 마이크로 D2C 후원 플랫폼입니다.
          </p>
        </div>

        {/* Problem vs Solution 2-Column Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Problem */}
          <div className="p-8 sm:p-10 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              THE PROBLEM
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              45만 비방송 창작자들의 딜레마
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              국내외 수많은 일러스트레이터, 웹툰 작가, 코스어, 작곡가들은 라이브 스트리밍을 진행하기 어렵습니다. 
              고가의 방송 장비 부담, 실시간 감정 노동과 사생활 노출의 두려움으로 인해 코어 팬덤이 있음에도 후원 창구를 열지 못하고 있었습니다.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>OBS 설정 및 장비 구매의 높은 진입 장벽</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>라이브 방송 스트리밍 플랫폼의 40% 고율 수수료</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>DM이나 개인 카카오톡 계정 노출로 인한 사생활 침해</span>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-b from-white/10 to-white/5 border-2 border-[#E4092B]/50 backdrop-blur-xl shadow-2xl shadow-[#E4092B]/10 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] bg-[#E4092B]/20 px-3 py-1 rounded-full border border-[#E4092B]/30">
              THE SOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              미미빗 마이크로 링크의 탄생
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              방송 장비 세팅 없이, 오직 인스타그램·틱톡 바이오에 링크 하나 걸어두는 것만으로 해결했습니다.
              팬은 회원가입 없이 500원부터 카카오페이로 응원하고, 창작자는 15초 음성 답례와 투명한 10% 익일 정산으로 창작을 지속합니다.
            </p>
            <div className="space-y-2.5 pt-4 border-t border-white/15 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>3분 만에 생성되는 원클릭 바이오링크</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>투네이션 10.0% 단일 수수료 모델 적용</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>1:1 시크릿톡 & 15초 음성 답례로 창작자 사생활 100% 보호</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Core Values */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl mb-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
              미미빗이 타협하지 않는 4가지 핵심 원칙
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              창작자의 존엄성과 팬들의 순수한 마음을 지키기 위한 우리의 철학입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <h3 className="font-heading font-black text-base text-white">Simple</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                팬은 가입 없이 1초 만에, 창작자는 링크 하나로 3초 만에 연결됩니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
              <div className="text-2xl mb-1">🔒</div>
              <h3 className="font-heading font-black text-base text-white">Safe</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                전화번호나 사생활이 절대 노출되지 않으며 답장 압박이 없습니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
              <div className="text-2xl mb-1">⚖️</div>
              <h3 className="font-heading font-black text-base text-white">Fair</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                불합리한 40% 수수료를 깨고 오직 10%만 제하고 익일 정산합니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-center">
              <div className="text-2xl mb-1">🎧</div>
              <h3 className="font-heading font-black text-base text-white">Emotional</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                15초 감사 목소리로 팬에게 평생 간직할 감동을 선물합니다.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
