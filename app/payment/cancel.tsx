/**
 * Payment Cancelled Screen
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentCancelScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();

  const handleRetry = () => {
    if (orderId) {
      router.push({
        pathname: '/checkout/[orderId]',
        params: { orderId: String(orderId) },
      });
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      {/* Cancel Icon */}
      <View className="w-24 h-24 rounded-full bg-yellow-100 items-center justify-center mb-6">
        <Text className="text-5xl">⚠</Text>
      </View>

      {/* Cancel Message */}
      <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Payment Cancelled
      </Text>
      <Text className="text-base text-gray-600 text-center mb-8">
        You cancelled the payment. Your order is still pending.
      </Text>

      {/* Actions */}
      <View className="w-full space-y-3">
        <TouchableOpacity
          onPress={handleRetry}
          className="bg-blue-600 rounded-lg py-4 active:bg-blue-700"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Try Again
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          className="bg-gray-100 rounded-lg py-4 active:bg-gray-200"
        >
          <Text className="text-gray-700 text-center text-lg font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
