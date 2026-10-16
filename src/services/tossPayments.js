// =====================================================================
// MIMIBIT Toss Payments Official SDK Client
// Supports All Card Companies, Easy Pays (KakaoPay, NaverPay, TossPay),
// Virtual Accounts (무통장입금), and Bank Transfers
// =====================================================================

import { loadTossPayments } from '@tosspayments/payment-sdk';

// Default standard official Toss Payments Test Client Key
export const TOSS_CLIENT_KEY = 
  import.meta.env.VITE_TOSS_CLIENT_KEY || 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

let cachedTossPayments = null;

/**
 * Initializes and returns the Toss Payments SDK instance
 */
export async function getTossPaymentsInstance() {
  if (!cachedTossPayments) {
    try {
      cachedTossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
    } catch (err) {
      console.error('[TossPayments] Failed to load SDK:', err);
      throw err;
    }
  }
  return cachedTossPayments;
}

/**
 * Request real payment via Toss Payments SDK Window
 * @param {Object} params
 * @param {'카드' | '가상계좌' | '계좌이체' | '휴대폰' | '토스페이' | '카카오페이' | '네이버페이'} params.method
 * @param {number} params.amount
 * @param {string} params.orderId
 * @param {string} params.orderName
 * @param {string} params.customerName
 * @param {string} [params.customerEmail]
 * @param {string} [params.successUrl]
 * @param {string} [params.failUrl]
 */
export async function executeTossPayment({
  method = '카드',
  amount,
  orderId,
  orderName,
  customerName = '미미빗 서포터',
  customerEmail = 'supporter@mimibit.kr',
  successUrl,
  failUrl,
  validHours = 72,
  cashReceipt = { type: '소득공제' }
}) {
  const tossPayments = await getTossPaymentsInstance();

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  
  const paymentOptions = {
    amount: Math.round(amount),
    orderId: orderId || `MMB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    orderName: orderName || '미미빗 당근 충전',
    customerName: customerName || '미미빗 서포터',
    successUrl: successUrl || `${currentOrigin}/#payment_success`,
    failUrl: failUrl || `${currentOrigin}/#payment_fail`,
  };

  if (customerEmail) {
    paymentOptions.customerEmail = customerEmail;
  }

  // 가상계좌(무통장) 추가 옵션
  if (method === '가상계좌') {
    paymentOptions.validHours = validHours;
    if (cashReceipt) {
      paymentOptions.cashReceipt = cashReceipt;
    }
  }

  return tossPayments.requestPayment(method, paymentOptions);
}
