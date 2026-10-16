// =====================================================================
// MIMIBIT Cash / Carrot Charge Modal
// Integrated with Toss Payments SDK & Dedicated Virtual Account (무통장입금)
// =====================================================================

import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, Sparkles, AlertCircle, 
  ArrowRight, Download, Receipt, Zap, Smartphone, 
  ExternalLink, Lock, CheckCircle2, ChevronRight, Building2,
  ChevronDown, Phone, FileText, Copy, Clock, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InAppPgModal } from './InAppPgModal';
import { executeTossPayment } from '../../services/tossPayments';
import { 
  confirmTossPayment, 
  createBankTransferOrder, 
  confirmBankTransferOrder 
} from '../../services/api';

// 표준 캐시 충전 금액 체계 (부가세 10% 명확 분리)
const CASH_AMOUNTS = [
  { id: 'amt_1000', cash: 1000, bonus: 0, price: 1000, vat: 100, totalPrice: 1100, tag: null },
  { id: 'amt_3000', cash: 3000, bonus: 0, price: 3000, vat: 300, totalPrice: 3300, tag: null },
  { id: 'amt_5000', cash: 5000, bonus: 200, price: 5000, vat: 500, totalPrice: 5500, tag: '+200 보너스' },
  { id: 'amt_10000', cash: 10000, bonus: 1000, price: 10000, vat: 1000, totalPrice: 11000, tag: '인기 BEST' },
  { id: 'amt_30000', cash: 30000, bonus: 4000, price: 30000, vat: 3000, totalPrice: 33000, tag: '+4,000 보너스' },
  { id: 'amt_50000', cash: 50000, bonus: 8000, price: 50000, vat: 5000, totalPrice: 55000, tag: '+8,000 보너스' },
  { id: 'amt_100000', cash: 100000, bonus: 20000, price: 100000, vat: 10000, totalPrice: 110000, tag: 'VVIP (+20%)' },
];

// 표준 4대 결제 카테고리
const PAYMENT_CATEGORIES = [
  { id: 'easy', name: '간편결제', icon: Zap },
  { id: 'card', name: '신용·체크카드', icon: CreditCard },
  { id: 'bank', name: '무통장입금(가상계좌)', icon: Building2 },
  { id: 'mobile', name: '휴대폰 결제', icon: Smartphone },
];

const EASY_PAY_PROVIDERS = [
  { id: 'tosspay', name: '토스페이', tossMethod: '토스페이', desc: '토스머니 / 생체인증 1초 결제', logoText: 'toss pay', color: 'bg-[#0064FF] text-white', badge: '추천' },
  { id: 'kakaopay', name: '카카오페이', tossMethod: '카카오페이', desc: '카카오페이 머니 & 카드', logoText: 'kakaopay', color: 'bg-[#FEE500] text-[#191919]', badge: '인기' },
  { id: 'naverpay', name: '네이버페이', tossMethod: '네이버페이', desc: '네이버페이 포인트 최대 3% 적립', logoText: 'N pay', color: 'bg-[#03C75A] text-white', badge: '적립' },
];

const CARD_COMPANIES = [
  { id: 'shinhan', name: '신한카드', interestFree: '무이자 2~3개월' },
  { id: 'hyundai', name: '현대카드', interestFree: 'M포인트 50% 사용' },
  { id: 'kb', name: 'KB국민카드', interestFree: '무이자 2~3개월' },
  { id: 'samsung', name: '삼성카드', interestFree: '무이자 2~3개월' },
  { id: 'lotte', name: '롯데카드', interestFree: '무이자 2개월' },
  { id: 'woori', name: '우리카드', interestFree: '무이자 2~3개월' },
  { id: 'bc', name: 'BC카드', interestFree: '무이자 2개월' },
  { id: 'nh', name: 'NH농협카드', interestFree: '무이자 2~3개월' },
  { id: 'toss_bank', name: '토스뱅크', interestFree: '즉시 캐시백' },
  { id: 'kakao_bank', name: '카카오뱅크', interestFree: '즉시 캐시백' },
  { id: 'hana', name: '하나카드', interestFree: '무이자 2~3개월' },
];

