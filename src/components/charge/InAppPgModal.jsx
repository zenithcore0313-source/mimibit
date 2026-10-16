import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Lock, CheckCircle2, QrCode, Smartphone, Sparkles, Building2 } from 'lucide-react';

export function InAppPgModal({ 
  isOpen, 
  onClose, 
  amountData, 
  paymentMethod, 
  onApprove 
}) {
  if (!isOpen || !amountData) return null;

  const [selectedCard, setSelectedCard] = useState('shinhan');
  const [payTab, setPayTab] = useState('appcard'); // 'appcard', 'number'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const CARDS = [
    { id: 'shinhan', name: '신한카드', badge: '무이자 3개월', color: 'bg-blue-600' },
    { id: 'kb', name: 'KB국민카드', badge: '무이자 3개월', color: 'bg-amber-600' },
    { id: 'hyundai', name: '현대카드', badge: 'M포인트 50%', color: 'bg-slate-800' },
    { id: 'samsung', name: '삼성카드', badge: '무이자 2개월', color: 'bg-blue-800' },
    { id: 'kakao', name: '카카오뱅크', badge: '즉시할인', color: 'bg-yellow-400 text-slate-900' },
    { id: 'toss', name: '토스뱅크', badge: '캐시백 1%', color: 'bg-blue-500' },
  ];

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onApprove({
        pgProvider: 'tosspayments_sandbox',
        cardName: CARDS.find(c => c.id === selectedCard)?.name || '테스트 카드',
        approvalNo: `${Math.floor(10000000 + Math.random() * 90000000)}`
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* PG Top Brand Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-xs text-white">토스페이먼츠(Toss Payments)</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded font-bold">
                  PG SECURE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">토스페이먼츠 256-bit SSL 암호화 안전결제</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 block">주문 상품</span>
            <span className="font-bold text-xs text-slate-900">
              미미빗 당근 {amountData.cash.toLocaleString()}개 (+{amountData.bonus.toLocaleString()} 보너스)
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#E4092B] font-bold block">VAT 10% 포함</span>
            <span className="font-heading font-black text-base text-slate-900 font-num">
              {amountData.totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Payment Tabs: App Card vs Card Selection */}
        <div className="p-5 space-y-4">
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setPayTab('appcard')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                payTab === 'appcard' ? 'bg-white shadow-xs text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-blue-600" />
              <span>앱카드 / QR 간편결제</span>
            </button>
            <button
              type="button"
              onClick={() => setPayTab('number')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                payTab === 'number' ? 'bg-white shadow-xs text-slate-900' : 'hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-600" />
              <span>카드사 직접 선택</span>
            </button>
          </div>

          {/* TAB 1: AppCard / QR Simulation */}
          {payTab === 'appcard' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3 animate-fade-in">
              <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MIMIBIT_TOSS_TEST_PAY_APPROVE" 
                  alt="QR Checkout" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  스마트폰 카메라 또는 각 카드사 앱으로 스캔
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  스마트폰 간편 앱카드 결제 및 QR코드 인증 지원
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Card Grid */}
          {payTab === 'number' && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-[11px] font-bold text-slate-500 block">결제할 카드사 선택</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {CARDS.map(card => {
                  const isSelected = selectedCard === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => setSelectedCard(card.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-2xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{card.name}</span>
                        <span className="text-[10px] text-slate-400">{card.badge}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Terms checkbox preview */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>토스페이먼츠 256-bit 전자결제 SSL 암호화 적용 및 금융위 보안 규정 준수</span>
          </div>

          {/* Submit Action */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>결제 승인 처리 중...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{amountData.totalPrice.toLocaleString()}원 안전결제 진행하기</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400">
            * 전자금융거래법에 의거하여 결제 완료 즉시 전자 영수증이 발행됩니다.
          </p>
        </div>

      </div>
    </div>
  );
}
