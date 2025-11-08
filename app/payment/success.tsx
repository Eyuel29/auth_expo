/**
 * Payment Success Screen
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentSuccessScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      {/* Success Icon */}
      <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-6">
        <Text className="text-5xl">✓</Text>
      </View>

      {/* Success Message */}
      <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Payment Successful!
      </Text>
      <Text className="text-base text-gray-600 text-center mb-6">
        Your order has been confirmed
      </Text>

      {orderId && (
        <View className="bg-blue-50 rounded-lg p-4 mb-8">
          <Text className="text-sm text-blue-600">Order ID</Text>
          <Text className="text-lg font-bold text-blue-900">#{orderId}</Text>
        </View>
      )}

      {/* Actions */}
      <View className="w-full space-y-3">
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          className="bg-blue-600 rounded-lg py-4 active:bg-blue-700"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Back to Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/payment/history')}
          className="bg-gray-100 rounded-lg py-4 active:bg-gray-200"
        >
          <Text className="text-gray-700 text-center text-lg font-semibold">
            View Payment History
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-xs text-gray-500 text-center mt-6">
        A confirmation email has been sent to your registered email address
      </Text>
    </View>
  );
}
