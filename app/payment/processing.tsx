/**
 * Payment Processing Screen
 * Shows while waiting for webhook confirmation
 */

import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PaymentProcessingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [dots, setDots] = useState('.');

  useEffect(() => {
    // Animate dots
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    // Check payment status after a delay
    const timeout = setTimeout(() => {
      // In a real app, you'd poll the order status
      // For now, assume success after 3 seconds
      router.replace({
        pathname: '/payment/success',
        params: { orderId: String(orderId) },
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <ActivityIndicator size="large" color="#0066FF" />

      <Text className="text-xl font-semibold mt-6 mb-2 text-center">
        Processing Payment{dots}
      </Text>

      <Text className="text-sm text-gray-500 text-center">
        Please wait while we verify your payment
      </Text>

      <Text className="text-xs text-gray-400 text-center mt-6">
        This may take a few moments
      </Text>
    </View>
  );
}
