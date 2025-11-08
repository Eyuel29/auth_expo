/**
 * Payment Error Screen
 */

import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentErrorScreen() {
  const { orderId, error } = useLocalSearchParams<{
    orderId?: string;
    error?: string;
  }>();
  const router = useRouter();

  const errorMessages: Record<string, string> = {
    card_declined: 'Your card was declined',
    insufficient_funds: 'Insufficient funds',
    expired_card: 'Your card has expired',
    network_error: 'Network connection failed',
  };

  const errorMessage =
    error && errorMessages[error]
      ? errorMessages[error]
      : 'An error occurred during payment';

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
      {/* Error Icon */}
      <View className="w-24 h-24 rounded-full bg-red-100 items-center justify-center mb-6">
        <Text className="text-5xl">✕</Text>
      </View>

      {/* Error Message */}
      <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">
        Payment Failed
      </Text>
      <Text className="text-base text-red-600 text-center mb-2">
        {errorMessage}
      </Text>
      <Text className="text-sm text-gray-500 text-center mb-8">
        Please try again or contact support if the problem persists
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
