/**
 * Payment Type Definitions
 * Aligned with backend Stripe Checkout Sessions implementation
 * Backend: /home/eyuel/synque/express/src/modules/payments/stripe/
 */

// ============================================================================
// Stripe Checkout Session Types (Primary Payment Flow)
// ============================================================================

/**
 * Checkout Session Status
 * Mirrors backend stripe_checkout_sessions table
 */
export type CheckoutSessionStatus =
  | 'pending'
  | 'completed'
  | 'expired'
  | 'cancelled';

/**
 * Checkout Session Response
 * Returned when creating a new checkout session
 */
export interface CheckoutSessionResponse {
  session_id: string;
  checkout_url: string;
  expires_at: string;
}

/**
 * Request payload to create a Stripe Checkout Session
 */
export interface CreateCheckoutSessionPayload {
  order_id: number;
  success_url?: string;
  cancel_url?: string;
}

/**
 * Detailed Checkout Session Information
 * Returned when retrieving session details
 */
export interface CheckoutSession {
  session_id: string;
  order_id: number;
  amount: number; // Amount in cents
  currency: string;
  status: CheckoutSessionStatus;
  payment_status: string | null;
  expires_at: string;
}

// ============================================================================
// Stripe Customer Management
// ============================================================================

/**
 * Stripe Customer Details
 */
export interface StripeCustomer {
  customer_id: string;
  email: string;
  name: string | null;
  payment_methods: PaymentMethod[];
}

/**
 * Request to create or retrieve Stripe customer
 */
export interface CreateCustomerPayload {
  email: string;
  name?: string;
}

// ============================================================================
// Payment Methods
// ============================================================================

/**
 * Payment Method (Card)
 * For saved payment methods
 */
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

// ============================================================================
// Payment Intent (Read-only, for status checking)
// ============================================================================

/**
 * Payment Intent Status
 * Used for tracking payment state after checkout
 */
export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled';

/**
 * Payment Intent Details
 * Read-only access to check payment status
 * Note: PaymentIntents are created by backend, not by client
 */
export interface PaymentIntentDetails {
  payment_intent_id: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  order_id: number;
  created: number; // Unix timestamp
  charges: {
    total: number;
    data: unknown[]; // Charge objects from Stripe
  };
}

// ============================================================================
// Subscriptions (Future)
// ============================================================================

/**
 * Subscription Status
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due';

/**
 * Subscription Details
 */
export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  currentPeriodEnd: string;
}

/**
 * Create Subscription Request
 */
export interface CreateSubscriptionPayload {
  planId: string;
  paymentMethodId: string;
}

/**
 * Subscription Plan
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

// ============================================================================
// Error Types
// ============================================================================

/**
 * Payment Error Codes
 */
export type PaymentErrorCode =
  | 'INVALID_ORDER_ID'
  | 'ORDER_NOT_FOUND'
  | 'ORDER_ALREADY_PAID'
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'PAYMENT_FAILED'
  | 'INSUFFICIENT_FUNDS'
  | 'CARD_DECLINED'
  | 'NETWORK_ERROR';

/**
 * Payment Error Response
 */
export interface PaymentError {
  error: string;
  code?: PaymentErrorCode;
  message: string;
}
