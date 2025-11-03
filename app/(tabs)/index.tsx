import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '@/contexts/auth-context';

export default function HomeScreen() {
  const { user } = useAuth();

  // Get display name (prioritize username, fallback to email)
  const displayName = user?.username || user?.email?.split('@')[0] || 'User';

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Welcome Section */}
        <View className="mb-12">
          <Text className="text-4xl font-bold text-gray-900 mb-3">
            Hello, {displayName}! 👋
          </Text>
          <Text className="text-lg text-gray-500">
            Welcome back to your dashboard
          </Text>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <View className="space-y-4">
            <TouchableOpacity className="bg-blue-500 rounded-xl p-6 shadow-sm">
              <Text className="text-2xl mb-2">🎫</Text>
              <Text className="text-xl font-bold text-white mb-1">
                Browse Catalog
              </Text>
              <Text className="text-blue-100">
                Discover available products and services
              </Text>
            </TouchableOpacity>

            <View className="flex-row space-x-4">
              <TouchableOpacity className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <Text className="text-2xl mb-2">📦</Text>
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  My Orders
                </Text>
                <Text className="text-gray-600 text-sm">
                  Order history
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
                <Text className="text-2xl mb-2">🎟️</Text>
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  My Tickets
                </Text>
                <Text className="text-gray-600 text-sm">
                  Active tickets
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Status Section */}
        <View className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
          <View className="flex-row items-center">
            <View className="bg-green-500 rounded-full w-3 h-3 mr-3" />
            <View className="flex-1">
              <Text className="text-green-900 font-semibold mb-1">
                You're all set!
              </Text>
              <Text className="text-green-700 text-sm">
                Signed in via {user?.oauth_provider ? user.oauth_provider.charAt(0).toUpperCase() + user.oauth_provider.slice(1) : 'Email'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

