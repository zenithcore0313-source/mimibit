import React, { useState } from 'react';
import { 
  Sparkles, Crown, Ticket, Volume2, Image as ImageIcon, ShieldAlert, Award, 
  ArrowLeft, ArrowRight, Check, CheckCircle2, Heart, HelpCircle, ShieldCheck, Flame
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
            MIMIBIT · 후원 콘텐츠 & 메커니즘 안내
          </span>
        </div>

        {/* Page Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-50 text-[#E4092B] text-xs font-black border border-slate-200/80 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MIMIBIT GAMIFICATION MECHANISM</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            미미빗 후원 메커니즘 상세 가이드
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 mt-3 font-medium leading-relaxed">
            단순 송금형 후원을 넘어 팬의 인정 욕구와 소장 가치를 극대화하여 건당 결제 단가를 3배 높이는 7대 핵심 기능을 소개합니다.
          </p>
        </div>

        {/* 7 Core Mechanisms Detailed Deep Dive */}
        <div className="space-y-8 mb-16">

          {/* Section 1: Top 5 Billboard & Season Reset */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#FFB703]/50 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-2xl flex items-center justify-center shadow-xs">
                  👑
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#B45309] tracking-wider block">
                    MECHANISM 01 · HALL OF FAME
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                    Top 5 전광판 랭킹전 & 월간 시즌제
                  </h2>
                </div>
              </div>
              <span className="text-xs font-black text-[#B45309] bg-[#FEF3C7] px-3.5 py-1 rounded-full border border-[#FDE68A]">
                평균 결제 단가 15,000원+ 견인
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-[#E4092B] block mb-1">
                  1. 실시간 최상단 고정 노출
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  크리에이터 프로필 최상단에 1위 후원자의 닉네임과 응원 한마디가 실시간 전광판 롤링 배너로 고정됩니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-[#E4092B] block mb-1">
                  2. 매월 1일 0시 시즌 리셋
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  누적 순위 고착화를 방지하고 매달 새로운 1위 타이틀을 차지하기 위한 팬덤 간의 건전한 경쟁을 유도합니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-[#E4092B] block mb-1">
                  3. 명예의 전당 영구 아카이빙
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  역대 시즌별 1위 후원자는 프로필 내 '명예의 전당' 탭에 박제되어 영구적인 팬덤 지위를 보장받습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: 1:1 Secret Messenger & No Pressure Rule */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#E4092B]/30 shadow-sm">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E4092B] text-2xl flex items-center justify-center shadow-xs">
                  💌
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase text-[#E4092B] tracking-wider block">
                    MECHANISM 02 · PRIVATE LOUNGE
                  </span>
                  <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900">
                    1:1 시크릿 메신저 (답장 의무 면제 시스템)
                  </h2>
                </div>
              </div>
              <span className="text-xs font-black text-[#E4092B] bg-rose-50 px-3.5 py-1 rounded-full border border-slate-200/80">
                창작자 번아웃 제로 설계
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-slate-900 block mb-1">
                  1. 티켓 소모제 비동기 카드
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  24시간 실시간 카톡이 아닌, 티켓 1장 = 메시지 1통 작성 방식으로 스팸과 과도한 연락 피로도를 원천 차단합니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-[#E4092B] block mb-1">
                  2. No Pressure 정책 공지
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  "답장 의무 면제"가 시스템 약관에 명시되어 있어 창작자는 심리적 압박 없이 여유 시간에만 팬들과 소통합니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <strong className="text-sm font-heading font-black text-slate-900 block mb-1">
                  3. 음성 메모 및 스티커 리액션
                </strong>
                <p className="text-slate-600 leading-relaxed">
                  창작자가 답장을 보낼 때 짧은 감사 음성 메시지나 전용 이모지를 동봉하여 VIP 팬에게 큰 감동을 선사합니다.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Rabbit Tier Comparison Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200/80 shadow-sm mb-16">
          <div className="text-center mb-8">
            <span className="text-[10px] font-black uppercase text-[#E4092B] bg-rose-50 px-3 py-1 rounded-full border border-slate-200/80">
              TIER MATRIX
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 mt-2">
              5단계 토끼 티어별 혜택 비교표
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              후원 금액에 따라 팬덤 등급 배지와 프리미엄 리워드가 차등 해금됩니다
            </p>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200/80 text-slate-900 bg-slate-50">
                  <th className="p-3.5 font-heading font-black">티어 등급</th>
                  <th className="p-3.5 font-heading font-black">기준 당근</th>
                  <th className="p-3.5 font-heading font-black">프로필 배지</th>
                  <th className="p-3.5 font-heading font-black">전광판 노출</th>
                  <th className="p-3.5 font-heading font-black">1:1 시크릿</th>
                  <th className="p-3.5 font-heading font-black">미공개 화보</th>
                  <th className="p-3.5 font-heading font-black">보이스 리워드</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FCD5DC]">
                {TIER_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-black text-slate-900">{row.tier}</td>
                    <td className="p-3.5 font-num font-bold text-[#E4092B]">{row.carrots}</td>
                    <td className="p-3.5 font-medium">{row.badge}</td>
                    <td className="p-3.5 font-medium">{row.hallOfFame}</td>
                    <td className="p-3.5 font-medium">{row.secretChat}</td>
                    <td className="p-3.5 font-medium">{row.secretPhoto}</td>
                    <td className="p-3.5 font-medium text-[#E4092B] font-bold">{row.voiceNote}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#140E10] to-[#2B171D] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-heading font-black">
              실제 화면에서 이 모든 기능을 직접 테스트해보세요
            </h3>
            <p className="text-xs text-white/70 mt-1 font-medium">
              대표 크리에이터 루나(Luna Rabbit)의 실물 프로필에서 당근 후원과 랭킹전을 체험하실 수 있습니다.
            </p>
          </div>
          <button
            onClick={onOpenCreatorDemo}
            className="btn-pop-primary px-7 py-3.5 text-xs font-black shrink-0 flex items-center gap-2"
          >
            <span>인터랙티브 프로필 체험하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
