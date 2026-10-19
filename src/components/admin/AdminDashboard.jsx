// =====================================================================
// MIMIBIT Master Admin Console (root / zeze1.sec@gmail.com)
// Full Platform Overview, Bank Transfer Approval, Creator Payouts, Users
// =====================================================================

import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Crown, Users, DollarSign, CreditCard, 
  Building2, TrendingUp, Check, AlertCircle, RefreshCw, 
  Search, ArrowUpRight, ArrowDownLeft, Clock, Sparkles, 
  CheckCircle2, FileText, ChevronRight, User, Filter, 
  ExternalLink, Send, Coins, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  fetchAdminOverview, 
  confirmBankTransferOrder, 
  completePayout, 
  adjustUserCarrots 
} from '../../services/api';

export function AdminDashboard({ 
  isOpen, 
  onClose, 
  currentUser, 
  theme = 'dark',
  isFullPage = false
}) {
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'transfers', 'payouts', 'users'
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Carrot Adjustment Modal State
  const [adjustTargetUser, setAdjustTargetUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('1000');
  const [adjustReason, setAdjustReason] = useState('이벤트 보상 지급');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const overview = await fetchAdminOverview();
      setData(overview);
    } catch (err) {
      console.error('[Admin] Load overview failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 1. Approve Bank Transfer Deposit
  const handleApproveTransfer = async (orderId, amount, carrots, userName) => {
    if (!window.confirm(`${userName}님의 ${amount.toLocaleString()}원 (${carrots.toLocaleString()} 당근) 입금을 승인하고 당근을 충전하시겠습니까?`)) {
      return;
    }

    try {
      await confirmBankTransferOrder(orderId);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      showToast(`✅ ${userName}님의 입금 승인 및 당근 지급이 완료되었습니다!`);
      loadData();
    } catch (err) {
      alert('입금 승인 처리 중 오류가 발생했습니다.');
    }
  };

  // 2. Complete Creator Payout (송금 완료)
  const handleCompletePayout = async (payoutId, creatorId, amount) => {
    if (!window.confirm(`${creatorId} 크리에이터님의 ${amount.toLocaleString()}원 출금 송금 처리를 완료하시겠습니까?`)) {
      return;
    }

    try {
      await completePayout(payoutId);
      showToast(`✅ ${creatorId}님의 정산 송금 처리가 완료되었습니다.`);
      loadData();
    } catch (err) {
      alert('정산 처리 중 오류가 발생했습니다.');
    }
  };

  // 3. User Carrot Adjustment Submit
  const handleCarrotAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!adjustTargetUser) return;

    setIsAdjusting(true);
    try {
      await adjustUserCarrots(adjustTargetUser.id, adjustAmount, adjustReason);
      showToast(`✅ ${adjustTargetUser.name}님의 당근이 조정되었습니다.`);
      setAdjustTargetUser(null);
      loadData();
    } catch (err) {
      alert('당근 조정 중 오류가 발생했습니다.');
    } finally {
      setIsAdjusting(false);
    }
  };

  // 4. Delete User or Creator (Admin Action)
  const handleDeleteUserOrCreator = async (targetUser) => {
    if (!window.confirm(`⚠️ [${targetUser.name} (${targetUser.email})] 회원의 계정 및 크리에이터 프로필을 영구 삭제하시겠습니까?\n\n이 작업은 즉시 서버 데이터베이스에서 삭제됩니다.`)) {
      return;
    }
    try {
      if (targetUser.handle) {
        await fetch(`/api/creators/${targetUser.handle.replace(/[@/]/g, '')}`, { method: 'DELETE' });
      }
      const res = await fetch('/api/auth/profile', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUser.id })
      });
      const resData = await res.json();
      if (resData.success) {
        showToast(`🗑️ ${targetUser.name} 회원 및 프로필이 삭제되었습니다.`);
        loadData();
      } else {
        alert(resData.message || '삭제 처리에 실패했습니다.');
      }
    } catch (e) {
      alert('삭제 처리 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  const metrics = data?.metrics || {
    totalGMV: 0,
    platformRevenue: 0,
    totalRechargeKRW: 0,
    pendingPayoutsKRW: 0,
    pendingBankTransferCount: 0,
    totalUsers: 0,
    totalCreators: 0,
    totalDonationCount: 0
  };

  const pendingTransfers = (data?.bankTransfers || []).filter(b => b.status && b.status.includes('대기'));
  const completedTransfers = (data?.bankTransfers || []).filter(b => !b.status || !b.status.includes('대기'));

  const pendingPayouts = (data?.payouts || []).filter(p => !p.status || !p.status.includes('완료'));
  const completedPayouts = (data?.payouts || []).filter(p => p.status && p.status.includes('완료'));

  const filteredUsers = (data?.users || []).filter(u => {
    const q = searchQuery.toLowerCase();
    return (u.name || '').toLowerCase().includes(q) || 
           (u.email || '').toLowerCase().includes(q) || 
           (u.handle || '').toLowerCase().includes(q);
  });

  return (
    <div className={isFullPage ? "min-h-screen w-full flex flex-col font-sans transition-colors duration-200" : "fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-sans overflow-y-auto"}>
      <div 
        className={isFullPage ? `w-full flex-1 flex flex-col transition-colors duration-200 ${isDark ? 'bg-[#0E0E10] text-white' : 'bg-slate-50 text-slate-900'}` : `rounded-[28px] w-full max-w-6xl border shadow-[0_25px_70px_rgba(0,0,0,0.5)] overflow-hidden relative my-auto flex flex-col max-h-[92vh] animate-scale-up transition-colors duration-200 ${isDark ? 'bg-[#121214] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-xl animate-fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TOP ADMIN HEADER */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/10 bg-[#18181B]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">MIMIBIT 통합 관리자 콘솔</h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ROOT MASTER
                </span>
                {isFullPage && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    전용 서브도메인
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                최고 관리자: <strong className="text-white">{currentUser?.name || 'root'}</strong> ({currentUser?.email || 'zeze1.sec@gmail.com'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={isLoading}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'border-white/10 hover:bg-white/10 text-zinc-300' 
                  : 'border-slate-200 hover:bg-slate-200 text-slate-600'
              }`}
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {isFullPage ? (
              <a
                href="/"
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDark 
                    ? 'border-white/10 hover:bg-white/10 text-zinc-300' 
                    : 'border-slate-200 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>서비스 홈</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <div className="flex items-center gap-1.5">
                <a
                  href="/admin"
                  target="_blank"
                  rel="noreferrer"
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/10 text-zinc-300' 
                      : 'border-slate-200 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="서브도메인 / 전용창으로 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">전용창</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                    isDark ? 'bg-white/10 hover:bg-white/20 text-zinc-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className={`px-6 border-b flex gap-2 overflow-x-auto ${
          isDark ? 'border-white/10 bg-[#141416]' : 'border-slate-100 bg-white'
        }`}>
          {[
            { id: 'overview', name: '플랫폼 종합 매출', badge: null },
            { id: 'transfers', name: '무통장입금 승인 센터', badge: pendingTransfers.length > 0 ? `${pendingTransfers.length}건 대기` : null },
            { id: 'payouts', name: '크리에이터 정산·출금 관리', badge: pendingPayouts.length > 0 ? `${pendingPayouts.length}건 대기` : null },
            { id: 'users', name: '회원 & 지갑 관리 (CS)', badge: `${(data?.users || []).length}명` },
          ].map(t => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`py-3.5 px-3 border-b-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#E4092B] text-[#E4092B]'
                    : isDark ? 'border-transparent text-zinc-400 hover:text-white' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{t.name}</span>
                {t.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    t.badge.includes('대기')
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-white/10 text-zinc-300'
                  }`}>
                    {t.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ============================================================== */}
          {/* TAB 1: OVERVIEW METRICS & STATS */}
          {/* ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              {/* 4 Big Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total GMV */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>누적 총 후원 거래액 (GMV)</span>
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-num text-[#E4092B]">
                    {metrics.totalGMV.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    총 {metrics.totalDonationCount.toLocaleString()}건의 팬 후원 발생
                  </p>
                </div>

                {/* 2. Platform 10% Net Fee */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>미미빗 순수수료 (10.0%)</span>
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-num text-emerald-400">
                    {metrics.platformRevenue.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    투네이션 표준 10% 플랫폼 순수익
                  </p>
                </div>

                {/* 3. Total Cash Recharged */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>누적 당근 충전 매출</span>
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-num text-blue-400">
                    {metrics.totalRechargeKRW.toLocaleString()}원
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    토스페이먼츠 PG + 무통장 입금 합계
                  </p>
                </div>

                {/* 4. Active Users & Creators */}
                <div className={`p-5 rounded-2xl border ${
                  isDark ? 'bg-zinc-900/60 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>플랫폼 회원 현황</span>
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black font-num text-purple-400">
                    {metrics.totalUsers.toLocaleString()}명
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    등록 크리에이터: <strong className="text-white">{metrics.totalCreators}팀</strong>
                  </p>
                </div>

              </div>

              {/* Recent Donations Feed */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <h3 className="text-xs font-bold mb-3 flex items-center justify-between">
                  <span>최근 실시간 후원 발생 내역</span>
                  <span className="text-[11px] font-normal text-zinc-500">최신 50건</span>
                </h3>

                {(data?.donations || []).length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
                    아직 발생한 후원 내역이 없습니다.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className={`border-b ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                          <th className="py-2.5 px-3">일시</th>
                          <th className="py-2.5 px-3">후원 크리에이터</th>
                          <th className="py-2.5 px-3">서포터 닉네임</th>
                          <th className="py-2.5 px-3">후원 당근 (금액)</th>
                          <th className="py-2.5 px-3">10% 수수료</th>
                          <th className="py-2.5 px-3">크리에이터 실수령 (86.7%)</th>
                          <th className="py-2.5 px-3">응원 메시지</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-medium">
                        {(data?.donations || []).map((d) => (
                          <tr key={d.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">
                              {d.createdAt ? new Date(d.createdAt).toLocaleDateString('ko-KR') : '-'}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-white">
                              {d.creatorId}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-300">
                              {d.nickname || '익명의 팬'}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-[#E4092B]">
                              {d.carrots.toLocaleString()} 당근 ({d.amountKRW.toLocaleString()}원)
                            </td>
                            <td className="py-2.5 px-3 font-bold text-emerald-400">
                              +{d.platformFee?.toLocaleString()}원
                            </td>
                            <td className="py-2.5 px-3 text-zinc-300 font-num">
                              {d.netPayout?.toLocaleString()}원
                            </td>
                            <td className="py-2.5 px-3 text-zinc-400 truncate max-w-xs">
                              {d.message || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: BANK TRANSFER APPROVAL CENTER (무통장 입금 승인) */}
          {/* ============================================================== */}
          {activeTab === 'transfers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black">무통장입금(가상계좌) 승인 관리</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    유저가 입금한 내역을 대조하여 [입금 승인]을 누르면 해당 유저의 당근 지갑에 즉시 충전됩니다.
                  </p>
                </div>
              </div>

              {/* Pending Approvals Section */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
              }`}>
                <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>입금 대기 주문 ({pendingTransfers.length}건)</span>
                </h4>

                {pendingTransfers.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">
                    현재 대기 중인 무통장 입금 신청이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingTransfers.map((b) => (
                      <div 
                        key={b.id || b.orderId}
                        className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                          isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white">{b.userName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                              {b.bankName}
                            </span>
                            <span className="font-mono text-xs text-zinc-400">{b.virtualAccount}</span>
                          </div>
                          <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                            <span>입금자명: <strong className="text-white">{b.depositorName}</strong></span>
                            <span>신청일시: {new Date(b.createdAt).toLocaleString('ko-KR')}</span>
                            {b.receiptNumber && (
                              <span>현금영수증: {b.receiptType === 'personal' ? '소득공제' : '지출증빙'} ({b.receiptNumber})</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end lg:self-center">
                          <div className="text-right">
                            <div className="text-base font-black text-[#E4092B] font-num">
                              {b.amount.toLocaleString()}원
                            </div>
                            <div className="text-[11px] font-bold text-emerald-400">
                              +{b.totalCarrots.toLocaleString()} 당근 지급
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleApproveTransfer(b.id || b.orderId, b.amount, b.totalCarrots, b.userName)}
                            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>입금 승인 (당근 충전)</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Completed Transfers Table */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-bold mb-3">최근 입금 완료 처리 내역</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                        <th className="py-2.5 px-3">주문번호</th>
                        <th className="py-2.5 px-3">입금자</th>
                        <th className="py-2.5 px-3">은행</th>
                        <th className="py-2.5 px-3">금액</th>
                        <th className="py-2.5 px-3">충전 당근</th>
                        <th className="py-2.5 px-3">처리 상태</th>
                        <th className="py-2.5 px-3">완료 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {completedTransfers.map((b) => (
                        <tr key={b.id || b.orderId} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3 font-mono text-[11px] text-zinc-500">{b.orderId}</td>
                          <td className="py-2 px-3 font-bold text-white">{b.depositorName}</td>
                          <td className="py-2 px-3 text-zinc-400">{b.bankName}</td>
                          <td className="py-2 px-3 font-num font-bold">{b.amount.toLocaleString()}원</td>
                          <td className="py-2 px-3 font-bold text-[#E4092B]">+{b.totalCarrots.toLocaleString()}</td>
                          <td className="py-2 px-3">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-zinc-500 font-mono text-[11px]">
                            {b.confirmedAt ? new Date(b.confirmedAt).toLocaleDateString('ko-KR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: CREATOR PAYOUT & WITHDRAWAL MANAGEMENT */}
          {/* ============================================================== */}
          {activeTab === 'payouts' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black">크리에이터 출금(정산) 승인 센터</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    크리에이터가 신청한 정산금을 실제 은행 계좌로 송금한 뒤 [송금 완료] 처리합니다.
                  </p>
                </div>
              </div>

              {/* Pending Payout Requests */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/50 border-rose-200'
              }`}>
                <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>출금 송금 대기 ({pendingPayouts.length}건)</span>
                </h4>

                {pendingPayouts.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-3 text-center">
                    현재 대기 중인 출금 신청이 없습니다.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {pendingPayouts.map((p) => {
                      const amount = p.amount || 0;
                      const fee = Math.round(amount * 0.10);
                      const tax = Math.round(amount * 0.033);
                      const net = amount - fee - tax; // 86.7%

                      return (
                        <div 
                          key={p.id}
                          className={`p-4 rounded-xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                            isDark ? 'bg-black/40 border-white/10' : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white">{p.creatorId}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                                {p.bank} {p.account}
                              </span>
                              <span className="text-xs font-bold text-zinc-300">예금주: {p.holder}</span>
                            </div>
                            <div className="text-xs text-zinc-400 flex gap-4">
                              <span>신청일: {new Date(p.requestedAt).toLocaleString('ko-KR')}</span>
                              <span>원천세 3.3%: {tax.toLocaleString()}원</span>
                              <span>플랫폼 10%: {fee.toLocaleString()}원</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end lg:self-center">
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-400 block">실제 입금할 송금액 (86.7%)</span>
                              <span className="text-base font-black text-emerald-400 font-num">
                                {net.toLocaleString()}원
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCompletePayout(p.id, p.creatorId, net)}
                              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer active:scale-95"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>송금 완료 승인</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Completed Payouts Table */}
              <div className={`p-5 rounded-2xl border ${
                isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-bold mb-3">최근 정산 완료 내역</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                        <th className="py-2.5 px-3">정산ID</th>
                        <th className="py-2.5 px-3">크리에이터</th>
                        <th className="py-2.5 px-3">계좌 정보</th>
                        <th className="py-2.5 px-3">신청 금액</th>
                        <th className="py-2.5 px-3">실송금액 (86.7%)</th>
                        <th className="py-2.5 px-3">상태</th>
                        <th className="py-2.5 px-3">완료 일시</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {completedPayouts.map((p) => {
                        const net = Math.round(p.amount * 0.867);
                        return (
                          <tr key={p.id} className="hover:bg-white/5 transition-colors">
                            <td className="py-2 px-3 font-mono text-[11px] text-zinc-500">{p.id}</td>
                            <td className="py-2 px-3 font-bold text-white">{p.creatorId}</td>
                            <td className="py-2 px-3 text-zinc-400">{p.bank} {p.account} ({p.holder})</td>
                            <td className="py-2 px-3 font-num">{p.amount.toLocaleString()}원</td>
                            <td className="py-2 px-3 font-bold text-emerald-400 font-num">{net.toLocaleString()}원</td>
                            <td className="py-2 px-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-zinc-500 font-mono text-[11px]">
                              {p.completedAt ? new Date(p.completedAt).toLocaleDateString('ko-KR') : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: USERS & WALLET CS MANAGEMENT */}
          {/* ============================================================== */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black">전체 회원 및 지갑 잔액 관리 (CS)</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    회원 검색 및 고객센터(CS) 환불·이벤트용 수동 당근 지급/회수
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="이름, 이메일, 핸들 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs focus:outline-none ${
                      isDark ? 'bg-zinc-800 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className={`p-4 rounded-2xl border overflow-x-auto ${
                isDark ? 'bg-zinc-900/40 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-500'}`}>
                      <th className="py-2.5 px-3">회원명</th>
                      <th className="py-2.5 px-3">핸들 / ID</th>
                      <th className="py-2.5 px-3">이메일</th>
                      <th className="py-2.5 px-3">역할</th>
                      <th className="py-2.5 px-3">보유 당근 잔액</th>
                      <th className="py-2.5 px-3">가입일</th>
                      <th className="py-2.5 px-3 text-right">CS 지갑 관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <img 
                              src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'} 
                              alt={u.name} 
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="font-bold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 font-mono text-zinc-400">{u.handle}</td>
                        <td className="py-2.5 px-3 text-zinc-300">{u.email}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : u.role === 'creator'
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {u.role === 'admin' ? '관리자' : u.role === 'creator' ? '크리에이터' : '서포터'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-black text-[#E4092B] font-num">
                          {(u.carrotsBalance || 0).toLocaleString()}개
                        </td>
                        <td className="py-2.5 px-3 text-zinc-500 font-mono text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ko-KR') : '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setAdjustTargetUser(u)}
                              className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] transition-colors cursor-pointer border border-white/10"
                            >
                              당근 조정
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUserOrCreator(u)}
                              title="계정 및 크리에이터 프로필 삭제"
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer border border-rose-500/20"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* =================================================================== */}
      {/* SUB-MODAL: USER CARROT ADJUSTMENT MODAL */}
      {/* =================================================================== */}
      {adjustTargetUser && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#18181B] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 animate-scale-up text-white">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>당근 잔액 수동 조정</span>
              </h3>
              <button 
                type="button"
                onClick={() => setAdjustTargetUser(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 text-xs space-y-1">
              <div>대상 회원: <strong className="text-white">{adjustTargetUser.name}</strong> ({adjustTargetUser.email})</div>
              <div>현재 보유 잔액: <strong className="text-[#E4092B]">{(adjustTargetUser.carrotsBalance || 0).toLocaleString()}개</strong></div>
            </div>

            <form onSubmit={handleCarrotAdjustmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  조정할 당근 수량 (+지급 / -차감)
                </label>
                <input
                  type="number"
                  required
                  placeholder="+1000 또는 -500"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/10 font-num font-bold text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  조정 사유 (감사 로그 기록)
                </label>
                <input
                  type="text"
                  required
                  placeholder="예: 고객센터 환불, 런칭 기념 이벤트 보상"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isAdjusting}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                >
                  {isAdjusting ? '처리 중...' : '당근 조정 적용'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustTargetUser(null)}
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs cursor-pointer"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
