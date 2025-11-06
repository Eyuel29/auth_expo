import { apiClient } from '@/api/client';
import * as paymentApi from '@/api/payment';
import type {
  PaymentIntent,
  PaymentMethod,
  Subscription,
  SubscriptionPlan,
} from '@/api/payment';

jest.mock('@/api/client');

describe('Payment API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent successfully', async () => {
      const mockIntent: PaymentIntent = {
        id: 'pi_123',
        clientSecret: 'pi_123_secret_456',
        amount: 999,
        currency: 'usd',
        status: 'requires_payment_method',
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockIntent,
      });

      const result = await paymentApi.createPaymentIntent({
        amount: 999,
        currency: 'usd',
      });

      expect(apiClient.post).toHaveBeenCalledWith('/payments/intents', {
        amount: 999,
        currency: 'usd',
      });
      expect(result).toEqual(mockIntent);
      expect(result.clientSecret).toBeTruthy();
    });

    it('should handle payment intent creation errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { message: 'Insufficient funds' },
        },
      });

      await expect(
        paymentApi.createPaymentIntent({
          amount: 999,
          currency: 'usd',
        })
      ).rejects.toThrow('Insufficient funds');
    });
  });

  describe('confirmPayment', () => {
    it('should confirm payment successfully', async () => {
      const mockConfirmedIntent: PaymentIntent = {
        id: 'pi_123',
        clientSecret: 'pi_123_secret_456',
        amount: 999,
        currency: 'usd',
        status: 'succeeded',
      };

      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: mockConfirmedIntent,
      });

      const result = await paymentApi.confirmPayment({
        paymentIntentId: 'pi_123',
        paymentMethodId: 'pm_456',
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/payments/intents/pi_123/confirm',
        { paymentMethodId: 'pm_456' }
      );
      expect(result.status).toBe('succeeded');
    });

    it('should handle payment confirmation errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        response: {
          data: { message: 'Card declined' },
        },
      });

      await expect(
        paymentApi.confirmPayment({
          paymentIntentId: 'pi_123',
          paymentMethodId: 'pm_456',
        })
      ).rejects.toThrow('Card declined');
    });
  });

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

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        paymentApi.createPaymentIntent({
          amount: 999,
          currency: 'usd',
        })
      ).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      (apiClient.post as jest.Mock).mockRejectedValueOnce({
        isAxiosError: true,
        code: 'ECONNABORTED',
        message: 'timeout of 10000ms exceeded',
      });

      await expect(
        paymentApi.createPaymentIntent({
          amount: 999,
          currency: 'usd',
        })
      ).rejects.toThrow();
    });
  });
});
