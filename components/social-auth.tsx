import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Linking from "expo-linking";

export function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleOAuth = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL:Linking.createURL("/")
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onFinished: () => {
          setIsLoading(false);
        },
      }
    );
  };

  const handleWeChatOAuth = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.social(
      {
        provider: "wechat",
        callbackURL:Linking.createURL("/")
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Failed to sign in");
          setIsLoading(false);
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onFinished: () => {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <View className="mt-6 p-4 bg-card rounded-lg border border-border">
      <Text className="text-lg font-semibold text-foreground mb-4">
        Sign In
      </Text>

      {error && (
        <View className="mb-4 p-3 bg-destructive/10 rounded-md">
          <Text className="text-destructive text-sm">{error}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleGoogleOAuth}
        disabled={isLoading}
        className="bg-primary p-6 my-4 rounded-md flex-row justify-center items-center"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-medium">
            Continue With Google
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleWeChatOAuth}
        disabled={isLoading}
        className="bg-green-600 p-6 my-4 rounded-md flex-row justify-center items-center"
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-primary-foreground font-medium">
            Continue With WeChat
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
