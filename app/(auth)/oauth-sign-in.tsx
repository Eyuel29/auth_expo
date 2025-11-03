import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/auth-context';

export default function OAuthSignInScreen() {
  const router = useRouter();
  const { loginWithGoogle, loginWithWeChat, isLoading, error, clearError } = useAuth();
  
  const [googleLoading, setGoogleLoading] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    clearError();
    setGoogleLoading(true);
    
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Google Sign In Failed', error || 'An error occurred');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleWeChatSignIn = async () => {
    clearError();
    setWechatLoading(true);
    
    try {
      await loginWithWeChat();
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('WeChat Sign In Failed', error || 'An error occurred');
    } finally {
      setWechatLoading(false);
    }
  };

  const anyLoading = isLoading || googleLoading || wechatLoading;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-6 py-12">
        {/* Header */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-gray-900 mb-2">
            Welcome
          </Text>
          <Text className="text-lg text-gray-600">
            Sign in to continue
          </Text>
        </View>

        {/* OAuth Buttons */}
        <View className="space-y-4">
          {/* Google Sign In */}
          <TouchableOpacity
            className={`flex-row items-center justify-center py-4 px-6 rounded-lg border-2 ${
              googleLoading ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'
            }`}
            onPress={handleGoogleSignIn}
            disabled={anyLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#4285F4" />
            ) : (
              <>
                <Ionicons name="logo-google" size={24} color="#4285F4" />
                <Text className="text-gray-900 text-lg font-semibold ml-3">
                  Continue with Google
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* WeChat Sign In */}
          <TouchableOpacity
            className={`flex-row items-center justify-center py-4 px-6 rounded-lg ${
              wechatLoading ? 'bg-green-600' : 'bg-green-500'
            }`}
            onPress={handleWeChatSignIn}
            disabled={anyLoading}
          >
            {wechatLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">
                  Continue with WeChat
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Email/Password Option */}
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity
              className="flex-row items-center justify-center py-4 px-6 rounded-lg border-2 border-gray-300 bg-white"
              disabled={anyLoading}
            >
              <Ionicons name="mail" size={24} color="#6B7280" />
              <Text className="text-gray-900 text-lg font-semibold ml-3">
                Continue with Email
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Sign Up Link */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity disabled={anyLoading}>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

