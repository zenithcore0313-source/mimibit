import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, ArrowRight, Shield, 
  Coins, Trophy, HeartHandshake, Zap, Target, Smartphone, Flame 
} from 'lucide-react';

export function PitchDeckLanding({ onGoToProfile }) {
  const [selectedFaq, setSelectedFaq] = useState(null);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#FCD5DC] shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[#E4092B]/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        {/* Official Logo Banner */}
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="MIMIBIT" className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-md hover:scale-105 transition-transform" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0F2] text-[#E4092B] text-xs font-black mb-3 border border-[#FCD5DC]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>POP & VIVID CREATOR DONATION PLATFORM</span>
        </div>

        <h1 className="font-bubble font-black text-3xl sm:text-5xl text-[#1C1215] tracking-tight leading-tight">
          링크 하나로 시작하는<br />
          <span className="bg-gradient-to-r from-[#E4092B] via-[#FA1A3C] to-[#9A101D] bg-clip-text text-transparent">
            마이크로 팬덤 게이미피케이션
          </span> 후원 플랫폼
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#6B5E62] mt-4 leading-relaxed font-medium">
          방송 송출(OBS) 장비 없이 인스타그램·틱톡 프로필 링크 하나로 연동!<br />
          <strong>Top 5 전광판 랭킹전</strong>과 <strong>1:1 시크릿 메신저</strong>로 마이크로 창작자의 지속 가능한 수익을 만듭니다.
        </p>

        {/* CTA Button */}
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={onGoToProfile}
            className="btn-pop-primary px-7 py-3.5 text-sm flex items-center gap-2"
          >
            <span>크리에이터 프로필 둘러보기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Key Numbers (Slide 2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 text-left">
          <div className="p-4 rounded-2xl bg-[#FFF5F7] border border-[#FFCCD5]">
            <span className="text-[11px] font-bold text-[#FF2E63] block">국내 타깃 창작자</span>
            <div className="text-xl sm:text-2xl font-black text-[#1D1E2C] font-outfit mt-0.5">450,000명</div>
            <span className="text-[10px] text-[#72748A]">기존 방송 툴 활용 불가 군단</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A]">
            <span className="text-[11px] font-bold text-[#D97706] block">예상 평균 후원 단가</span>
            <div className="text-xl sm:text-2xl font-black text-[#78350F] font-outfit mt-0.5">15,000원+</div>
            <span className="text-[10px] text-[#92400E]">랭킹전으로 객단가 3배 증대</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <span className="text-[11px] font-bold text-green-700 block">플랫폼 수수료</span>
            <div className="text-xl sm:text-2xl font-black text-green-800 font-outfit mt-0.5">10.0%</div>
            <span className="text-[10px] text-green-600">투네이션 표준 고마진 BM</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE]">
            <span className="text-[11px] font-bold text-blue-700 block">3년차 목표 거래액</span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 font-outfit mt-0.5">100억원</div>
            <span className="text-[10px] text-blue-600">국내 검증 후 글로벌 진출</span>
          </div>
        </div>
      </div>

      {/* Problem Definition (Slide 3) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EC] shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-black text-[#FF2E63] uppercase tracking-wider">
            01. PROBLEM DEFINITION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1D1E2C] mt-1">
            왜 기존 후원 툴로는 마이크로 창작자를 품지 못하는가?
          </h2>
          <p className="text-xs text-[#72748A] mt-1">
            모바일 중심 창작자 생태계와 기존 후원 솔루션 간의 3대 구조적 미스매치
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#F3E8EC] space-y-2">
            <span className="text-xs font-bold text-[#FF2E63]">01. 방송 도구 종속성</span>
            <h3 className="text-sm font-extrabold text-[#1D1E2C]">투네이션 / 트윕의 한계</h3>
            <p className="text-xs text-[#72748A] leading-relaxed">
              OBS 라이브 화면 송출 전제로 설계되어 인스타, 틱톡, 웹툰 등 비방송 창작자는 도입 자체가 불가능합니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#F3E8EC] space-y-2">
            <span className="text-xs font-bold text-[#FF7A00]">02. 정기 생산 번아웃</span>
            <h3 className="text-sm font-extrabold text-[#1D1E2C]">패트리온 / 팬딩의 한계</h3>
            <p className="text-xs text-[#72748A] leading-relaxed">
              매달 고품질 독점 화보나 영상을 발행해야 하므로 심각한 번아웃이 발생하며, 가벼운 응원 후원을 담기엔 진입장벽이 너무 높습니다.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAFAFC] border border-[#F3E8EC] space-y-2">
            <span className="text-xs font-bold text-[#00B4D8]">03. 소통 단절 & 악플 위험</span>
            <h3 className="text-sm font-extrabold text-[#1D1E2C]">인스타그램 DM의 한계</h3>
            <p className="text-xs text-[#72748A] leading-relaxed">
              무분별한 악플과 스팸으로 인해 DM을 닫는 추세이며, 진성 팬은 큰 금액을 후원해도 크리에이터에게 각인될 방법이 없습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Competitive Matrix (Slide 4) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F3E8EC] shadow-sm overflow-x-auto">
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-black text-[#FF2E63] uppercase tracking-wider">
            02. COMPETITOR ANALYSIS
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1D1E2C] mt-1">
            주요 서비스별 비교 우위 분석
          </h2>
          <p className="text-xs text-[#72748A] mt-1">
            MIMIBIT은 방송 종속성을 없애고 게이미피케이션과 통제된 1:1 소통으로 독보적 영역을 구축합니다.
          </p>
        </div>

        <table className="w-full text-xs text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-[#F3E8EC] text-[#72748A]">
              <th className="py-3 px-3">비교 항목</th>
              <th className="py-3 px-3">투네이션/트윕</th>
              <th className="py-3 px-3">패트리온</th>
              <th className="py-3 px-3">인스타그램 DM</th>
              <th className="py-3 px-3 font-extrabold text-[#FF2E63] bg-[#FFF0F4] rounded-t-xl">MIMIBIT (미미빗)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3E8EC]">
            <tr>
              <td className="py-3 px-3 font-bold text-[#1D1E2C]">실시간 방송 필요성</td>
              <td className="py-3 px-3 text-[#72748A]">필수 (OBS 종속)</td>
              <td className="py-3 px-3 text-[#72748A]">불필요</td>
              <td className="py-3 px-3 text-[#72748A]">불필요</td>
              <td className="py-3 px-3 font-extrabold text-[#FF2E63] bg-[#FFF0F4]">완전 불필요 (링크 기반)</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-[#1D1E2C]">정기 콘텐츠 부담</td>
              <td className="py-3 px-3 text-[#72748A]">없음 (단발)</td>
              <td className="py-3 px-3 text-[#72748A]">매우 높음 (구독)</td>
              <td className="py-3 px-3 text-[#72748A]">없음</td>
              <td className="py-3 px-3 font-extrabold text-[#FF2E63] bg-[#FFF0F4]">없음 (가벼운 응원)</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-[#1D1E2C]">팬덤 게이미피케이션</td>
              <td className="py-3 px-3 text-[#72748A]">제한적 룰렛</td>
              <td className="py-3 px-3 text-[#72748A]">없음 (단순 티어)</td>
              <td className="py-3 px-3 text-[#72748A]">없음</td>
              <td className="py-3 px-3 font-extrabold text-[#FF2E63] bg-[#FFF0F4]">Top 5 전광판 + 토끼 5등급</td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-bold text-[#1D1E2C]">1:1 프라이빗 소통</td>
              <td className="py-3 px-3 text-[#72748A]">불가 (공개 알림)</td>
              <td className="py-3 px-3 text-[#72748A]">불가</td>
              <td className="py-3 px-3 text-[#72748A]">스팸/위험 방치</td>
              <td className="py-3 px-3 font-extrabold text-[#FF2E63] bg-[#FFF0F4] rounded-b-xl">티켓제 통제형 1:1 해금</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Core Features Overview (Slide 5, 6, 9) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#F3E8EC] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF0F4] text-[#FF2E63] flex items-center justify-center text-xl">
            🏆
          </div>
          <h3 className="text-base font-extrabold text-[#1D1E2C]">Top 5 전광판 & 토끼 5단계</h3>
          <p className="text-xs text-[#72748A] leading-relaxed">
            1위 후원자의 응원 한마디가 프로필 최상단에 고정 노출되어 인정 욕구를 자극하며, 월간 시즌제 리셋으로 지속 후원을 견인합니다.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F3E8EC] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF9E6] text-[#D97706] flex items-center justify-center text-xl">
            💌
          </div>
          <h3 className="text-base font-extrabold text-[#1D1E2C]">1:1 시크릿 메신저 & 노프레셔</h3>
          <p className="text-xs text-[#72748A] leading-relaxed">
            월간 티켓 소모제로 무분별한 연속 연락을 방지하고, '답장 의무 면제' 정책과 음성/미공개 사진 리워드로 건강하게 교감합니다.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#F3E8EC] shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#F0FDF4] text-green-700 flex items-center justify-center text-xl">
            🎫
          </div>
          <h3 className="text-base font-extrabold text-[#1D1E2C]">스토리 영수증 티켓 바이럴</h3>
          <p className="text-xs text-[#72748A] leading-relaxed">
            후원 즉시 발급되는 감성 티켓을 인스타 스토리에 공유하고 창작자가 리포스트하여 CAC(고객획득비용) 0원 바이럴 루프를 만듭니다.
          </p>
        </div>
      </div>

      {/* Vision Statement (Slide 11) */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#E4092B] via-[#FA1A3C] to-[#9A101D] text-white text-center shadow-lg shadow-[#E4092B]/25">
        <span className="text-[11px] font-black tracking-widest uppercase opacity-90 block mb-2">
          MIMIBIT VISION
        </span>
        <blockquote className="text-xl sm:text-2xl font-black max-w-2xl mx-auto leading-relaxed">
          "세상의 모든 작은 창작자가 팬과 진심으로 닿고, 정당한 가치를 누리는 공간을 만듭니다."
        </blockquote>
        <p className="text-xs opacity-80 mt-4 max-w-lg mx-auto">
          주식회사 미미빗 (MIMIBIT Corp.) | contact@mimibit.me
        </p>

        <button
          onClick={onGoToProfile}
          className="mt-6 px-7 py-3 rounded-2xl bg-white text-[#E4092B] font-black text-xs hover:bg-[#FFF0F2] transition-all shadow-md cursor-pointer"
        >
          크리에이터 바이오링크 바로가기
        </button>
      </div>
    </div>
  );
}
