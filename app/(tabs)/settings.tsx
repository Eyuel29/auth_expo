/**
 * Settings Screen with Account Linking
 */

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function SettingsScreen() {
  const {
    user,
    logout,
    loginWithGoogle,
    loginWithWeChat,
    isLoading,
    clearError,
  } = useAuth();
  const router = useRouter();
  const [linkingProvider, setLinkingProvider] = useState<
    'google' | 'wechat' | null
  >(null);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/sign-in');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 space-y-6">
        {/* User Info Section */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Account Settings
          </Text>

          <View className="space-y-3">
            <View>
              <Text className="text-sm text-gray-500">Username</Text>
              <Text className="text-base text-gray-900 font-medium mt-1">
                {user?.username || 'N/A'}
              </Text>
            </View>

            {user?.email && (
              <View>
                <Text className="text-sm text-gray-500">Email</Text>
                <Text className="text-base text-gray-900 font-medium mt-1">
                  {user.email}
                </Text>
              </View>
            )}

            <View>
              <Text className="text-sm text-gray-500">Sign-in Method</Text>
              <Text className="text-base text-gray-900 font-medium mt-1">
                {user?.oauth_provider === 'google' && '🔵 Google'}
                {user?.oauth_provider === 'wechat' && '🟢 WeChat'}
                {user?.oauth_provider === 'email' && '📧 Email'}
                {!user?.oauth_provider && 'Email'}
              </Text>
            </View>
          </View>
        </View>

        {/* Link Accounts Section */}
        <View className="bg-white rounded-lg p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-900 mb-2">
            Linked Accounts
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            Connect your social accounts for easier sign-in
          </Text>

          <View className="space-y-3">
            {user?.oauth_provider !== 'google' && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    clearError();
                    setLinkingProvider('google');
                    await loginWithGoogle();
                    Alert.alert('Success', 'Google account linked!');
                  } catch (err) {
                    const message =
                      err instanceof Error
                        ? err.message
                        : 'Unable to link Google account';
                    Alert.alert('Error', message);
                  } finally {
                    setLinkingProvider(null);
                  }
                }}
                disabled={isLoading || linkingProvider !== null}
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg border-2 ${
                  linkingProvider === 'google'
                    ? 'bg-gray-100 border-gray-200'
                    : 'bg-white border-gray-300'
                }`}
              >
                {linkingProvider === 'google' ? (
                  <ActivityIndicator color="#4285F4" />
                ) : (
                  <Text className="text-gray-900 text-lg font-semibold">
                    Link Google Account
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {user?.oauth_provider !== 'wechat' && (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    clearError();
                    setLinkingProvider('wechat');
                    await loginWithWeChat();
                    Alert.alert('Success', 'WeChat account linked!');
                  } catch (err) {
                    const message =
                      err instanceof Error
                        ? err.message
                        : 'Unable to link WeChat account';
                    Alert.alert('Error', message);
                  } finally {
                    setLinkingProvider(null);
                  }
                }}
                disabled={isLoading || linkingProvider !== null}
                className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${
                  linkingProvider === 'wechat' ? 'bg-green-600' : 'bg-green-500'
                }`}
              >
                {linkingProvider === 'wechat' ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    Link WeChat Account
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {user?.oauth_provider === 'google' && (
              <View className="p-4 bg-blue-50 rounded-lg">
                <Text className="text-blue-700 font-medium">
                  ✓ Google Account Connected
                </Text>
              </View>
            )}

            {user?.oauth_provider === 'wechat' && (
              <View className="p-4 bg-green-50 rounded-lg">
                <Text className="text-green-700 font-medium">
                  ✓ WeChat Account Connected
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment History Section */}
        <TouchableOpacity
          onPress={() => router.push('/payment/history')}
          className="bg-white rounded-lg p-4 shadow-sm flex-row items-center justify-between"
        >
          <Text className="text-base font-medium text-gray-900">
            Payment History
          </Text>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-lg py-4 active:bg-red-600"
        >
          <Text className="text-white text-center text-base font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