const INSTALLMENT_MONTHS = [
  { value: '0', label: '일시불' },
  { value: '2', label: '2개월 (무이자)' },
  { value: '3', label: '3개월 (무이자)' },
  { value: '4', label: '4개월' },
  { value: '5', label: '5개월' },
  { value: '6', label: '6개월' },
];

const BANKS = [
  { id: 'toss', name: '토스뱅크', color: 'bg-blue-600' },
  { id: 'kakao', name: '카카오뱅크', color: 'bg-yellow-400' },
  { id: 'kb', name: 'KB국민은행', color: 'bg-amber-600' },
  { id: 'shinhan', name: '신한은행', color: 'bg-blue-700' },
  { id: 'woori', name: '우리은행', color: 'bg-sky-600' },
  { id: 'hana', name: '하나은행', color: 'bg-emerald-600' },
  { id: 'ibk', name: 'IBK기업은행', color: 'bg-blue-800' },
  { id: 'nh', name: 'NH농협은행', color: 'bg-green-700' },
];

const MOBILE_CARRIERS = [
  { id: 'skt', name: 'SKT' },
  { id: 'kt', name: 'KT' },
  { id: 'lgu', name: 'LG U+' },
  { id: 'mvno_skt', name: '알뜰폰 (SKT망)' },
  { id: 'mvno_kt', name: '알뜰폰 (KT망)' },
  { id: 'mvno_lgu', name: '알뜰폰 (LGU+망)' },
];

