import axios from 'axios';
import { apiClient } from '@/api/client';
import type {
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
  CheckoutSession,
  StripeCustomer,
  CreateCustomerPayload,
  PaymentMethod,
  PaymentIntentDetails,
  Subscription,
  CreateSubscriptionPayload,
  SubscriptionPlan,
} from '@/shared/types/payment';

/**
 * Payment API Module
 * Handles Stripe Checkout Sessions and payment operations
 *
 * ⚠️ SECURITY NOTE:
 * This implementation uses Stripe Checkout Sessions (hosted payment page)
 * which is MORE secure than Payment Intents because:
 * - No sensitive payment data handled by client
 * - PCI compliance handled by Stripe
 * - Payment processing happens on Stripe's servers
 * - Webhooks provide reliable payment confirmation
 *
 * Backend: /home/eyuel/synque/express/src/modules/payments/stripe/
 */

// ============================================================================
// Stripe Checkout Sessions (Primary Payment Flow)
// ============================================================================

/**
 * Create a Stripe Checkout Session for order payment
 *
 * Flow:
 * 1. Client calls this with order_id
 * 2. Backend creates Stripe Checkout Session
 * 3. Client receives checkout_url
 * 4. Client opens checkout_url in browser (Stripe's hosted page)
 * 5. User enters card details on Stripe's page (not in app)
 * 6. After payment, user is redirected back to success_url or cancel_url
 * 7. Backend receives webhook from Stripe confirming payment
 * 8. Backend updates order status to PAID
 *
 * @param payload - Order ID and optional redirect URLs
 * @returns Checkout session with URL to redirect user to
 * @throws Error if order not found or already paid
 *
 * @example
 * ```typescript
 * const session = await createCheckoutSession({
 *   order_id: 123,
 *   success_url: 'myapp://payment/success',
 *   cancel_url: 'myapp://payment/cancel'
 * });
 *
 * // Open checkout_url in browser or WebView
 * Linking.openURL(session.checkout_url);
 * ```
 */
export async function createCheckoutSession(
  payload: CreateCheckoutSessionPayload
): Promise<CheckoutSessionResponse> {
  try {
    const response = await apiClient.post<CheckoutSessionResponse>(
      '/payments/stripe/checkout-session',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create checkout session';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Retrieve Checkout Session details
 *
 * Use this to check the status of a checkout session
 * after user returns from Stripe's payment page
 *
 * @param sessionId - Stripe Checkout Session ID
 * @returns Session details including payment status
 * @throws Error if session not found or access denied
 *
 * @example
 * ```typescript
 * const session = await getCheckoutSession('cs_test_abc123');
 *
 * if (session.status === 'completed') {
 *   console.log('Payment successful!');
 * } else if (session.status === 'expired') {
 *   console.log('Session expired, create new one');
 * }
 * ```
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<CheckoutSession> {
  try {
    const response = await apiClient.get<CheckoutSession>(
      `/payments/stripe/session/${sessionId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to retrieve checkout session';
      throw new Error(message);
    }
    throw error;
  }
}

// ============================================================================
// Stripe Customer Management
// ============================================================================

/**
 * Create or get Stripe customer for authenticated user
 *
 * Backend automatically creates a Stripe customer for the user
 * This allows saving payment methods for future use
 *
 * @param payload - Customer email and optional name
 * @returns Stripe customer details
 *
 * @example
 * ```typescript
 * const customer = await createStripeCustomer({
 *   email: 'user@example.com',
 *   name: 'John Doe'
 * });
 * ```
 */
export async function createStripeCustomer(
  payload: CreateCustomerPayload
): Promise<StripeCustomer> {
  try {
    const response = await apiClient.post<StripeCustomer>(
      '/payments/stripe/customer',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create customer';
      throw new Error(message);
    }
    throw error;
  }
}

/**
 * Get Stripe customer details for user
 *
 * @param userId - User ID to retrieve customer for
 * @returns Customer details including saved payment methods
 */
export async function getStripeCustomer(
  userId: number
): Promise<StripeCustomer> {
  try {
    const response = await apiClient.get<StripeCustomer>(
      `/payments/stripe/customer/${userId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to retrieve customer';
      throw new Error(message);
    }
    throw error;
  }
}

// ============================================================================
// Payment Intent (Read-only)
// ============================================================================

/**
 * Get Payment Intent details (for status checking only)
 *
 * ⚠️ Note: This is READ-ONLY
 * Payment Intents are created by the backend, not by the client
 * Use this only to check payment status after webhook processing
 *
 * @param intentId - Stripe Payment Intent ID
 * @returns Payment intent details and status
 */
export async function getPaymentIntent(
  intentId: string
): Promise<PaymentIntentDetails> {
  try {
    const response = await apiClient.get<PaymentIntentDetails>(
      `/payments/stripe/payment-intent/${intentId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to retrieve payment intent';
      throw new Error(message);
    }
    throw error;
  }
}

// ============================================================================
// Payment Methods (for future saved cards)
// ============================================================================

/**
 * Get saved payment methods for current user
 *
 * Note: This endpoint may not be implemented yet in backend
 * Currently returns mock data
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
 *
 * Note: This endpoint may not be implemented yet in backend
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
 * Delete a saved payment method
 *
 * Note: This endpoint may not be implemented yet in backend
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

// ============================================================================
// Subscriptions (Future Implementation)
// ============================================================================

/**
 * Create a subscription
 *
 * Note: This endpoint may not be implemented yet in backend
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
