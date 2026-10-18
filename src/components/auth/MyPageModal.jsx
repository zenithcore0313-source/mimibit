import React, { useState } from 'react';
import { 
  X, User, Ticket, Award, Heart, Sparkles, ExternalLink, 
  ArrowRight, ShieldCheck, Play, Pause, Download, LogOut, ChevronRight, MessageCircle 
} from 'lucide-react';

export function MyPageModal({ 
  isOpen, 
  onClose, 
  user, 
  onLogout, 
  onOpenDonate, 
  onSwitchToCreator, 
  onOpenCharge, 
  onOpenMessenger,
  transactions = [] 
}) {
  const [activeTab, setActiveTab] = useState('sponsorships');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in custom-scrollbar overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl border-2 border-[#FCD5DC] shadow-2xl overflow-hidden relative my-6">

        {/* Modal Top Bar */}
        <div className="bg-[#140E10] text-white p-6 sm:p-7 flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-3 border-white shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-sm">🥕</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-[#FEF3C7] text-[#B45309]'
                }`}>
                  {user.role === 'admin' ? '👑 SYSTEM ROOT ADMIN' : user.tier ? `${user.tier.icon} ${user.tier.name}` : '서포터'}
                </span>
                <span className="text-[10px] text-white/50">{user.email}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white mt-1">
                {user.name} 님의 {user.role === 'admin' ? '루트 마스터 지갑' : '팬덤 지갑'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallet Overview Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-6 bg-[#FFF9FA] border-b border-[#FCD5DC] text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-[#7A696E] block">보유 당근 (Carrots)</span>
              <div className="text-lg sm:text-xl font-heading font-black text-[#E4092B] font-num mt-0.5">
                {user.carrotsBalance.toLocaleString()} 🥕
              </div>
              <span className="text-[10px] text-[#7A696E] font-num">≈ {(user.carrotsBalance * 100).toLocaleString()}원 가치</span>
            </div>
            <button
              onClick={() => { onClose(); onOpenCharge && onOpenCharge(); }}
              className="mt-2 w-full py-1.5 px-2 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white text-[11px] font-black flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>당근 충전소</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs">
            <span className="text-[11px] font-medium text-[#7A696E] block">1:1 시크릿 티켓</span>
            <div className="text-lg sm:text-xl font-heading font-black text-[#140E10] font-num mt-0.5">
              {user.role === 'admin' ? '무제한 🎫' : `${user.tickets || 0}장 🎫`}
            </div>
            <span className="text-[10px] text-[#E4092B] font-bold">
              {user.role === 'admin' ? '👑 전 채널 마스터 해금' : '비동기 소통 해금'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#FCD5DC] shadow-2xs col-span-2 sm:col-span-1">
            <span className="text-[11px] font-medium text-[#7A696E] block">
              {user.role === 'admin' ? '권한 상태' : '다음 티어 승급'}
            </span>
            <div className="text-xs font-black text-[#0284C7] mt-1">
              {user.role === 'admin' ? '👑 ROOT MASTER (전체 해금)' : '💎 다이아 래빗'}
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full rounded-full ${user.role === 'admin' ? 'w-full bg-amber-500' : 'w-[65%] bg-[#E4092B]'}`}></div>
            </div>
            <span className="text-[9px] text-[#7A696E] font-num mt-1 block">
              {user.role === 'admin' ? '모든 크리에이터 & 기능 접근 가능' : '1,500 🥕 추가 후원 시 승급'}
            </span>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="px-6 pt-4 flex gap-2 border-b border-[#FCD5DC] text-xs font-black">
          <button
            onClick={() => setActiveTab('sponsorships')}
            className={`pb-3 px-3 relative cursor-pointer ${
              activeTab === 'sponsorships' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            후원한 창작자
            {activeTab === 'sponsorships' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`pb-3 px-3 relative cursor-pointer ${
              activeTab === 'tickets' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            소장 영수증 티켓 (2)
            {activeTab === 'tickets' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-3 relative cursor-pointer ${
              activeTab === 'messages' ? 'text-[#E4092B]' : 'text-[#7A696E] hover:text-[#140E10]'
            }`}
          >
            1:1 시크릿 메신저 & 보이스
            {activeTab === 'messages' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E4092B]"></span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 text-xs max-h-[380px] overflow-y-auto custom-scrollbar">

          {/* TAB 1: Sponsorships */}
          {activeTab === 'sponsorships' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Luna Rabbit"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-heading font-black text-sm text-[#140E10]">
                      Luna Rabbit (루나)
                    </h4>
                    <span className="text-[11px] text-[#7A696E]">누적 3,400개 후원 · 1위 전광판 등록 중</span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                  className="px-3 py-1.5 rounded-xl bg-[#E4092B] text-white text-xs font-black shadow-xs cursor-pointer"
                >
                  응원 보내기
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#FCD5DC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="치비 스케치"
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-heading font-black text-sm text-[#140E10]">
                      치비 스케치
                    </h4>
                    <span className="text-[11px] text-[#7A696E]">누적 100개 후원 · 실버 서포터</span>
                  </div>
                </div>
                <button
                  onClick={() => { onClose(); onOpenDonate && onOpenDonate(); }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFF0F2] text-[#E4092B] border border-[#FCD5DC] text-xs font-black cursor-pointer"
                >
                  응원 보내기
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Receipt Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-3">
              {transactions && transactions.length > 0 && (
                <div className="space-y-2 mb-4">
                  <span className="text-[11px] font-bold text-[#E4092B] block">최근 전자 결제 영수증</span>
                  {transactions.map((tx) => (
                    <div key={tx.orderId} className="bg-[#FFF9FA] rounded-2xl border border-[#FCD5DC] p-3.5 flex items-center justify-between font-mono text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black">
                            {tx.paymentMethod} 결제완료
                          </span>
                          <span className="text-[10px] text-[#7A696E]">{tx.date}</span>
                        </div>
                        <div className="font-heading font-black text-sm text-[#140E10] mt-1">
                          +{tx.totalCarrots.toLocaleString()} 🥕 충전 ({tx.price.toLocaleString()}원)
                        </div>
                        <span className="text-[10px] text-[#7A696E] font-sans">주문번호: {tx.orderId}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-emerald-600 bg-white border border-emerald-200 px-2 py-0.5 rounded-full">
                          승인완료
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <span className="text-[11px] font-bold text-[#140E10] block">창작자 후원 소장 티켓</span>
              <div className="bg-[#FFFDFD] rounded-2xl border-2 border-dashed border-[#F89CAE] p-4 relative overflow-hidden">
                <div className="flex justify-between items-center text-[#7A696E] border-b border-[#FCD5DC] pb-2 mb-2 font-mono text-[10px]">
                  <span className="font-black text-[#E4092B]">★ MIMIBIT OFFICIAL RECEIPT #1024 ★</span>
                  <span className="font-num">2026.10.14</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-heading font-black text-sm text-[#140E10]">Luna Rabbit (루나) 후원 티켓</div>
                    <div className="text-[#E4092B] font-black mt-0.5">골드 래빗 (🥇 1,000 당근 / 100,000원)</div>
                  </div>
                  <div className="border border-[#E4092B] text-[#E4092B] text-[9px] font-black px-2 py-0.5 rounded-md -rotate-6">
                    VERIFIED 🥕
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Messages & Voice */}
          {activeTab === 'messages' && (
            <div className="space-y-3">
              <button
                onClick={() => { onClose(); onOpenMessenger && onOpenMessenger(); }}
                className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-black text-white flex items-center justify-between shadow-sm transition-all cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#E4092B]">
                    <MessageCircle className="w-5 h-5 text-rose-400" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-xs text-white">1:1 시크릿톡 라운지 열기</span>
                    <span className="text-[11px] text-slate-400">크리에이터와의 프라이빗 1:1 대화방</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full font-bold">
                    보유 티켓 {user.tickets || 5}장
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </button>

              <div className="p-4 rounded-2xl bg-[#FFF5F6] border border-[#FCD5DC] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <strong className="text-[#E4092B]">To. Luna Rabbit</strong>
                  <span className="text-[#7A696E]">2일 전</span>
                </div>
                <p className="text-[#140E10]">"루나님 이번 일러스트북 인쇄 잘되길 바랄게요! 화이팅 🎨"</p>
                <div className="pt-2 border-t border-[#FCD5DC] flex items-center justify-between">
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    ✓ 창작자 확인 완료
                  </span>
                  <button
                    onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                    className="px-3 py-1 rounded-xl bg-[#E4092B] text-white text-[10px] font-black flex items-center gap-1 cursor-pointer"
                  >
                    {isPlayingVoice ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>루나의 감사 보이스 메모 (0:15)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-[#FCD5DC] flex items-center justify-between">
          <button
            onClick={() => { onClose(); onSwitchToCreator && onSwitchToCreator(); }}
            className="text-xs font-black text-[#5E5054] hover:text-[#E4092B] flex items-center gap-1 cursor-pointer"
          >
            <span>창작자 스튜디오로 전환</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => { onLogout(); onClose(); }}
            className="flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>로그아웃</span>
          </button>
        </div>

      </div>
    </div>
  );
}
