import { useState } from 'react';
import
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

export default function SignUpScreen() {
  const router = useRouter();
  const {
    register,
    loginWithGoogle,
    loginWithWeChat,
    isLoading,
    error,
    clearError,
  } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [wechatLoading, setWechatLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const anyLoading = isLoading || googleLoading || wechatLoading;

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Username validation (optional but recommended)
    if (username && username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

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

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        username: username.trim() || undefined,
      });

      // Show success message
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (_err) {
      // Error is handled by context
      Alert.alert(
        'Sign Up Failed',
        error || 'Unable to create your account. Please try again.'
      );
    }
  };

  const handleGoogleSignUp = async () => {
    clearError();
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (_err) {
      Alert.alert(
        'Sign Up Failed',
        error || 'Unable to continue with Google. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleWeChatSignUp = async () => {
    clearError();
    setWechatLoading(true);

    try {
      await loginWithWeChat();
      router.replace('/(tabs)');
    } catch (_err) {
      Alert.alert(
        'Sign Up Failed',
        error || 'Unable to continue with WeChat. Please try again.'
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
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-4xl font-bold text-gray-900 mb-2">
              Create Account
            </Text>
            <Text className="text-lg text-gray-600">
              Sign up to get started
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Username Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Username (optional)
              </Text>
              <TextInput
                className={`px-4 py-3 border rounded-lg text-base ${
                  validationErrors.username
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Choose a username"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (validationErrors.username) {
                    setValidationErrors({
                      ...validationErrors,
                      username: undefined,
                    });
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!anyLoading}
              />
              {validationErrors.username && (
                <Text className="text-sm text-red-500 mt-1">
                  {validationErrors.username}
                </Text>
              )}
            </View>

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
                placeholder="Create a password"
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

            {/* Confirm Password Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </Text>
              <TextInput
                className={`px-4 py-3 border rounded-lg text-base ${
                  validationErrors.confirmPassword
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (validationErrors.confirmPassword) {
                    setValidationErrors({
                      ...validationErrors,
                      confirmPassword: undefined,
                    });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!anyLoading}
              />
              {validationErrors.confirmPassword && (
                <Text className="text-sm text-red-500 mt-1">
                  {validationErrors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Error Message */}
            {error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg ${
                isLoading ? 'bg-blue-300' : 'bg-blue-500'
              }`}
              onPress={handleSignUp}
              disabled={anyLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-lg font-semibold">
                  Create Account
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
              onPress={handleGoogleSignUp}
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
              onPress={handleWeChatSignUp}
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

          {/* Sign In Link */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity disabled={anyLoading}>
                <Text className="text-blue-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
