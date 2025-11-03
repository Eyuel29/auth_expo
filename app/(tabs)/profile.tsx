import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    // On web, use a simpler confirm
    if (Platform.OS === 'web') {
      if (
        typeof window !== 'undefined' &&
        window.confirm('Are you sure you want to logout?')
      ) {
        try {
          setLoggingOut(true);
          await logout();
          router.push('/(auth)/oauth-sign-in');
        } catch (error) {
          console.error('Logout error:', error);
          Alert.alert('Error', 'Failed to logout. Please try again.');
          setLoggingOut(false);
        }
      }
    } else {
      // On mobile, use Alert
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              await logout();
              router.push('/(auth)/oauth-sign-in');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
              setLoggingOut(false);
            }
          },
        },
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-500 items-center justify-center mb-4">
            <Text className="text-4xl text-white font-bold">
              {user?.username?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase()}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {user?.username || 'User'}
          </Text>
          <Text className="text-gray-600">{user?.email || 'No email'}</Text>
        </View>

        {/* Profile Options */}
        <View className="space-y-3 mb-8">
          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={24} color="#4b5563" />
              <Text className="text-lg text-gray-900 ml-3">Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons name="lock-closed-outline" size={24} color="#4b5563" />
              <Text className="text-lg text-gray-900 ml-3">
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4b5563"
              />
              <Text className="text-lg text-gray-900 ml-3">Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons name="help-circle-outline" size={24} color="#4b5563" />
              <Text className="text-lg text-gray-900 ml-3">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
            <View className="flex-row items-center">
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#4b5563"
              />
              <Text className="text-lg text-gray-900 ml-3">About</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-lg p-4 flex-row items-center justify-center"
          onPress={handleLogout}
          disabled={isLoading || loggingOut}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white text-lg font-semibold ml-2">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <View className="mt-8 items-center">
          <Text className="text-gray-500 text-sm">Version 1.0.0</Text>
          <Text className="text-gray-400 text-xs mt-1">
            © 2025 Your Company
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
