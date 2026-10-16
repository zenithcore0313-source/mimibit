import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, MessageCircle, Mail, 
  ArrowLeft, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 
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
      a: '당근 1개는 100원의 가치를 가지며, 신용카드, 카카오페이, 네이버페이, 휴대폰 결제로 즉시 충전하여 응원 메시지와 함께 창작자에게 선물할 수 있습니다.'
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
      a: '네! 창작자 스튜디오 관리자 메뉴에서 악성 사용자를 원클릭으로 영구 제명할 수 있으며, 제명된 사용자는 해당 크리에이터에게 더 이상 후원하거나 메시지를 보낼 수 없습니다.'
    }
  ]
};

export function FaqPage({ onOpenStudio, onBackToHome }) {
  const [activeCategory, setActiveCategory] = useState('creator');
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleAccordion = (index) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const currentFaqs = FAQ_DATA[activeCategory] || [];

  return (
    <div className="min-h-screen bg-[#FAFAFB] py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 hover:text-[#E4092B] transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인 홈으로 돌아가기</span>
          </button>
          <span className="text-xs font-bold text-slate-400">
            MIMIBIT · 고객지원 & FAQ
          </span>
        </div>

        {/* Page Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#E4092B] text-xs font-black border border-slate-200/80 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>CUSTOMER SUPPORT & FAQ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight">
            자주 묻는 질문 & 이용 가이드
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-600 mt-2.5 font-medium leading-relaxed">
            미미빗 서비스 이용 및 창작자 정산과 관련하여 가장 많이 궁금해하시는 질문들을 모았습니다.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'creator', label: '🎨 창작자 FAQ' },
            { id: 'supporter', label: '🥕 후원자 FAQ' },
            { id: 'refund', label: '💳 결제 및 환불' },
            { id: 'safety', label: '🛡️ 안전 및 제재' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveCategory(tab.id); setOpenIndexes({}); }}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-[#E4092B] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-rose-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-16">
          {currentFaqs.map((faq, idx) => {
            const isOpen = !!openIndexes[idx];
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border-2 border-slate-200/80 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-black text-sm text-slate-900 hover:text-[#E4092B] transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[#E4092B] font-black font-num">Q.</span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#E4092B] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-[#FFF0F2] bg-[#FFFDFD] font-medium animate-fade-in">
                    <span className="font-bold text-[#E4092B] block mb-1">A. 답변:</span>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 1:1 Contact Banner */}
        <div className="p-8 rounded-3xl bg-white border-2 border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-[#FEE500] text-black flex items-center justify-center text-xl shrink-0 shadow-xs">
              💬
            </span>
            <div>
              <h3 className="text-base font-heading font-black text-slate-900">
                원하시는 답변을 찾지 못하셨나요?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                미미빗 공식 카카오톡 채널이나 1:1 창작자 매니저에게 실시간으로 문의하세요.
              </p>
            </div>
          </div>

          <a
            href="https://pf.kakao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-[#FEE500] hover:bg-[#FADA0A] text-[#3C1E1E] text-xs font-black transition-colors shrink-0 flex items-center gap-2 shadow-2xs"
          >
            <MessageCircle className="w-4 h-4 fill-[#3C1E1E]" />
            <span>카카오톡 1:1 상담 연결</span>
          </a>
        </div>

      </div>
    </div>
  );
}
