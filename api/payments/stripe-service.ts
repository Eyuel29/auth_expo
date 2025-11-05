/**
 * Stripe Payment Service
 * Handles all Stripe-related operations
 */

import axios from 'axios';
import { apiClient } from '@/api/client';

const API_BASE_URL =
  apiClient.defaults.baseURL ||
  process.env.EXPO_PUBLIC_SERVER_URL ||
  'http://localhost:8080';

export interface CheckoutSessionRequest {
  order_id: number;
  success_url?: string;
  cancel_url?: string;
}

export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
  order_id: number;
}

export interface PaymentHistoryItem {
  id: number;
  order_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
}

export interface RefundRequest {
  order_id: number;
  amount?: number;
  reason?: string;
}

export interface RefundResponse {
  id?: string;
  status?: string;
  [key: string]: unknown;
}

class StripeService {
  private api = apiClient;

  /**
   * Create Stripe Checkout Session
   */
  async createCheckoutSession(
    request: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> {
    try {
      const response = await this.api.post<CheckoutSessionResponse>(
        '/payments/stripe/checkout-session',
        request
      );

      return response.data;
    } catch (error) {
      console.error('[StripeService] ❌ Failed to create checkout session');
      if (axios.isAxiosError(error)) {
        console.error('[StripeService] Status:', error.response?.status);
        console.error('[StripeService] Response:', error.response?.data);
        console.error('[StripeService] Request URL:', error.config?.url);
        console.error(
          '[StripeService] Full URL tried:',
          `${API_BASE_URL}${error.config?.url}`
        );

        if (error.response?.status === 404) {
          console.error('[StripeService] ⚠️ 404 - Backend route not found!');
          console.error(
            '[StripeService] ⚠️ Make sure backend has POST /payments/stripe/checkout-session'
          );
          console.error('[StripeService] ⚠️ Try restarting the backend server');
        }

        throw new Error(
          error.response?.data?.message || 'Failed to create checkout session'
        );
      }
      throw error;
    }
  }

  /**
   * Get Checkout Session details
   */
  async getCheckoutSession(
    sessionId: string
  ): Promise<CheckoutSessionResponse> {
    try {
      const response = await this.api.get(
        `/payments/stripe/session/${sessionId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to get session'
        );
      }
      throw error;
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    try {
      const response =
        await this.api.get<PaymentHistoryItem[]>('/payments/history');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to get payment history'
        );
      }
      throw error;
    }
  }

  /**
   * Request refund
   */
  async requestRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const response = await this.api.post('/payments/stripe/refund', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to request refund'
        );
      }
      throw error;
    }
  }

  /**
   * Get refund status
   */
  async getRefundStatus(refundId: string): Promise<RefundResponse> {
    try {
      const response = await this.api.get(
        `/payments/stripe/refund/${refundId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Failed to get refund status'
        );
      }
      throw error;
    }
  }
}

export const stripeService = new StripeService();
export default stripeService;
