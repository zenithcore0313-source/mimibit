import React, { useState } from 'react';
import { X, Heart, Shield, Check, CreditCard, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DONATION_PACKAGES } from '../data/initialData';

export function DonationModal({ isOpen, onClose, creator, onCompleteDonation, presetCarrots, currentUser }) {
  if (!isOpen) return null;

  const [selectedCarrots, setSelectedCarrots] = useState(presetCarrots || 1000);
  const [customCarrots, setCustomCarrots] = useState('');
  const [nickname, setNickname] = useState(() => currentUser?.name || currentUser?.nickname || '');
  const [supportMessage, setSupportMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('toss');
  const [isProcessing, setIsProcessing] = useState(false);

  const finalCarrots = customCarrots ? parseInt(customCarrots, 10) || 0 : selectedCarrots;
  const finalPrice = finalCarrots * 100;

  // Predict tier
  const getPredictedTier = (carrots) => {
    if (carrots >= 5000) return { name: '당근 로열 래빗 👑', level: 5, color: '#FFB703' };
    if (carrots >= 3000) return { name: '다이아 래빗 💎', level: 4, color: '#00B4D8' };
    if (carrots >= 1000) return { name: '골드 래빗 🥇 (시크릿 메신저 해금!)', level: 3, color: '#F59E0B' };
    if (carrots >= 300) return { name: '실버 래빗 🥈', level: 2, color: '#94A3B8' };
    return { name: '화이트 래빗 🤍', level: 1, color: '#64748B' };
  };

  const predictedTier = getPredictedTier(finalCarrots);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (finalCarrots <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF2E63', '#FF7A00', '#FFB703', '#FFFFFF']
        });
      } catch (err) {
        console.error(err);
      }

      setIsProcessing(false);
      onCompleteDonation({
        carrots: finalCarrots,
        amount: finalPrice,
        nickname: nickname || '익명의 토끼',
        message: supportMessage,
        paymentMethod
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#F3E8EC] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#FFF0F4] to-[#FFF5F7] border-b border-[#F3E8EC] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF2E63] to-[#FF7A00] flex items-center justify-center text-white text-xl shadow-md shadow-[#FF2E63]/20">
              🥕
            </div>
            <div>
              <h3 className="text-base font-black text-[#1D1E2C]">
                {creator.name}에게 당근 후원하기
              </h3>
              <p className="text-xs text-[#72748A]">
                1당근 = 100원 · 랭킹전 실시간 반영 및 티어 혜택 해금
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#72748A] flex items-center justify-center hover:bg-[#FFE5EC] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          {/* Quick Package Selector */}
          <div>
            <label className="block text-xs font-black text-[#1D1E2C] mb-2 flex items-center justify-between">
              <span>후원할 당근 수량 선택</span>
              <span className="text-[11px] font-semibold text-[#FF2E63]">
                예상 등급: {predictedTier.name}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DONATION_PACKAGES.map((pkg) => {
                const isSelected = !customCarrots && selectedCarrots === pkg.carrots;
                return (
                  <button
                    type="button"
                    key={pkg.carrots}
                    onClick={() => {
                      setSelectedCarrots(pkg.carrots);
                      setCustomCarrots('');
                    }}
                    className={`p-3 rounded-2xl text-left transition-all border relative ${
                      isSelected
                        ? 'border-[#FF2E63] bg-[#FFF0F4] shadow-sm'
                        : 'border-[#F3E8EC] bg-[#FAFAFC] hover:border-[#FFCCD5]'
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2 right-2 bg-[#FF2E63] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        ★ 추천
                      </span>
                    )}
                    {pkg.isRoyal && (
                      <span className="absolute -top-2 right-2 bg-[#FFB703] text-[#78350F] text-[9px] font-black px-1.5 py-0.2 rounded-full">
                        👑 1위도전
                      </span>
                    )}
                    <div className="font-outfit font-black text-sm text-[#1D1E2C]">
                      {pkg.carrots.toLocaleString()}🥕
                    </div>
                    <div className="text-[11px] font-extrabold text-[#FF2E63]">
                      {pkg.price.toLocaleString()}원
                    </div>
                    <div className="text-[10px] text-[#72748A] truncate mt-1">
                      {pkg.tierBenefit}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="mt-2.5">
              <input
                type="number"
                min="1"
                placeholder="직접 당근 수량 입력 (예: 500)"
                value={customCarrots}
                onChange={(e) => setCustomCarrots(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3E8EC] text-xs font-semibold focus:border-[#FF2E63] focus:ring-2 focus:ring-[#FF2E63]/10"
              />
            </div>
          </div>

          {/* Nickname & Avatar */}
          <div>
            <label className="block text-xs font-black text-[#1D1E2C] mb-1.5">
              서포터 닉네임 (명예의 전당 노출)
            </label>
            <input
              type="text"
              required
              maxLength={15}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="표시될 닉네임을 적어주세요"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#F3E8EC] text-xs font-semibold focus:border-[#FF2E63]"
            />
          </div>

          {/* Support Message (Pinned on Rank 1 / Guestbook) */}
          <div>
            <label className="block text-xs font-black text-[#1D1E2C] mb-1.5 flex items-center justify-between">
              <span>루나에게 전하는 응원 메시지</span>
              <span className="text-[10px] text-[#72748A]">1위 달성 시 전광판에 고정</span>
            </label>
            <textarea
              rows={2}
              maxLength={80}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="따뜻한 응원 한마디를 남겨주세요!"
              className="w-full px-3.5 py-2 rounded-xl border border-[#F3E8EC] text-xs font-medium focus:border-[#FF2E63]"
            />
          </div>

          {/* Quick Payment Options */}
          <div>
            <label className="block text-xs font-black text-[#1D1E2C] mb-2">
              간편 결제 수단 (모바일 D2C 최적화)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'toss', name: '토스페이', badge: '⚡ 원클릭', bg: 'hover:border-[#0064FF]' },
                { id: 'kakao', name: '카카오페이', badge: '🟡 간편', bg: 'hover:border-[#FEE500]' },
                { id: 'naver', name: '네이버페이', badge: '🟢 포인트', bg: 'hover:border-[#03C75A]' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === m.id
                      ? 'border-[#FF2E63] bg-[#FFF0F4] font-black text-[#FF2E63]'
                      : `border-[#F3E8EC] bg-[#FAFAFC] text-xs font-semibold ${m.bg}`
                  }`}
                >
                  <div className="text-xs">{m.name}</div>
                  <div className="text-[10px] text-[#72748A]">{m.badge}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Safety & Terms */}
          <div className="bg-[#FAFAFC] p-3 rounded-xl border border-[#F3E8EC] text-[11px] text-[#72748A] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#00B4D8] shrink-0" />
            <span>결제 수수료 포함 투명 운영 · 안전한 비동기 소통 보장</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || finalCarrots <= 0}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF2E63] via-[#FF385C] to-[#FF7A00] text-white font-extrabold text-sm shadow-lg shadow-[#FF2E63]/30 hover:shadow-xl hover:shadow-[#FF2E63]/40 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                결제 승인 중...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {finalCarrots.toLocaleString()} 당근 ({finalPrice.toLocaleString()}원) 후원하기
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
