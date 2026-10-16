import React from 'react';
import { 
  Sparkles, Target, Users, Shield, Zap, Globe, Rocket, Heart, 
  ArrowLeft, ArrowRight, CheckCircle2, TrendingUp, Award 
} from 'lucide-react';

export function AboutPage({ onOpenStudio, onBackToHome }) {
  return (
    <div className="min-h-screen bg-[#FAFAFB] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#E4092B] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 홈으로 돌아가기</span>
          </button>
          <span className="text-xs font-bold text-slate-400">
            MIMIBIT · 브랜드 소개 & 비전
          </span>
        </div>

        {/* Page Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E4092B] text-xs font-black border border-slate-200/80 mb-3">
            <Heart className="w-3.5 h-3.5 fill-[#E4092B]" />
            <span>ABOUT MIMIBIT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            모든 작은 창작자가 존중받고<br />
            자생하는 생태계를 만듭니다
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 mt-3.5 font-medium leading-relaxed">
            미미빗(MIMIBIT)은 복잡한 방송 장비나 OBS 송출 없이, 인스타그램과 틱톡 바이오 링크 하나로 코어 팬덤과 지속 가능한 게이미피케이션 후원을 시작할 수 있는 마이크로 D2C 후원 플랫폼입니다.
          </p>
        </div>

        {/* Mission & Problem Statement (From IR Deck) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Problem */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-xs space-y-4">
            <span className="text-[10px] font-black uppercase text-[#E4092B] bg-rose-50 px-2.5 py-0.5 rounded-full">
              THE PROBLEM
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              45만 비방송 창작자들의 딜레마
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              국내외 수많은 일러스트레이터, 웹툰 작가, 코스어, 작곡가들은 라이브 스트리밍을 진행하기 어렵습니다. 
              고가의 방송 장비 부담, 실시간 감정 노동과 사생활 노출의 두려움으로 인해 코어 팬덤이 있음에도 후원 창구를 열지 못하고 있었습니다.
            </p>
            <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>OBS 설정 및 장비 구매의 높은 진입 장벽</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>실시간 연락 및 스팸 DM으로 인한 극심한 번아웃</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>기존 플랫폼의 과도한 30~40% 수수료 착취</span>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xs space-y-4">
            <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              THE MIMIBIT SOLUTION
            </span>
            <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
              링크 하나로 해결하는 마이크로 D2C
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              미미빗은 링크인바이오(Link-in-bio) 형태로 스마트폰 브라우저에서 3초 만에 열립니다. 
              게이미피케이션 랭킹전과 '답장 의무 면제' 1:1 시크릿 메신저로 창작자의 멘탈을 지키면서 건당 15,000원 이상의 높은 후원 단가를 창출합니다.
            </p>
            <div className="space-y-2 pt-2 border-t border-emerald-100 text-xs text-slate-900">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>장비 스트레스 없는 모바일 웹 퍼스트 생태계</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>답장 의무 면제(No Pressure) 시스템 기본 탑재</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>투네이션형 표준 10.0% 단일 Take-rate (VAT 분리 청구)</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-200/80 shadow-sm mb-16">
          <div className="text-center mb-10">
            <span className="text-[10px] font-black uppercase text-[#E4092B] bg-rose-50 px-3 py-1 rounded-full">
              CORE VALUES
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-2">
              미미빗이 지키는 4가지 약속
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-10 h-10 rounded-xl bg-rose-50 text-[#E4092B] flex items-center justify-center text-xl font-black">
                ⚡
              </span>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Zero OBS
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                고성능 송출 PC나 마이크 없이 모바일 링크 하나로 즉시 후원을 개설합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-10 h-10 rounded-xl bg-amber-50 text-[#B45309] flex items-center justify-center text-xl font-black">
                🛡️
              </span>
              <h3 className="font-heading font-black text-sm text-slate-900">
                No Pressure
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                답장 의무 면제 정책과 AI 차단 봇으로 창작자의 사생활과 멘탈을 철저히 보호합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-10 h-10 rounded-xl bg-rose-50 text-[#E4092B] flex items-center justify-center text-xl font-black">
                🎫
              </span>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Viral Receipt
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                인스타그램 스토리 자동 영수증 티켓으로 마케팅비(CAC) 0원 오가닉 확장을 유도합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
                💎
              </span>
              <h3 className="font-heading font-black text-sm text-slate-900">
                Fair Take-Rate
              </h3>
              <p className="text-slate-600 leading-relaxed font-medium">
                투네이션 표준 10.0% 수수료 모델로 창작자 몫을 투명하게 보장하며 숨은 수수료를 없앴습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Global Vision & Roadmap */}
        <div className="bg-[#140E10] text-white rounded-3xl p-8 sm:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FFD700] text-xs font-black border border-white/10 mb-3">
              <Globe className="w-3.5 h-3.5" />
              <span>GLOBAL EXPANSION ROADMAP</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-heading font-black tracking-tight">
              K-서브컬처에서 아시아 전역으로
            </h2>
            <p className="text-xs sm:text-sm text-white/70 mt-3 font-medium leading-relaxed">
              한국의 서브컬처 일러스트 및 인스타툰 창작자 45만 명을 시작으로, 
              일본, 대만, 동남아의 비방송 크리에이터 생태계로 글로벌 확장을 준비하고 있습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={onOpenStudio}
                className="btn-pop-primary px-7 py-3 text-xs font-black flex items-center gap-2"
              >
                <span>지금 미미빗 링크 개설하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
