import React, { useState } from 'react';
import { 
  Sparkles, Crown, Ticket, Volume2, Image as ImageIcon, ShieldAlert, Award, 
  ArrowLeft, ArrowRight, Check, CheckCircle2, Heart, HelpCircle, ShieldCheck, Flame, Zap
} from 'lucide-react';

export function FeaturesPage({ onOpenCreatorDemo, onBackToHome }) {
  const [activeTab, setActiveTab] = useState('ranking');

  const TIER_MATRIX = [
    {
      tier: '🤍 화이트 래빗',
      carrots: '10개 (1,000원+)',
      badge: '기본 화이트 토끼',
      hallOfFame: '랭킹전 참여',
      secretChat: '-',
      secretPhoto: '-',
      voiceNote: '-',
      receipt: '기본 영수증 티켓'
    },
    {
      tier: '🥈 실버 래빗',
      carrots: '100개 (10,000원+)',
      badge: '실버 테두리 배지',
      hallOfFame: 'Top 5 랭킹 노출',
      secretChat: '-',
      secretPhoto: '-',
      voiceNote: '-',
      receipt: '인스타 스토리 티켓'
    },
    {
      tier: '🥇 골드 래빗',
      carrots: '1,000개 (100,000원+)',
      badge: '골드 왕관 배지 & 골드 닉네임',
      hallOfFame: 'Top 5 상위 고정',
      secretChat: '티켓 5장 해금',
      secretPhoto: '-',
      voiceNote: '-',
      receipt: '골드 인증 스탬프 티켓'
    },
    {
      tier: '💎 다이아 래빗',
      carrots: '3,000개 (300,000원+)',
      badge: '다이아 샤인 배지',
      hallOfFame: 'Top 3 포디움 노출',
      secretChat: '티켓 10장 해금',
      secretPhoto: '비하인드 화보 전관 열람',
      voiceNote: '-',
      receipt: '다이아 VIP 티켓'
    },
    {
      tier: '👑 당근 로열 래빗',
      carrots: '5,000개 (500,000원+)',
      badge: '당근 로열 체리레드 배지',
      hallOfFame: '실시간 1위 전광판 고정',
      secretChat: '티켓 20장 무제한급',
      secretPhoto: '미공개 고화질 화보 영구 소장',
      voiceNote: '창작자 15초 맞춤 보이스',
      receipt: '최상위 1% 블랙 영수증'
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 left-1/3 w-[800px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-[#E4092B]/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[500px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />

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
            MIMIBIT FEATURES & TIER MATRIX
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>비방송 창작자를 위한 4대 마이크로 팬덤 리워드</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            팬을 설레게 하는<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              미미빗의 독보적 후원 경험.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed pt-2">
            단순한 송금을 넘어, 팬에게는 잊지 못할 리워드를, 창작자에게는 사생활 침해 없는 안전한 교감을 선사합니다.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-[#E4092B]/20 text-[#FF4D6D] border border-[#E4092B]/30 flex items-center justify-center font-heading font-black text-xl">
              01
            </span>
            <h3 className="font-heading font-black text-2xl text-white">
              인스타 바이오링크 원클릭 후원
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              복잡한 방송 장비 세팅 없이, 3분 만에 발급되는 나만의 프로필 주소(`mimibit.me/@creators`). 
              팬들은 회원가입 없이 카카오페이·토스페이로 500원부터 즉시 후원할 수 있습니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-heading font-black text-xl">
              02
            </span>
            <h3 className="font-heading font-black text-2xl text-white">
              전화번호 없는 1:1 시크릿 라운지
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              후원자에게만 열리는 티켓 기반 비동기 프라이빗 대화. 
              창작자의 개인 전화번호나 카톡 아이디가 일체 노출되지 않으며, 답장 의무 면제 정책으로 창작자를 철저히 보호합니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-heading font-black text-xl">
              03
            </span>
            <h3 className="font-heading font-black text-2xl text-white">
              15초 감사 음성 답례품
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              영상 마감 압박 없이, 스마트폰 마이크로 가볍게 녹음하는 15초 목소리 답례. 
              후원 팬은 세상에 단 하나뿐인 창작자의 감사 음성을 영구 소장하고 재생할 수 있습니다.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all space-y-4">
            <span className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-heading font-black text-xl">
              04
            </span>
            <h3 className="font-heading font-black text-2xl text-white">
              업계 최저 10% 수수료 & 익일 정산
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              타사 라이브 방송의 40% 수수료 대비 1/4 수준. 
              충전단에서 VAT를 분리하여 창작자 출금 시 10.0% 플랫폼 수수료만 제하며, 신청 다음 날 오전 10시 계좌로 전액 직통 입금됩니다.
            </p>
          </div>
        </div>

        {/* Tier Matrix Table */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl mb-16 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white">
              서포터 후원 누적 티어 & 혜택 매트릭스
            </h2>
            <span className="text-xs text-[#FF4D6D] font-bold">
              VIP 서포터 우대 프로그램
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 px-4">등급 (Tier)</th>
                  <th className="py-3 px-4">누적 당근</th>
                  <th className="py-3 px-4">명예의 전당</th>
                  <th className="py-3 px-4">1:1 시크릿톡</th>
                  <th className="py-3 px-4">15초 보이스</th>
                  <th className="py-3 px-4">영수증 티켓</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {TIER_MATRIX.map((t) => (
                  <tr key={t.tier} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">{t.tier}</td>
                    <td className="py-3.5 px-4 font-num text-[#FF4D6D]">{t.carrots}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.hallOfFame}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.secretChat}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.voiceNote}</td>
                    <td className="py-3.5 px-4 text-slate-400">{t.receipt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
