import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

export default function SignInScreen() {
  const router = useRouter();
  const {
    login,
    loginWithGoogle,
    loginWithWeChat,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const anyLoading = isLoading || googleLoading || wechatLoading;

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Email validation
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email: email.trim().toLowerCase(), password });

      // Navigate to home after successful login
      router.replace('/(tabs)');
    } catch (_err) {
      // Error is handled by context
      Alert.alert(
        'Sign In Failed',
        error ||
          'Unable to sign in. Please check your credentials and try again.'
      );
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (_err) {
      Alert.alert(
        'Sign In Failed',
        error || 'Unable to sign in with Google. Please try again.'
      );
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
    } catch (_err) {
      Alert.alert(
        'Sign In Failed',
        error || 'Unable to sign in with WeChat. Please try again.'
      );
    } finally {
      setWechatLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-10">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Welcome Back
            </Text>
            <Text className="text-lg text-gray-600">
              Sign in to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email
              </Text>
              <TextInput
                className={`px-4 py-3 border rounded-lg text-base ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (validationErrors.email) {
                    setValidationErrors({
                      ...validationErrors,
                      email: undefined,
                    });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!anyLoading}
              />
              {validationErrors.email && (
                <Text className="text-sm text-red-500 mt-1">
                  {validationErrors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Password
              </Text>
              <TextInput
                className={`px-4 py-3 border rounded-lg text-base ${
                  validationErrors.password
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (validationErrors.password) {
                    setValidationErrors({
                      ...validationErrors,
                      password: undefined,
                    });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!anyLoading}
              />
              {validationErrors.password && (
                <Text className="text-sm text-red-500 mt-1">
                  {validationErrors.password}
                </Text>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg ${
                isLoading ? 'bg-blue-300' : 'bg-blue-500'
              }`}
              onPress={handleSignIn}
              disabled={anyLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* OAuth Options */}
          <View className="my-6 flex-row items-center">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="space-y-4">
            <TouchableOpacity
              className={`flex-row items-center justify-center py-4 px-6 rounded-lg border-2 ${
                googleLoading
                  ? 'bg-gray-100 border-gray-200'
                  : 'bg-white border-gray-300'
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
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={24}
                    color="white"
                  />
                  <Text className="text-white text-lg font-semibold ml-3">
                    Continue with WeChat
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity disabled={anyLoading}>
                <Text className="text-blue-500 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
