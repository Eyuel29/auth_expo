/**
 * Refund Request Screen
 */

import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { stripeService } from '@/api/payments/stripe-service';

export default function RefundScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for the refund');
      return;
    }

    Alert.alert(
      'Confirm Refund',
      'Are you sure you want to request a refund? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Refund',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await stripeService.requestRefund({
                order_id: parseInt(orderId),
                reason: reason.trim(),
              });

              Alert.alert(
                'Refund Requested',
                'Your refund request has been submitted. It will be processed within 5-10 business days.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error('[Refund] Error:', error);
              Alert.alert(
                'Refund Failed',
                error instanceof Error
                  ? error.message
                  : 'Failed to request refund'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 space-y-6">
        {/* Header */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold mb-2">Request Refund</Text>
          <Text className="text-gray-600">Order #{orderId}</Text>
        </View>

        {/* Refund Policy */}
        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="font-semibold text-blue-900 mb-2">
            Refund Policy
          </Text>
          <Text className="text-sm text-blue-700">
            • Refunds typically take 5-10 business days{'\n'}• The amount will
            be refunded to your original payment method{'\n'}• Refund requests
            are reviewed within 24 hours
          </Text>
        </View>

        {/* Reason Input */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="font-semibold text-gray-900 mb-3">
            Reason for Refund *
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base min-h-32"
            placeholder="Please explain why you're requesting a refund..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleRefund}
          disabled={loading || !reason.trim()}
          className={`py-4 rounded-lg ${
            loading || !reason.trim()
              ? 'bg-red-300'
              : 'bg-red-500 active:bg-red-600'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">
              Submit Refund Request
            </Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={loading}
          className="bg-gray-100 py-4 rounded-lg active:bg-gray-200"
        >
          <Text className="text-gray-700 text-center text-lg font-semibold">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
