import axios from 'axios';
import { apiClient } from '@/api/client';

/**
 * Payment API Module
 * Handles payment operations including Stripe integration
 */

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status:
    | 'requires_payment_method'
    | 'requires_confirmation'
    | 'succeeded'
    | 'canceled';
}

export interface CreatePaymentIntentPayload {
  amount: number;
  currency: string;
  paymentMethodId?: string;
}

export interface ConfirmPaymentPayload {
  paymentIntentId: string;
  paymentMethodId: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due';
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  currentPeriodEnd: string;
}

export interface CreateSubscriptionPayload {
  planId: string;
  paymentMethodId: string;
}

/**
 * Create a payment intent for one-time payments
 */
export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload
): Promise<PaymentIntent> {
  try {
    const response = await apiClient.post<PaymentIntent>(
      '/payments/intents',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to create payment intent';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Confirm a payment intent
 */
export async function confirmPayment(
  payload: ConfirmPaymentPayload
): Promise<PaymentIntent> {
  try {
    const response = await apiClient.post<PaymentIntent>(
      `/payments/intents/${payload.paymentIntentId}/confirm`,
      { paymentMethodId: payload.paymentMethodId }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to confirm payment';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Get payment methods for current user
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const response = await apiClient.get<{ paymentMethods: PaymentMethod[] }>(
      '/payments/methods'
    );
    return response.data.paymentMethods;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to fetch payment methods';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Add a new payment method
 */
export async function addPaymentMethod(
  paymentMethodId: string
): Promise<PaymentMethod> {
  try {
    const response = await apiClient.post<PaymentMethod>('/payments/methods', {
      paymentMethodId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to add payment method';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Delete a payment method
 */
export async function deletePaymentMethod(
  paymentMethodId: string
): Promise<void> {
  try {
    await apiClient.delete(`/payments/methods/${paymentMethodId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to delete payment method';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Create a subscription
 */
export async function createSubscription(
  payload: CreateSubscriptionPayload
): Promise<Subscription> {
  try {
    const response = await apiClient.post<Subscription>(
      '/subscriptions',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to create subscription';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Get current user's subscription
 */
export async function getSubscription(): Promise<Subscription | null> {
  try {
    const response = await apiClient.get<{ subscription: Subscription | null }>(
      '/subscriptions/current'
    );
    return response.data.subscription;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null; // No subscription
      }
      const message =
        error.response?.data?.message || 'Failed to fetch subscription';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(
  subscriptionId: string
): Promise<Subscription> {
  try {
    const response = await apiClient.post<Subscription>(
      `/subscriptions/${subscriptionId}/cancel`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || 'Failed to cancel subscription';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Get available subscription plans
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await apiClient.get<{ plans: SubscriptionPlan[] }>(
      '/subscriptions/plans'
    );
    return response.data.plans;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || 'Failed to fetch plans';
      throw new Error(message);
    }
    throw error;
  }
}
