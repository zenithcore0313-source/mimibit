import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, 
  ArrowLeft, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Zap 
} from 'lucide-react';

const FAQ_DATA = {
  creator: [
    {
      q: '창작자로 활동하려면 라이브 방송을 꼭 해야 하나요?',
      a: '전혀 아닙니다! 미미빗은 OBS 방송 송출이 어려운 일러스트레이터, 웹툰 작가, 코스어, 작곡가, 숏폼 창작자 등 비방송 마이크로 창작자를 위한 D2C 플랫폼입니다. 스마트폰으로 프로필 링크 하나만 개설하면 바로 후원을 받을 수 있습니다.'
    },
    {
      q: '정산 수수료 10.0% 외에 숨겨진 추가 비용이 있나요?',
      a: '전혀 없습니다. 투네이션과 동일한 10.0% 표준 단일 수수료 정책이며, 부가세 10%는 팬 충전 시 별도 결제되어 창작자 정산금에서 PG 수수료가 중복 공제되지 않습니다. 입점비나 월 서버 유지비도 0원입니다.'
    },
    {
      q: '정산금은 언제 어떻게 입금되나요?',
      a: '창작자 스튜디오에서 출금 신청 시, 플랫폼 수수료 10% 및 사업소득 원천징수 3.3%(개인 창작자 기준, 사업자는 세금계산서 발행 시 90.0% 전액)를 정산하여 영업일 기준 익일 오전 10:00에 등록하신 본인 실명 계좌로 입금됩니다.'
    },
    {
      q: '1:1 시크릿 메신저의 "답장 의무 면제(No Pressure)"가 무엇인가요?',
      a: '후원자가 티켓을 소모해 메시지를 보내더라도, 창작자에게는 24시간 실시간 답변이나 의무적인 답장 부담을 지우지 않는 미미빗만의 번아웃 방지 정책입니다. 창작자가 여유가 될 때 감사 음성 메모나 이모지로 편하게 소통하시면 됩니다.'
    }
  ],
  supporter: [
    {
      q: '당근은 어떻게 충전하고 사용하나요?',
      a: '당근 1개는 100원의 가치를 가지며, 신용카드, 카카오페이, 토스페이, 네이버페이, 휴대폰 결제로 즉시 충전하여 응원 메시지와 함께 창작자에게 선물할 수 있습니다.'
    },
    {
      q: 'Top 5 전광판 랭킹전은 언제 순위가 리셋되나요?',
      a: '매월 1일 오전 0시(KST)에 월간 시즌 순위가 새롭게 리셋됩니다. 지난달 1위 후원자의 기록은 창작자 프로필 내 명예의 전당 탭에 영구 박제됩니다.'
    },
    {
      q: '토끼 티어 등급은 언제까지 유지되나요?',
      a: '당월 누적 후원 당근 개수에 따라 실시간으로 승급되며, 달성한 등급과 프로필 전용 배지는 해당 월 말일까지 유지됩니다.'
    },
    {
      q: '후원 영수증 티켓을 인스타 스토리에 공유하려면 어떻게 하나요?',
      a: '후원 완료 즉시 생성되는 감성 영수증 티켓 하단의 [인스타 스토리 공유] 버튼을 누르면 이미지로 저장되거나 인스타그램 앱으로 원클릭 공유할 수 있습니다.'
    }
  ],
  refund: [
    {
      q: '후원 완료 후 취소나 환불이 가능한가요?',
      a: '디지털 후원의 특성상 창작자에게 실시간 노출(전광판 랭킹 반영, 시크릿 티켓 발급, 미공개 화보 열람 등)이 완료된 이후에는 단순 변심으로 인한 환불이 불가합니다. 단, 시스템 결제 중복 오류의 경우 고객센터를 통해 즉시 취소 가능합니다.'
    },
    {
      q: '미성년자 결제 시 취소 처리는 어떻게 되나요?',
      a: '법정대리인의 동의 없는 미성년자 결제의 경우 법령에 따라 확인 서류 검토 후 신속히 취소 및 환불을 진행해 드립니다.'
    }
  ],
  safety: [
    {
      q: 'AI 비속어 차단 봇은 어떤 역할을 하나요?',
      a: '성희롱, 욕설, 협박 등 유해 키워드가 포함된 응원 메시지나 1:1 시크릿 메신저 요청을 AI가 0.1초 만에 자동 필터링하여 창작자 화면에 노출되지 않도록 원천 차단합니다.'
    },
    {
      q: '스팸이나 악성 후원자를 직접 차단할 수 있나요?',
      a: '창작자 스튜디오 내 [팬덤 관리] 메뉴에서 특정 유저의 메시지 수신 및 후원을 영구 차단할 수 있습니다.'
    }
  ]
};

export function FaqPage({ onOpenStudio, onBackToHome }) {
  const [activeCategory, setActiveCategory] = useState('creator');
  const [openIndices, setOpenIndices] = useState([0]); // First item open by default

  const toggleAccordion = (idx) => {
    if (openIndices.includes(idx)) {
      setOpenIndices(openIndices.filter((i) => i !== idx));
    } else {
      setOpenIndices([...openIndices, idx]);
    }
  };

  const categories = [
    { id: 'creator', label: '창작자 가이드' },
    { id: 'supporter', label: '서포터 이용안내' },
    { id: 'refund', label: '정산 & 결제환불' },
    { id: 'safety', label: '안심 보호 정책' }
  ];

  return (
    <div className="min-h-screen bg-[#06080D] text-white py-16 sm:py-24 font-sans select-none relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-20 right-1/3 w-[800px] h-[500px] bg-gradient-to-tr from-[#E4092B]/15 via-purple-600/10 to-transparent rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '44px 44px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10">

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
            MIMIBIT HELP & FAQ CENTER
          </span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center mb-16 space-y-4 break-keep">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E4092B]/10 text-[#FF4D6D] text-xs font-bold border border-[#E4092B]/20 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#FF4D6D]" />
            <span>궁금하신 점을 빠르게 해결해 드립니다</span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black text-white tracking-tight leading-tight">
            자주 묻는 질문과<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#E4092B]">
              완벽한 이용 가이드.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 font-normal leading-relaxed pt-2">
            가입부터 링크 생성, 1:1 시크릿톡, 익일 정산까지 가장 많이 묻는 질문들을 모았습니다.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 mb-12 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndices([0]);
              }}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#E4092B] text-white shadow-lg shadow-[#E4092B]/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-16">
          {FAQ_DATA[activeCategory].map((item, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="font-heading font-black text-base sm:text-lg text-white">
                    {item.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#FF4D6D]' : 'text-slate-400'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-sm text-slate-300 leading-relaxed font-normal border-t border-white/5 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 1:1 Support Card */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 border border-white/15 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-heading font-black text-xl text-white">더 궁금한 점이 있으신가요?</h3>
            <p className="text-xs text-slate-400 font-normal">
              미미빗 창작자 지원팀(partner@mimibit.me)으로 문의하시면 24시간 내에 답변해 드립니다.
            </p>
          </div>
          <button
            onClick={onOpenStudio}
            className="px-6 py-3.5 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs shadow-lg shadow-[#E4092B]/30 shrink-0 cursor-pointer transition-all active:scale-95"
          >
            창작자 스튜디오 문의하기
          </button>
        </div>

      </div>

    </div>
  );
}
