import React from 'react';
import { Smartphone, Check, X, ShieldCheck, Zap, Heart, MessageCircle, Trophy, Lock } from 'lucide-react';

export function ToonMobileFeatureSection({ onOpenCreatorDemo }) {
  const FEATURES = [
    {
      icon: Smartphone,
      iconBg: 'bg-rose-50 text-[#E4092B]',
      title: 'OBS 방송 장비 불필요',
      desc: '기존 투네이션·트윕처럼 라이브 송출 컴퓨터와 위젯을 설정할 필요가 없습니다. 인스타그램·틱톡 프로필 링크에 등록하는 즉시 팬 후원이 열립니다.',
      bad: '복잡한 OBS 송출 세팅 & 위젯 연결',
      good: '프로필 링크 하나로 1분 만에 시작',
    },
    {
      icon: Zap,
      iconBg: 'bg-amber-50 text-amber-600',
      title: '정기 생산 번아웃 ZERO',
      desc: '패트리온이나 유료 구독처럼 매달 고화질 화보, 영상, 독점작을 강제로 마감해야 하는 압박이 없습니다. 가벼운 당근 응원과 15초 감사 음성으로 충분합니다.',
      bad: '매월 고품질 독점 콘텐츠 마감 압박',
      good: '가벼운 응원과 15초 음성 답례품',
    },
    {
      icon: Trophy,
      iconBg: 'bg-emerald-50 text-emerald-600',
      title: '투네이션 표준 10.0% 수수료',
      desc: '앱스토어 인앱 결제 30%나 아프리카TV 40% 대비 압도적으로 합리적인 투네이션 표준 10.0% 모델을 적용하며, 부가세는 팬 충전단에서 분리 결제됩니다.',
      bad: '아프리카TV 40% · 앱스토어 30% 수수료',
      good: '최대 90% (원천징수 시 86.7%) 익일 직통 입금',
    },
    {
      icon: Lock,
      iconBg: 'bg-blue-50 text-[#0064FF]',
      title: '철저한 개인정보 보호',
      desc: '팬에게 개인 계좌번호나 실명을 노출할 필요가 없습니다. 토스페이먼츠 에스크로 결제와 안심 1:1 시크릿톡으로 안전한 후원 환경을 제공합니다.',
      bad: '계좌번호 노출로 인한 사생활 침해 위험',
      good: '공식 에스크로 결제 & 1:1 안심 시크릿톡',
    },
  ];

  return (
    <section id="why-mimibit" className="py-20 sm:py-28 bg-[#FAFAFB] border-b border-slate-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#E4092B] uppercase tracking-wider bg-rose-50 px-3.5 py-1 rounded-full border border-rose-100/60 inline-block mb-3">
            WHY MIMIBIT
          </span>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
            기존 후원 툴과 미미빗의 결정적 차이
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-3 font-normal leading-relaxed">
            방송 장비 종속성과 매달 독점작 마감 압박에서 벗어나 가장 자유롭게 수익을 창출하세요.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-2.5 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="line-through">{item.bad}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Check className="w-4 h-4 text-[#E4092B] shrink-0" />
                    <span>{item.good}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
