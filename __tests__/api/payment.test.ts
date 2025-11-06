import { apiClient } from '@/api/client';
import * as paymentApi from '@/api/payment';
import type {
  CheckoutSessionResponse,
  CheckoutSession,
  StripeCustomer,
  PaymentMethod,
  PaymentIntentDetails,
  Subscription,
  SubscriptionPlan,
} from '@/shared/types/payment';

jest.mock('@/api/client');

/**
 * Payment API Tests
 *
 * Testing Stripe Checkout Sessions flow (aligned with backend)
 * Backend: /home/eyuel/synque/express/src/modules/payments/stripe/
 */

describe('Payment API - Stripe Checkout Sessions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================================================
  // Checkout Sessions (Primary Payment Flow)
  // ==========================================================================

  describe('createCheckoutSession', () => {
    it('should create a checkout session successfully', async () => {
      const mockSessionResponse: CheckoutSessionResponse = {
        session_id: 'cs_test_mock_123456',
        checkout_url: 'https://checkout.stripe.com/pay/cs_test_mock_123456',
        expires_at: '2025-11-07T12:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockSessionResponse,
      });

      const result = await paymentApi.createCheckoutSession({
        order_id: 42,
        success_url: 'myapp://payment/success',
        cancel_url: 'myapp://payment/cancel',
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/payments/stripe/checkout-session',
        {
          order_id: 42,
          success_url: 'myapp://payment/success',
          cancel_url: 'myapp://payment/cancel',
        }
      );
      expect(result.session_id).toBe('cs_test_mock_123456');
      expect(result.checkout_url).toContain('checkout.stripe.com');
      expect(result.expires_at).toBeTruthy();
    });

    it('should create checkout session without optional URLs', async () => {
      const mockSessionResponse: CheckoutSessionResponse = {
        session_id: 'cs_test_mock_789',
        checkout_url: 'https://checkout.stripe.com/pay/cs_test_mock_789',
        expires_at: '2025-11-07T12:00:00Z',
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockSessionResponse,
      });

      const result = await paymentApi.createCheckoutSession({
        order_id: 42,
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/payments/stripe/checkout-session',
        {
          order_id: 42,
        }
      );
      expect(result.session_id).toBeTruthy();
    });

    it('should handle order not found error', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 404,
          data: { error: 'Order not found' },
        },
      });

      await expect(
        paymentApi.createCheckoutSession({ order_id: 999 })
      ).rejects.toThrow('Order not found');
    });

    it('should handle order already paid error', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: 'Order already paid or invalid status' },
        },
      });

      await expect(
        paymentApi.createCheckoutSession({ order_id: 42 })
      ).rejects.toThrow('Order already paid or invalid status');
    });

    it('should handle invalid order_id validation error', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 422,
          data: {
            error: 'Validation failed',
            code: 'STRIPE_INVALID_ORDER_ID',
            message: 'order_id must be a valid number',
          },
        },
      });

      await expect(
        paymentApi.createCheckoutSession({ order_id: NaN as unknown as number })
      ).rejects.toThrow('order_id must be a valid number');
    });

    it('should handle network errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        paymentApi.createCheckoutSession({ order_id: 42 })
      ).rejects.toThrow('Network error');
    });
  });

  describe('getCheckoutSession', () => {
    it('should retrieve checkout session details successfully', async () => {
      const mockSession: CheckoutSession = {
        session_id: 'cs_test_mock_123',
        order_id: 42,
        amount: 5000, // $50.00 in cents
        currency: 'SGD',
        status: 'completed',
        payment_status: 'paid',
        expires_at: '2025-11-07T12:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockSession,
      });

      const result = await paymentApi.getCheckoutSession('cs_test_mock_123');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/payments/stripe/session/cs_test_mock_123'
      );
      expect(result.session_id).toBe('cs_test_mock_123');
      expect(result.status).toBe('completed');
      expect(result.payment_status).toBe('paid');
      expect(result.amount).toBe(5000);
    });

    it('should retrieve pending checkout session', async () => {
      const mockSession: CheckoutSession = {
        session_id: 'cs_test_pending',
        order_id: 42,
        amount: 5000,
        currency: 'SGD',
        status: 'pending',
        payment_status: null,
        expires_at: '2025-11-07T12:00:00Z',
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockSession,
      });

      const result = await paymentApi.getCheckoutSession('cs_test_pending');

      expect(result.status).toBe('pending');
      expect(result.payment_status).toBeNull();
    });

    it('should handle session not found error', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 404,
          data: { error: 'Session not found' },
        },
      });

      await expect(paymentApi.getCheckoutSession('cs_invalid')).rejects.toThrow(
        'Session not found'
      );
    });

    it('should handle access denied error', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 403,
          data: { error: 'Access denied - session does not belong to user' },
        },
      });

      await expect(
        paymentApi.getCheckoutSession('cs_other_user')
      ).rejects.toThrow('Access denied');
    });
  });

  // ==========================================================================
  // Stripe Customer Management
  // ==========================================================================

  describe('createStripeCustomer', () => {
    it('should create a Stripe customer successfully', async () => {
      const mockCustomer: StripeCustomer = {
        customer_id: 'cus_mock_123',
        email: 'user@example.com',
        name: 'John Doe',
        payment_methods: [],
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockCustomer,
      });

      const result = await paymentApi.createStripeCustomer({
        email: 'user@example.com',
        name: 'John Doe',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/payments/stripe/customer', {
        email: 'user@example.com',
        name: 'John Doe',
      });
      expect(result.customer_id).toBe('cus_mock_123');
      expect(result.email).toBe('user@example.com');
    });

    it('should create customer without name', async () => {
      const mockCustomer: StripeCustomer = {
        customer_id: 'cus_mock_456',
        email: 'user2@example.com',
        name: null,
        payment_methods: [],
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockCustomer,
      });

      const result = await paymentApi.createStripeCustomer({
        email: 'user2@example.com',
      });

      expect(result.name).toBeNull();
    });
  });

  describe('getStripeCustomer', () => {
    it('should retrieve customer details successfully', async () => {
      const mockCustomer: StripeCustomer = {
        customer_id: 'cus_mock_123',
        email: 'user@example.com',
        name: 'John Doe',
        payment_methods: [
          {
            id: 'pm_123',
            type: 'card',
            card: {
              brand: 'visa',
              last4: '4242',
              expMonth: 12,
              expYear: 2025,
            },
          },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockCustomer,
      });

      const result = await paymentApi.getStripeCustomer(1);

      expect(apiClient.get).toHaveBeenCalledWith('/payments/stripe/customer/1');
      expect(result.customer_id).toBe('cus_mock_123');
      expect(result.payment_methods).toHaveLength(1);
    });

    it('should handle access denied error', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 403,
          data: { error: 'Access denied' },
        },
      });

      await expect(paymentApi.getStripeCustomer(999)).rejects.toThrow(
        'Access denied'
      );
    });
  });

  // ==========================================================================
  // Payment Intent (Read-only)
  // ==========================================================================

  describe('getPaymentIntent', () => {
    it('should retrieve payment intent details successfully', async () => {
      const mockIntent: PaymentIntentDetails = {
        payment_intent_id: 'pi_123abc456def',
        amount: 5000,
        currency: 'sgd',
        status: 'succeeded',
        order_id: 42,
        created: 1699300000,
        charges: {
          total: 1,
          data: [],
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockIntent,
      });

      const result = await paymentApi.getPaymentIntent('pi_123abc456def');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/payments/stripe/payment-intent/pi_123abc456def'
      );
      expect(result.payment_intent_id).toBe('pi_123abc456def');
      expect(result.status).toBe('succeeded');
      expect(result.charges.total).toBe(1);
    });

    it('should retrieve processing payment intent', async () => {
      const mockIntent: PaymentIntentDetails = {
        payment_intent_id: 'pi_processing',
        amount: 5000,
        currency: 'sgd',
        status: 'processing',
        order_id: 42,
        created: 1699300000,
        charges: {
          total: 0,
          data: [],
        },
      };

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockIntent,
      });

      const result = await paymentApi.getPaymentIntent('pi_processing');

      expect(result.status).toBe('processing');
      expect(result.charges.total).toBe(0);
    });

    it('should handle payment intent not found', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 404,
          data: { error: 'Payment intent not found' },
        },
      });

      await expect(paymentApi.getPaymentIntent('pi_invalid')).rejects.toThrow(
        'Payment intent not found'
      );
    });

    it('should handle access denied for other user payment intent', async () => {
      (apiClient.get as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 403,
          data: { error: 'Access denied' },
        },
      });

      await expect(
        paymentApi.getPaymentIntent('pi_other_user')
      ).rejects.toThrow('Access denied');
    });
  });

  // ==========================================================================
  // Payment Methods (Future Implementation)
  // ==========================================================================

  describe('getPaymentMethods', () => {
    it('should fetch payment methods successfully', async () => {
      const mockMethods: PaymentMethod[] = [
        {
          id: 'pm_123',
          type: 'card',
          card: {
            brand: 'visa',
            last4: '4242',
            expMonth: 12,
            expYear: 2025,
          },
        },
        {
          id: 'pm_456',
          type: 'card',
          card: {
            brand: 'mastercard',
            last4: '5555',
            expMonth: 6,
            expYear: 2026,
          },
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { paymentMethods: mockMethods },
      });

      const result = await paymentApi.getPaymentMethods();

      expect(apiClient.get).toHaveBeenCalledWith('/payments/methods');
      expect(result).toHaveLength(2);
      expect(result[0]?.card.last4).toBe('4242');
    });

    it('should return empty array when no payment methods', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { paymentMethods: [] },
      });

      const result = await paymentApi.getPaymentMethods();

      expect(result).toEqual([]);
    });
  });

  describe('addPaymentMethod', () => {
    it('should add payment method successfully', async () => {
      const mockMethod: PaymentMethod = {
        id: 'pm_789',
        type: 'card',
        card: {
          brand: 'amex',
          last4: '0005',
          expMonth: 3,
          expYear: 2027,
        },
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockMethod,
      });

      const result = await paymentApi.addPaymentMethod('pm_789');

      expect(apiClient.post).toHaveBeenCalledWith('/payments/methods', {
        paymentMethodId: 'pm_789',
      });
      expect(result.id).toBe('pm_789');
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete payment method successfully', async () => {
      (apiClient.delete as jest.Mock).mockResolvedValueOnce({});

      await paymentApi.deletePaymentMethod('pm_123');

      expect(apiClient.delete).toHaveBeenCalledWith('/payments/methods/pm_123');
    });

    it('should handle deletion errors', async () => {
      (apiClient.delete as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { message: 'Payment method not found' },
        },
      });

      await expect(
        paymentApi.deletePaymentMethod('pm_invalid')
      ).rejects.toThrow('Payment method not found');
    });
  });

  // ==========================================================================
  // Subscription Management (Future Implementation)
  // ==========================================================================

  describe('Subscription Management', () => {
    describe('createSubscription', () => {
      it('should create subscription successfully', async () => {
        const mockSubscription: Subscription = {
          id: 'sub_123',
          status: 'active',
          planId: 'plan_pro',
          planName: 'Pro Plan',
          amount: 2999,
          currency: 'usd',
          currentPeriodEnd: '2025-12-31T23:59:59Z',
        };

        (apiClient.post as jest.Mock).mockResolvedValueOnce({
          data: mockSubscription,
        });

        const result = await paymentApi.createSubscription({
          planId: 'plan_pro',
          paymentMethodId: 'pm_123',
        });

        expect(apiClient.post).toHaveBeenCalledWith('/subscriptions', {
          planId: 'plan_pro',
          paymentMethodId: 'pm_123',
        });
        expect(result.status).toBe('active');
        expect(result.planName).toBe('Pro Plan');
      });
    });

    describe('getSubscription', () => {
      it('should fetch current subscription', async () => {
        const mockSubscription: Subscription = {
          id: 'sub_123',
          status: 'active',
          planId: 'plan_pro',
          planName: 'Pro Plan',
          amount: 2999,
          currency: 'usd',
          currentPeriodEnd: '2025-12-31T23:59:59Z',
        };

        (apiClient.get as jest.Mock).mockResolvedValueOnce({
          data: { subscription: mockSubscription },
        });

        const result = await paymentApi.getSubscription();

        expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/current');
        expect(result).toEqual(mockSubscription);
      });

      it('should return null when no subscription exists', async () => {
        (apiClient.get as jest.Mock).mockRejectedValueOnce({
          isAxiosError: true,
          response: { status: 404 },
        });

        const result = await paymentApi.getSubscription();

        expect(result).toBeNull();
      });
    });

    describe('cancelSubscription', () => {
      it('should cancel subscription successfully', async () => {
        const mockCanceledSub: Subscription = {
          id: 'sub_123',
          status: 'canceled',
          planId: 'plan_pro',
          planName: 'Pro Plan',
          amount: 2999,
          currency: 'usd',
          currentPeriodEnd: '2025-12-31T23:59:59Z',
        };

        (apiClient.post as jest.Mock).mockResolvedValueOnce({
          data: mockCanceledSub,
        });

        const result = await paymentApi.cancelSubscription('sub_123');

        expect(apiClient.post).toHaveBeenCalledWith(
          '/subscriptions/sub_123/cancel'
        );
        expect(result.status).toBe('canceled');
      });
    });

    describe('getSubscriptionPlans', () => {
      it('should fetch available plans', async () => {
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'plan_basic',
            name: 'Basic Plan',
            description: 'Essential features',
            amount: 999,
            currency: 'usd',
            interval: 'month',
            features: ['Feature 1', 'Feature 2'],
          },
          {
            id: 'plan_pro',
            name: 'Pro Plan',
            description: 'All features',
            amount: 2999,
            currency: 'usd',
            interval: 'month',
            features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
          },
        ];

        (apiClient.get as jest.Mock).mockResolvedValueOnce({
          data: { plans: mockPlans },
        });

        const result = await paymentApi.getSubscriptionPlans();

        expect(apiClient.get).toHaveBeenCalledWith('/subscriptions/plans');
        expect(result).toHaveLength(2);
        expect(result[1]?.amount).toBe(2999);
      });
    });
  });

  // ==========================================================================
  // Error Handling
  // ==========================================================================

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        paymentApi.createCheckoutSession({ order_id: 42 })
      ).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      });

      await expect(
        paymentApi.createCheckoutSession({ order_id: 42 })
      ).rejects.toThrow();
    });

    it('should handle server errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          status: 500,
          data: { error: 'Internal server error' },
        },
      });

      await expect(
        paymentApi.createCheckoutSession({ order_id: 42 })
      ).rejects.toThrow('Internal server error');
    });
  });
});
