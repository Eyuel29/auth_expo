/**
 * Payment History Screen
 */

import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  stripeService,
  type PaymentHistoryItem,
} from '@/api/payments/stripe-service';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await stripeService.getPaymentHistory();
      setPayments(data);
    } catch (error) {
      console.error('[PaymentHistory] Load error:', error);
      // Show mock data for demo
      setPayments([
        {
          id: 1,
          order_id: 1001,
          amount: 9999,
          currency: 'USD',
          status: 'completed',
          payment_method: 'Visa ****4242',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayments();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'refunded':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-600">Loading payments...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-6">
        <Text className="text-2xl font-bold mb-6">Payment History</Text>

        {payments.length === 0 ? (
          <View className="bg-white rounded-lg p-8 items-center">
            <Text className="text-gray-500 text-center">No payments yet</Text>
          </View>
        ) : (
          <View className="space-y-4">
            {payments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                className="bg-white rounded-lg p-4 shadow-sm"
                onPress={() => {
                  // Navigate to payment detail
                }}
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View>
                    <Text className="font-semibold text-gray-900">
                      Order #{payment.order_id}
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}
                  >
                    <Text className="text-xs font-medium capitalize">
                      {payment.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <Text className="text-sm text-gray-600">
                    {payment.payment_method}
                  </Text>
                  <Text className="text-lg font-bold text-gray-900">
                    ${(payment.amount / 100).toFixed(2)} {payment.currency}
                  </Text>
                </View>

                {payment.status === 'completed' && (
                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: '/payment/refund',
                        params: { orderId: String(payment.order_id) },
                      });
                    }}
                    className="mt-3 pt-3 border-t border-gray-100"
                  >
                    <Text className="text-sm text-blue-600 font-medium text-center">
                      Request Refund
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
