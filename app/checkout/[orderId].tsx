/**
 * Checkout Screen for Stripe Payment
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { stripeService } from '@/api/payments/stripe-service';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummary {
  id: string;
  total_amount: number;
  currency: string;
  items: OrderItem[];
}

export default function CheckoutScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    // In a real app, fetch order details here
    if (orderId) {
      setOrder({
        id: orderId,
        total_amount: 9999, // $99.99 in cents
        currency: 'USD',
        items: [{ name: 'Premium Package', quantity: 1, price: 9999 }],
      });
    }
  }, [orderId]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const parsedOrderId = Number(orderId);
      if (!orderId || Number.isNaN(parsedOrderId)) {
        throw new Error('Invalid order ID');
      }

      // Create checkout session
      const session = await stripeService.createCheckoutSession({
        order_id: parsedOrderId,
        success_url: 'authexpo://payment/success',
        cancel_url: 'authexpo://payment/cancel',
      });

      // Open Stripe Checkout in browser
      const result = await WebBrowser.openBrowserAsync(session.checkout_url, {
        dismissButtonStyle: 'cancel',
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
      });

      if (result.type === 'cancel') {
        Alert.alert('Payment Cancelled', 'You cancelled the payment.');
      } else {
        // Check payment status
        router.push({
          pathname: '/payment/processing',
          params: { orderId: String(orderId) },
        });
      }
    } catch (error) {
      console.error('[Checkout] ❌ Payment error:', error);
      Alert.alert(
        'Payment Error',
        error instanceof Error ? error.message : 'Failed to process payment'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 space-y-6">
        {/* Header */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold mb-2">Checkout</Text>
          <Text className="text-gray-600">Order #{orderId}</Text>
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-bold mb-4">Order Summary</Text>

          {order.items.map((item, index) => (
            <View key={index} className="flex-row justify-between mb-3">
              <View>
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-500">
                  Qty: {item.quantity}
                </Text>
              </View>
              <Text className="font-semibold">
                ${(item.price / 100).toFixed(2)}
              </Text>
            </View>
          ))}

          <View className="border-t border-gray-200 my-4" />

          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold">Total</Text>
            <Text className="text-2xl font-bold text-blue-600">
              ${(order.total_amount / 100).toFixed(2)} {order.currency}
            </Text>
          </View>
        </View>

        {/* Payment Button */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-bold mb-4">Payment Method</Text>

          <TouchableOpacity
            onPress={handlePayment}
            disabled={loading}
            className={`py-4 rounded-lg ${loading ? 'bg-blue-300' : 'bg-blue-600 active:bg-blue-700'}`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="items-center">
                <Text className="text-white text-lg font-semibold mb-1">
                  Pay ${(order.total_amount / 100).toFixed(2)} {order.currency}
                </Text>
                <Text className="text-white text-xs opacity-80">
                  Secured by Stripe
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text className="text-xs text-gray-500 text-center mt-4">
            Your payment is secured by Stripe. We never store your card details.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
