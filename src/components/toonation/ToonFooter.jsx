import React, { useState } from 'react';
import { ShieldCheck, Lock, ExternalLink, X } from 'lucide-react';

export function ToonFooter({ onNavigate }) {
  const [activePolicy, setActivePolicy] = useState(null); // 'terms', 'privacy', 'settlement'

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Link Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer focus:outline-none"
            >
              <img src="/logo.png" alt="MIMIBIT" className="h-7 w-auto object-contain brightness-110" />
              <span className="text-slate-700">|</span>
              <span className="text-white font-bold text-sm tracking-tight">주식회사 미미빗</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-5 text-xs font-semibold text-slate-300">
            <button onClick={() => onNavigate && onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
              미미빗 소개
            </button>
            <button onClick={() => onNavigate && onNavigate('creators')} className="hover:text-white transition-colors cursor-pointer">
              크리에이터 탐색
            </button>
            <button onClick={() => onNavigate && onNavigate('features')} className="hover:text-white transition-colors cursor-pointer">
              후원 콘텐츠
            </button>
            <button onClick={() => onNavigate && onNavigate('fees')} className="hover:text-white transition-colors cursor-pointer">
              수수료 및 정산안내
            </button>
            <button onClick={() => onNavigate && onNavigate('faq')} className="hover:text-white transition-colors cursor-pointer">
              이용가이드 & FAQ
            </button>
            <a href="mailto:partner@mimibit.me" className="hover:text-white transition-colors cursor-pointer">
              크리에이터 제휴 및 입점 문의
            </a>
          </div>
        </div>

        {/* Corporate Legal & Compliance Details */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-[11px] leading-relaxed text-slate-500">
          <div className="space-y-1">
            <p>
              (주)미미빗 | 대표자: 홍길동 | 사업자등록번호: 214-88-92410 | 통신판매업신고: 제2026-서울강남-01429호
            </p>
            <p>
              사업장 주소: 서울특별시 강남구 테헤란로 152 강남파이낸스센터 18층 | 파트너십 문의: partner@mimibit.me | 고객센터: 1588-0928
            </p>
            <p className="text-slate-600 pt-1">
              안전결제(에스크로) 인증: 당사는 전자상거래 안전을 위해 토스페이먼츠 및 KG이니시스 에스크로 구매안전서비스에 가입되어 있습니다.
            </p>
            <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-400">
              <button 
                onClick={() => setActivePolicy('terms')}
                className="hover:underline hover:text-white cursor-pointer"
              >
                서비스 이용약관
              </button>
              <span>·</span>
              <button 
                onClick={() => setActivePolicy('privacy')}
                className="hover:underline hover:text-white font-bold cursor-pointer"
              >
                개인정보처리방침
              </button>
              <span>·</span>
              <button 
                onClick={() => setActivePolicy('settlement')}
                className="hover:underline hover:text-white cursor-pointer"
              >
                크리에이터 정산 규정
              </button>
            </div>
          </div>

          <div className="text-left md:text-right text-[10px] text-slate-600 shrink-0">
            <p>© 2026 MIMIBIT Inc. All rights reserved.</p>
            <p className="text-slate-700 mt-0.5">Micro-Fandom Bio-Link Sponsorship Platform</p>
          </div>
        </div>

      </div>

      {/* Simple Policy Modal */}
      {activePolicy && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 text-slate-800 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-black text-sm text-slate-900">
                {activePolicy === 'terms' && '서비스 이용약관'}
                {activePolicy === 'privacy' && '개인정보처리방침 (공시)'}
                {activePolicy === 'settlement' && '크리에이터 정산 규정'}
              </h3>
              <button 
                onClick={() => setActivePolicy(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 text-xs text-slate-600 leading-relaxed max-h-72 overflow-y-auto space-y-2.5 custom-scrollbar">
              {activePolicy === 'terms' && (
                <>
                  <p>제1조 (목적) 본 약관은 주식회사 미미빗(이하 "회사")이 제공하는 마이크로 팬덤 후원 중개 플랫폼 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.</p>
                  <p>제2조 (용어의 정의) "당근"이란 플랫폼 내에서 창작자에게 후원하거나 리워드를 열람하기 위해 결제하는 가상 디지털 재화를 의미합니다.</p>
                  <p>제3조 (환불 규정) 미사용 당근은 결제일로부터 7일 이내 전액 환불이 가능하며, 이미 크리에이터에게 전송 완료된 후원금은 전자상거래법에 따라 환불이 제한될 수 있습니다.</p>
                </>
              )}
              {activePolicy === 'privacy' && (
                <>
                  <p>주식회사 미미빗은 개인정보보호법에 따라 이용자의 개인정보 및 권익을 보호하고 개인정보와 관련한 이용자의 고충을 원활하게 처리할 수 있도록 다음과 같은 처리방침을 두고 있습니다.</p>
                  <p>1. 수집 항목: 이름, 이메일, 닉네임, 휴대전화번호(본인확인 시), 계좌번호(크리에이터 정산 시)</p>
                  <p>2. 보유 기간: 회원 탈퇴 시까지 (전자상거래법 등 관계법령에 따른 보존의무 기간 준수)</p>
                </>
              )}
              {activePolicy === 'settlement' && (
                <>
                  <p>1. 수수료 기준: 후원 전환액의 10.0%가 플랫폼 수수료로 공제되며, 결제 부가세는 팬 충전단에서 처리됩니다.</p>
                  <p>2. 정산 지급일: 크리에이터 스튜디오를 통한 출금 신청 시, 영업일 기준 익일 오전 10:00에 등록된 본인 명의 계좌로 입금됩니다.</p>
                  <p>3. 원천징수: 개인 창작자는 사업소득 원천징수(3.3%) 후 86.7% 지급되며, 사업자등록증 보유 창작자는 세금계산서 발행 시 90.0% 전액 지급됩니다.</p>
                </>
              )}
            </div>
            <button
              onClick={() => setActivePolicy(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-black"
            >
              확인 및 닫기
            </button>
          </div>
        </div>
      )}

    </footer>
  );
}