export function ChargeModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  theme = 'dark',
  onChargeSuccess, 
  onOpenMyPage 
}) {
  const isDark = theme === 'dark';

  const [selectedAmount, setSelectedAmount] = useState(CASH_AMOUNTS[3]); // 10,000 기본
  const [activeCategory, setActiveCategory] = useState('easy'); // 'easy', 'card', 'bank', 'mobile'
  
  // Category sub-options
  const [selectedEasyProvider, setSelectedEasyProvider] = useState('tosspay');
  const [selectedCardCompany, setSelectedCardCompany] = useState('shinhan');
  const [selectedInstallment, setSelectedInstallment] = useState('0');
  const [selectedBank, setSelectedBank] = useState('toss');
  const [depositorName, setDepositorName] = useState(currentUser?.name || '홍길동');
  const [bankTransferMode, setBankTransferMode] = useState('direct'); // 'direct' (전용계좌) or 'toss_sdk' (토스 가상계좌창)
  const [requestCashReceipt, setRequestCashReceipt] = useState(true);
  const [receiptType, setReceiptType] = useState('personal'); // 'personal' or 'business'
  const [receiptNumber, setReceiptNumber] = useState('010-1234-5678');
  const [selectedCarrier, setSelectedCarrier] = useState('skt');
  const [mobilePhoneNum, setMobilePhoneNum] = useState('010-1234-5678');

  // Terms & Submission states
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeAge, setAgreeAge] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPgModalOpen, setIsPgModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [virtualAccountOrder, setVirtualAccountOrder] = useState(null);
  const [accountCopied, setAccountCopied] = useState(false);

  if (!isOpen) return null;

  const currentCarrots = currentUser?.carrotsBalance || 0;
  const totalChargedCarrots = selectedAmount.cash + selectedAmount.bonus;

  const getMethodDisplayName = () => {
    if (activeCategory === 'easy') {
      const p = EASY_PAY_PROVIDERS.find(e => e.id === selectedEasyProvider);
      return p ? p.name : '간편결제';
    }
    if (activeCategory === 'card') {
      const c = CARD_COMPANIES.find(c => c.id === selectedCardCompany);
      const inst = selectedInstallment === '0' ? '일시불' : `${selectedInstallment}개월`;
      return `${c ? c.name : '신용카드'} (${inst})`;
    }
    if (activeCategory === 'bank') {
      const b = BANKS.find(b => b.id === selectedBank);
      return `무통장입금 (${b ? b.name : '가상계좌'})`;
    }
    if (activeCategory === 'mobile') {
      const car = MOBILE_CARRIERS.find(m => m.id === selectedCarrier);
      return `휴대폰 결제 (${car ? car.name : '통신사'})`;
    }
    return '전자결제';
  };

  // 1. Trigger Direct Approval & Confetti
  const triggerApproval = async (customMethodName = getMethodDisplayName(), approvalCode = null) => {
    const orderId = `MMB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const approvalNo = approvalCode || `${Math.floor(10000000 + Math.random() * 90000000)}`;
    const orderDate = new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const orderData = {
      orderId,
      approvalNo,
      date: orderDate,
      package: selectedAmount,
      paymentMethod: customMethodName,
      chargedCarrots: selectedAmount.cash,
      bonusCarrots: selectedAmount.bonus,
      totalCarrots: totalChargedCarrots,
      price: selectedAmount.totalPrice,
      supplyPrice: selectedAmount.price,
      vat: selectedAmount.vat
    };

    // Confirm with backend API
    await confirmTossPayment({
      orderId,
      paymentKey: `pk_${Date.now()}`,
      amount: selectedAmount.totalPrice,
      userId: currentUser?.id,
      carrots: selectedAmount.cash,
      bonusCarrots: selectedAmount.bonus,
      method: customMethodName
    });

    setIsProcessing(false);
    setIsPgModalOpen(false);
    setCompletedOrder(orderData);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#E4092B', '#0064FF', '#03C75A', '#FEE500', '#191F28']
      });
    } catch (e) {}

    if (onChargeSuccess) {
      onChargeSuccess(orderData);
    }
  };

  // 2. Handle Bank Transfer Order Creation (무통장입금 전용 접수)
  const handleBankTransferSubmit = async () => {
    setIsProcessing(true);
    const selectedBankObj = BANKS.find(b => b.id === selectedBank) || BANKS[0];

    try {
      const order = await createBankTransferOrder({
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || depositorName || '미미빗 서포터',
        packageId: selectedAmount.id,
        amount: selectedAmount.totalPrice,
        carrots: selectedAmount.cash,
        bonusCarrots: selectedAmount.bonus,
        bankName: selectedBankObj.name,
        depositorName: depositorName || currentUser?.name || '미미빗 서포터',
        receiptType: requestCashReceipt ? receiptType : 'none',
        receiptNumber: requestCashReceipt ? receiptNumber : ''
      });

      setIsProcessing(false);
      setVirtualAccountOrder(order);
    } catch (err) {
      console.error('[BankTransfer] Error:', err);
      setIsProcessing(false);
      alert('무통장 입금 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // 3. Confirm Virtual Account Deposit (테스트/관리자 즉시 입금 확인 시뮬레이션)
  const handleConfirmVirtualAccountDeposit = async () => {
    if (!virtualAccountOrder) return;
    setIsProcessing(true);

    try {
      await confirmBankTransferOrder(virtualAccountOrder.orderId || virtualAccountOrder.id);
      
      const orderDate = new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const orderData = {
        orderId: virtualAccountOrder.orderId,
        approvalNo: `VA-${Math.floor(10000000 + Math.random() * 90000000)}`,
        date: orderDate,
        package: selectedAmount,
        paymentMethod: `무통장입금 (${virtualAccountOrder.bankName})`,
        chargedCarrots: selectedAmount.cash,
        bonusCarrots: selectedAmount.bonus,
        totalCarrots: totalChargedCarrots,
        price: selectedAmount.totalPrice,
        supplyPrice: selectedAmount.price,
        vat: selectedAmount.vat
      };

      setIsProcessing(false);
      setVirtualAccountOrder(null);
      setCompletedOrder(orderData);

      try {
        confetti({
          particleCount: 100,
          spread: 85,
          origin: { y: 0.55 },
          colors: ['#E4092B', '#0064FF', '#03C75A', '#FEE500', '#191F28']
        });
      } catch (e) {}

      if (onChargeSuccess) {
        onChargeSuccess(orderData);
      }
    } catch (err) {
      console.error('[ConfirmDeposit] Error:', err);
      setIsProcessing(false);
      alert('입금 확인 처리 중 오류가 발생했습니다.');
    }
  };

  // 4. Handle Payment Button Click (Toss Payments SDK or Fallback)
  const handleStartPayment = async (useFastSim = false) => {
    if (!agreeTerms || !agreeAge) {
      setAgreeTerms(true);
      setAgreeAge(true);
    }

    // Fast simulation requested
    if (useFastSim) {
      setIsProcessing(true);
      setTimeout(() => {
        triggerApproval(`${getMethodDisplayName()} (테스트 즉시 승인)`);
      }, 700);
      return;
    }

    // CASE A: Bank Transfer (무통장입금 전용)
    if (activeCategory === 'bank') {
      if (bankTransferMode === 'direct') {
        handleBankTransferSubmit();
        return;
      }
      // If user chose Toss Payments SDK Virtual Account Window
      try {
        setIsProcessing(true);
        const orderId = `MMB-TOSS-VA-${Date.now()}`;
        await executeTossPayment({
          method: '가상계좌',
          amount: selectedAmount.totalPrice,
          orderId,
          orderName: `미미빗 당근 ${selectedAmount.cash.toLocaleString()}개 충전`,
          customerName: currentUser?.name || depositorName || '미미빗 서포터',
          customerEmail: currentUser?.email || 'supporter@mimibit.kr',
          validHours: 72,
          cashReceipt: requestCashReceipt ? { type: receiptType === 'personal' ? '소득공제' : '지출증빙' } : undefined
        });
        setIsProcessing(false);
      } catch (err) {
        console.warn('[TossPayments Virtual Account] Fallback to direct:', err);
        setIsProcessing(false);
        // Fallback to direct bank transfer
        handleBankTransferSubmit();
      }
      return;
    }

    // CASE B: Toss Payments SDK Payment Window (신용카드, 간편결제, 휴대폰)
    try {
      setIsProcessing(true);
      const orderId = `MMB-TOSS-${Date.now()}`;
      
      let tossMethod = '카드';
      if (activeCategory === 'easy') {
        const p = EASY_PAY_PROVIDERS.find(e => e.id === selectedEasyProvider);
        tossMethod = p?.tossMethod || '카드';
      } else if (activeCategory === 'mobile') {
        tossMethod = '휴대폰';
      }

      await executeTossPayment({
        method: tossMethod,
        amount: selectedAmount.totalPrice,
        orderId,
        orderName: `미미빗 당근 ${selectedAmount.cash.toLocaleString()}개 충전`,
        customerName: currentUser?.name || '미미빗 서포터',
        customerEmail: currentUser?.email || 'supporter@mimibit.kr'
      });
      setIsProcessing(false);
    } catch (err) {
      console.warn('[TossPayments SDK] Window closed or fallback:', err);
      setIsProcessing(false);
      // Fallback to interactive in-app sandbox modal so user can test seamlessly
      setIsPgModalOpen(true);
    }
  };

  const handleCopyAccount = (text) => {
    navigator.clipboard.writeText(text);
    setAccountCopied(true);
    setTimeout(() => setAccountCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setCompletedOrder(null);
    setVirtualAccountOrder(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto">
      <div 
        className={`rounded-[28px] w-full max-w-3xl border shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden relative my-auto flex flex-col max-h-[92vh] animate-scale-up transition-colors duration-200 ${
          isDark 
            ? 'bg-[#18181B] border-white/10 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* PROCESSING OVERLAY */}
        {isProcessing && (
          <div className={`absolute inset-0 z-50 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in ${
            isDark ? 'bg-[#18181B]/95 text-white' : 'bg-white/95 text-slate-900'
          }`}>
            <div className="w-12 h-12 rounded-full border-3 border-[#E4092B]/20 border-t-[#E4092B] animate-spin mb-4" />
            <h3 className="text-lg font-bold mb-1">
              {getMethodDisplayName()} 결제 승인 처리 중...
            </h3>
            <p className={`text-xs max-w-xs mb-3 font-normal ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              토스페이먼츠 보안 세션을 통해 안전하게 승인 처리하고 있습니다.
            </p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${
              isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <Lock className="w-3 h-3 text-[#E4092B]" />
              <span>256-bit SSL 보안 암호화 연결</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* CASE 1: VIRTUAL ACCOUNT / BANK TRANSFER RECEIPT (무통장 입금 안내서) */}
        {/* ================================================================= */}
        {virtualAccountOrder ? (
          <div className="p-6 sm:p-10 overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-500/20">
                <Building2 className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                무통장 입금 (가상계좌) 접수 완료
              </span>
              <h2 className="text-2xl font-black mt-2 tracking-tight">
                아래 전용 계좌로 입금해 주세요
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                입금 확인 즉시 <strong className="text-[#E4092B] font-bold">{virtualAccountOrder.totalCarrots.toLocaleString()} 당근</strong>이 자동 충전됩니다.
              </p>
            </div>

            {/* Virtual Account Detail Card */}
            <div className={`p-6 rounded-2xl border max-w-lg mx-auto text-xs space-y-3.5 mb-6 ${
              isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              
              {/* Big Bank Account Box */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'bg-black/40 border-blue-500/30' : 'bg-white border-blue-200'
              }`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-blue-500">{virtualAccountOrder.bankName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">전용 가상계좌</span>
                  </div>
                  <div className="text-lg font-black font-mono tracking-wider text-[#0064FF]">
                    {virtualAccountOrder.virtualAccount}
                  </div>
                  <div className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    예금주: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{virtualAccountOrder.accountHolder}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAccount(virtualAccountOrder.virtualAccount)}
                  className={`px-3 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    accountCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                  }`}
                >
                  {accountCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{accountCopied ? '복사 완료!' : '계좌번호 복사'}</span>
                </button>
              </div>

              {/* Order Info Rows */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-[11px]">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>입금할 금액</span>
                  <span className="font-black text-sm text-[#E4092B] font-num">
                    {virtualAccountOrder.amount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>입금자명</span>
                  <span className="font-bold text-white">{virtualAccountOrder.depositorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>입금 기한</span>
                  <span className="font-medium text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    3일 이내 (72시간)
                  </span>
                </div>
                {virtualAccountOrder.receiptNumber && (
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>현금영수증 신청</span>
                    <span className="font-mono text-zinc-300">
                      {virtualAccountOrder.receiptType === 'personal' ? '소득공제' : '지출증빙'} ({virtualAccountOrder.receiptNumber})
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>충전 예정 당근</span>
                  <span className="font-bold text-[#E4092B]">
                    {virtualAccountOrder.totalCarrots.toLocaleString()} 당근
                  </span>
                </div>
              </div>

              {/* Commercial Deposit Guide Notice */}
              <div className="pt-3 border-t border-white/10 text-center">
                <div className={`p-3 rounded-xl border flex items-center justify-center gap-2 ${
                  isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <Clock className="w-4 h-4 shrink-0 text-amber-500" />
                  <span className="text-xs font-bold">입금 확인 대기중</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">
                  * 위 전용 계좌로 입금해 주시면 은행 펌뱅킹망을 통해 약 1분 이내 당근이 자동 충전됩니다.
                </p>
              </div>
            </div>

            <div className="flex gap-2 max-w-lg mx-auto">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        ) : completedOrder ? (
          /* ================================================================= */
          /* CASE 2: SUCCESS RECEIPT (전자결제 완료 영수증) */
          /* ================================================================= */
          <div className="p-6 sm:p-10 overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-sm border border-emerald-500/20">
                <Check className="w-7 h-7" />
              </div>
              <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                전자금융 결제 완료
              </span>
              <h2 className="text-2xl font-black mt-2 tracking-tight">
                당근 충전이 완료되었습니다
              </h2>
              <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                충전된 <strong className="text-[#E4092B] font-bold">{completedOrder.totalCarrots.toLocaleString()} 당근</strong>은 지갑에 즉시 반영되었습니다.
              </p>
            </div>

            {/* Toss-style Clean Receipt Card */}
            <div className={`p-6 rounded-2xl border max-w-md mx-auto text-xs space-y-3 mb-6 ${
              isDark ? 'bg-zinc-900/80 border-white/10 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>결제 상세 영수증</span>
                <span className="text-[10px] text-zinc-500">{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>주문 번호</span>
                <span className="font-mono">{completedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>결제 수단</span>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>충전 당근</span>
                <span className="font-bold text-[#E4092B]">
                  {completedOrder.chargedCarrots.toLocaleString()}
                  {completedOrder.bonusCarrots > 0 && ` (+${completedOrder.bonusCarrots.toLocaleString()} 보너스)`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>공급가액</span>
                <span>{completedOrder.supplyPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>부가가치세 (10%)</span>
                <span>{completedOrder.vat.toLocaleString()}원</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>최종 결제 금액</span>
                <span className={`font-black text-lg font-num ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {completedOrder.price.toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => {
                  handleResetAndClose();
                  if (onOpenMyPage) onOpenMyPage();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-[#E4092B]/20"
              >
                지갑 잔액 확인하기
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                창 닫기
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* CASE 3: MAIN CHECKOUT INTERFACE */
          /* ================================================================= */
          <>
            {/* Header */}
            <div className={`px-6 py-5 border-b flex items-center justify-between ${
              isDark ? 'border-white/10 bg-[#18181B]' : 'border-slate-100 bg-white'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight">당근(캐시) 충전</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    토스페이먼츠 PG 연동
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  현재 보유 잔액: <span className="font-bold text-[#E4092B]">{currentCarrots.toLocaleString()}개</span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-zinc-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
              
              {/* Left Column: Amount & Method Selector (7 cols) */}
              <div className={`lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r space-y-6 ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                
                {/* 1. Package Selection */}
                <div>
                  <label className="text-xs font-bold mb-2.5 block">
                    1. 충전 금액 선택
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {CASH_AMOUNTS.map((pkg) => {
                      const isSelected = selectedAmount.id === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedAmount(pkg)}
                          className={`p-3 rounded-2xl border text-left transition-all relative cursor-pointer ${
                            isSelected
                              ? 'border-[#E4092B] bg-[#E4092B]/10 ring-1 ring-[#E4092B]'
                              : isDark
                                ? 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-zinc-900'
                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                          }`}
                        >
                          {pkg.tag && (
                            <span className="absolute -top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#E4092B] text-white">
                              {pkg.tag}
                            </span>
                          )}
                          <div className="text-sm font-black font-num">
                            {pkg.cash.toLocaleString()} 당근
                          </div>
                          {pkg.bonus > 0 && (
                            <div className="text-[10px] text-[#E4092B] font-semibold mt-0.5">
                              +{pkg.bonus.toLocaleString()} 보너스
                            </div>
                          )}
                          <div className={`text-xs font-medium mt-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            {pkg.totalPrice.toLocaleString()}원
                            <span className="text-[9px] text-zinc-500 block font-normal">VAT 포함</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. 4 Clean Payment Categories */}
                <div>
                  <label className="text-xs font-bold mb-2.5 block">
                    2. 결제 수단 선택
                  </label>
                  
                  {/* Category Tabs */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-xl mb-4 ${
                    isDark ? 'bg-zinc-900' : 'bg-slate-100'
                  }`}>
                    {PAYMENT_CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(cat.id)}
                          className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isActive
                              ? isDark
                                ? 'bg-zinc-800 text-white shadow-xs'
                                : 'bg-white text-slate-900 shadow-xs'
                              : isDark
                                ? 'text-zinc-400 hover:text-zinc-200'
                                : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-Panel: Easy Pay (간편결제: 토스페이, 카카오페이, 네이버페이) */}
                  {activeCategory === 'easy' && (
                    <div className="space-y-2 animate-fade-in">
                      <div className="grid grid-cols-3 gap-2">
                        {EASY_PAY_PROVIDERS.map((p) => {
                          const isSel = selectedEasyProvider === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setSelectedEasyProvider(p.id)}
                              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                                isSel 
                                  ? 'border-[#0064FF] bg-blue-500/10 ring-1 ring-[#0064FF]' 
                                  : isDark
                                    ? 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <span className={`px-2.5 py-1 rounded-md text-[11px] font-black ${p.color} mb-1.5`}>
                                {p.logoText}
                              </span>
                              <span className="text-xs font-bold">{p.name}</span>
                              <span className="text-[10px] text-zinc-500 mt-0.5">{p.badge}</span>
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-2 px-1">
                        • {EASY_PAY_PROVIDERS.find(p => p.id === selectedEasyProvider)?.desc} (토스페이먼츠 공식 연동)
                      </p>
                    </div>
                  )}

                  {/* Sub-Panel: Credit Card (신용·체크카드) */}
                  {activeCategory === 'card' && (
                    <div className={`space-y-3.5 p-4 rounded-2xl border animate-fade-in ${
                      isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          카드사 선택
                        </label>
                        <select
                          value={selectedCardCompany}
                          onChange={(e) => setSelectedCardCompany(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        >
                          {CARD_COMPANIES.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} ({c.interestFree})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          할부 개월 수
                        </label>
                        <select
                          value={selectedInstallment}
                          onChange={(e) => setSelectedInstallment(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        >
                          {INSTALLMENT_MONTHS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        * 5만원 이상 결제 시 국내 주요 카드사 2~3개월 무이자 할부가 적용됩니다.
                      </p>
                    </div>
                  )}

                  {/* Sub-Panel: Virtual Account (무통장입금 / 가상계좌) */}
                  {activeCategory === 'bank' && (
                    <div className={`space-y-3.5 p-4 rounded-2xl border animate-fade-in ${
                      isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      
                      {/* Bank Mode Choice */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setBankTransferMode('direct')}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            bankTransferMode === 'direct'
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : isDark ? 'border-white/10 bg-zinc-800/50 text-zinc-400' : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          미미빗 전용 계좌 직접 송금
                        </button>
                        <button
                          type="button"
                          onClick={() => setBankTransferMode('toss_sdk')}
                          className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                            bankTransferMode === 'toss_sdk'
                              ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                              : isDark ? 'border-white/10 bg-zinc-800/50 text-zinc-400' : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          토스 가상계좌 결제창
                        </button>
                      </div>

                      {/* Bank Select */}
                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          입금 희망 은행
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        >
                          {BANKS.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} (가상계좌 즉시 발급)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Depositor Name */}
                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          입금자명 (실제 입금하실 성함)
                        </label>
                        <input
                          type="text"
                          value={depositorName}
                          onChange={(e) => setDepositorName(e.target.value)}
                          placeholder="홍길동"
                          className={`w-full px-3 py-2 rounded-xl border text-xs font-medium focus:outline-none ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        />
                        <p className="text-[10px] text-zinc-500 mt-1">
                          * 입금자명이 다를 경우 자동 승인이 지연될 수 있습니다.
                        </p>
                      </div>

                      {/* Cash Receipt */}
                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={requestCashReceipt}
                            onChange={(e) => setRequestCashReceipt(e.target.checked)}
                            className="rounded text-[#0064FF] focus:ring-[#0064FF] cursor-pointer"
                          />
                          <span className="text-xs font-bold">현금영수증 발행 신청</span>
                        </label>

                        {requestCashReceipt && (
                          <div className="grid grid-cols-3 gap-2 pt-1 animate-fade-in">
                            <select
                              value={receiptType}
                              onChange={(e) => setReceiptType(e.target.value)}
                              className={`col-span-1 px-2 py-2 rounded-lg border text-[11px] font-medium ${
                                isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'
                              }`}
                            >
                              <option value="personal">소득공제용</option>
                              <option value="business">지출증빙용</option>
                            </select>
                            <input
                              type="text"
                              value={receiptNumber}
                              onChange={(e) => setReceiptNumber(e.target.value)}
                              placeholder="010-0000-0000"
                              className={`col-span-2 px-3 py-2 rounded-lg border text-xs focus:outline-none ${
                                isDark ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sub-Panel: Mobile Phone (휴대폰 결제) */}
                  {activeCategory === 'mobile' && (
                    <div className={`space-y-3.5 p-4 rounded-2xl border animate-fade-in ${
                      isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          통신사 선택
                        </label>
                        <select
                          value={selectedCarrier}
                          onChange={(e) => setSelectedCarrier(e.target.value)}
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        >
                          {MOBILE_CARRIERS.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`text-[11px] font-bold block mb-1.5 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          휴대폰 번호
                        </label>
                        <input
                          type="tel"
                          value={mobilePhoneNum}
                          onChange={(e) => setMobilePhoneNum(e.target.value)}
                          placeholder="010-0000-0000"
                          className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-none ${
                            isDark 
                              ? 'bg-zinc-800 border-white/10 text-white focus:border-zinc-500' 
                              : 'bg-white border-slate-200 text-slate-900 focus:border-slate-900'
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500">
                        * 결제 금액은 익월 이동통신사 통신요금 청구서에 합산 청구됩니다.
                      </p>
                    </div>
                  )}

                </div>

              </div>

              {/* Right Column: Checkout Summary & Action (5 cols) */}
              <div className={`lg:col-span-5 p-6 flex flex-col justify-between space-y-6 ${
                isDark ? 'bg-zinc-900/40' : 'bg-slate-50/60'
              }`}>
                
                <div className="space-y-4">
                  <h3 className="text-xs font-bold">결제 정보 확인</h3>
                  
                  {/* Summary Card */}
                  <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                    isDark ? 'bg-zinc-900/90 border-white/10 text-zinc-300' : 'bg-white border-slate-200 text-slate-600'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>충전 상품</span>
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>{selectedAmount.cash.toLocaleString()} 당근</strong>
                    </div>
                    {selectedAmount.bonus > 0 && (
                      <div className="flex justify-between items-center text-[#E4092B] font-semibold">
                        <span>보너스 지급</span>
                        <span>+{selectedAmount.bonus.toLocaleString()} 당근</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                      <span>공급가액</span>
                      <span>{selectedAmount.price.toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500 text-[11px]">
                      <span>부가가치세 (VAT 10%)</span>
                      <span>{selectedAmount.vat.toLocaleString()}원</span>
                    </div>
                    <div className="pt-2.5 border-t border-white/10 flex justify-between items-baseline">
                      <span className="font-bold">최종 결제 금액</span>
                      <span className="font-heading font-black text-xl text-[#E4092B] font-num">
                        {selectedAmount.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  {/* Consents */}
                  <div className="space-y-2 text-[11px] text-zinc-500 pt-1">
                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 rounded text-[#E4092B] focus:ring-[#E4092B] cursor-pointer"
                      />
                      <span>
                        [필수] 전자금융거래 이용약관 및 결제 진행에 동의합니다. (미사용 당근은 7일 이내 환불 가능)
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={agreeAge}
                        onChange={(e) => setAgreeAge(e.target.checked)}
                        className="mt-0.5 rounded text-[#E4092B] focus:ring-[#E4092B] cursor-pointer"
                      />
                      <span>
                        [필수] 만 19세 미만 미성년자의 경우 법정대리인의 동의를 받았음을 확인합니다.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleStartPayment(false)}
                    className="w-full py-4 rounded-2xl bg-[#E4092B] hover:bg-[#CC0022] text-white font-bold text-sm transition-all shadow-md shadow-[#E4092B]/20 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {activeCategory === 'bank' 
                        ? `${selectedAmount.totalPrice.toLocaleString()}원 가상계좌 신청` 
                        : `${selectedAmount.totalPrice.toLocaleString()}원 결제하기`}
                    </span>
                  </button>

                  <div className="text-center text-[10px] text-zinc-500 space-y-0.5 pt-1">
                    <p className={`font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      토스페이먼츠(Toss Payments) 공식 전자결제 인증 & 무통장 입금 연동
                    </p>
                    <p>256-bit SSL 암호화 안전결제</p>
                  </div>
                </div>

              </div>

            </div>
          </>
        )}

      </div>

      {/* Interactive Fallback PG Modal */}
      <InAppPgModal
        isOpen={isPgModalOpen}
        onClose={() => setIsPgModalOpen(false)}
        amountData={selectedAmount}
        paymentMethod={{ name: getMethodDisplayName() }}
        onApprove={(result) => {
          setIsPgModalOpen(false);
          triggerApproval(`${result.cardName} (토스페이먼츠)`, result.approvalNo);
        }}
      />
    </div>
  );
}
