/**
 * Stripe Checkout Integration - Cards #55 & #56
 * Handles Stripe payment session creation and flow
 */

import { useState } from 'react';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { getToken } from '@/api/auth';
import type { PaymentHistoryItem } from '@/api/payments/stripe-service';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:8080';

export interface CheckoutSessionParams {
  orderId: number;
  amount: number;
  currency: string;
}

export interface UseStripeCheckoutReturn {
  createCheckoutSession: (orderId: number) => Promise<string>;
  openStripeCheckout: (checkoutUrl: string) => Promise<{ cancelled: boolean }>;
  isProcessing: boolean;
  error: string | null;
}

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface PaymentStatusResponse {
  status: PaymentStatus;
  paymentDetails?: unknown;
}

/**
 * Hook for Stripe Checkout integration
 *
 * @example
 * ```typescript
 * function CheckoutScreen() {
 *   const { createCheckoutSession, openStripeCheckout, isProcessing } = useStripeCheckout();
 *
 *   const handlePayment = async () => {
 *     const checkoutUrl = await createCheckoutSession(orderId);
 *     await openStripeCheckout(checkoutUrl);
 *   };
 * }
 * ```
 */
export function useStripeCheckout(): UseStripeCheckoutReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (orderId: number): Promise<string> => {
    setIsProcessing(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      // Create success/cancel URLs with deep links
      const successUrl = Linking.createURL('/payment/success', {
        queryParams: { orderId: String(orderId) },
      });

      const cancelUrl = Linking.createURL('/payment/cancel', {
        queryParams: { orderId: String(orderId) },
      });

      // Request checkout session from backend
      const response = await fetch(
        `${API_BASE_URL}/payments/stripe/checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: orderId,
            success_url: successUrl,
            cancel_url: cancelUrl,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 'Failed to create checkout session'
        );
      }

      const data: { session_id: string; checkout_url: string } =
        await response.json();

      return data.checkout_url; // Stripe Checkout URL
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Checkout session creation failed';
      console.error('[Stripe] Error:', message);
      setError(message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const openStripeCheckout = async (checkoutUrl: string) => {
    try {
      const result = await WebBrowser.openBrowserAsync(checkoutUrl, {
        dismissButtonStyle: 'cancel',
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
        controlsColor: '#3B82F6',
      });

      // User closed browser
      if (result.type === 'cancel') {
        return { cancelled: true };
      }

      return { cancelled: false };
    } catch (error) {
      console.error('[Stripe] Failed to open Stripe Checkout:', error);
      throw error;
    }
  };

  return {
    createCheckoutSession,
    openStripeCheckout,
    isProcessing,
    error,
  };
}

/**
 * Check payment status for an order
 */
export async function checkPaymentStatus(
  orderId: number
): Promise<PaymentStatusResponse> {
  try {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to check payment status');
    }

    const order: { status: string; payment_details?: unknown } =
      await response.json();
    const normalizedStatus = order.status.toLowerCase() as PaymentStatus;

    return {
      status: normalizedStatus,
      paymentDetails: order.payment_details,
    };
  } catch (error) {
    console.error('[Stripe] Failed to check payment status:', error);
    throw error;
  }
}

/**
 * Get payment history for current user
 */
export async function getPaymentHistory(): Promise<PaymentHistoryItem[]> {
  try {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/payments/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }

    const data: { payments?: PaymentHistoryItem[] } = await response.json();
    return data.payments ?? [];
  } catch (error) {
    console.error('[Stripe] Failed to get payment history:', error);
    throw error;
  }
}

/**
 * Request refund for a payment
 */
export async function requestRefund(
  orderId: number,
  reason?: string
): Promise<void> {
  try {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_BASE_URL}/payments/stripe/refund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        reason,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to request refund');
    }
  } catch (error) {
    console.error('[Stripe] Refund request failed:', error);
    throw error;
  }
}
