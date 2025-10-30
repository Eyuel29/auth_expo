import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import WebBrowser from "expo-web-browser";

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { Container } from "@/components/container";
import { SocialAuth } from "@/components/social-auth";

type Subscription = {
  limits: Record<string, number> | undefined;
  priceId: string | undefined;
  id: string;
  plan: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialStart?: Date;
  trialEnd?: Date;
  referenceId: string;
  status:
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "paused"
    | "trialing"
    | "unpaid";
  periodStart?: Date;
  periodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  groupId?: string;
  seats?: number;
};

export default function Home() {
  const { data: session } = authClient.useSession();
  const [subscription, setSubscription] = useState<
    Subscription | null | undefined
  >(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const fetchSubscription = async () => {
      setLoading(true);
      setErrorMessage(null);
      const { data, error } = await authClient.subscription.list();

      if (error) {
        setErrorMessage(error.message || "Failed to fetch subscription.");
      } else if (data?.length) {
        setSubscription(data[0]);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [session]);

  const startSubscription = async () => {
    if (!session?.user) return;
    setProcessing(true);
    setErrorMessage(null);
    try {
      const { data, error } = await authClient.subscription.upgrade({
        plan: "rent",
        successUrl: "/dashboard",
        cancelUrl: "/pricing",
        disableRedirect: false,
      });

      if (error) {
        setErrorMessage(error.message || "Failed to start subscription.");
      } else if (data?.url) {
        await WebBrowser.openBrowserAsync(data.url);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Unexpected error.");
    } finally {
      setProcessing(false);
    }
  };

  const calculateDaysLeft = (periodEnd?: string | Date) => {
    if (!periodEnd) return 0;
    const end = new Date(periodEnd).getTime();
    const now = Date.now();
    const diff = Math.max(0, end - now);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-4">
          {session?.user ? (
            <>
              <View className="mb-6 p-4 bg-card rounded-lg border border-border">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-foreground text-base">
                    Welcome,{" "}
                    <Text className="font-medium">{session.user.name}</Text>
                  </Text>
                </View>
                <Text className="text-muted-foreground text-sm mb-4">
                  {session.user.email}
                </Text>

                <TouchableOpacity
                  className="bg-destructive py-2 px-4 rounded-md self-start"
                  onPress={() => authClient.signOut()}
                >
                  <Text className="text-white font-medium">Sign Out</Text>
                </TouchableOpacity>
              </View>

              <View className="mb-6 p-4 bg-card rounded-lg border border-border">
                <Text className="text-lg font-medium mb-2">Subscription</Text>

                {loading ? (
                  <ActivityIndicator size="small" />
                ) : errorMessage ? (
                  <Text className="text-red-500 mb-2">{errorMessage}</Text>
                ) : subscription ? (
                  <>
                    <Text className="mb-1">
                      Plan:{" "}
                      <Text className="font-medium">{subscription.plan}</Text>
                    </Text>
                    <Text className="mb-1">
                      Status:{" "}
                      <Text className="font-medium">{subscription.status}</Text>
                    </Text>
                    <Text className="mb-2">
                      Days Remaining:{" "}
                      <Text className="font-medium">
                        {calculateDaysLeft(subscription.periodEnd)}
                      </Text>
                    </Text>
                    {subscription.status !== "active" && (
                      <TouchableOpacity
                        className="bg-primary py-2 px-4 rounded-md self-start"
                        onPress={startSubscription}
                        disabled={processing}
                      >
                        <Text className="text-white font-medium">
                          {processing ? "Processing..." : "Pay / Activate"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    className="bg-primary py-2 px-4 rounded-md self-start"
                    onPress={startSubscription}
                    disabled={processing}
                  >
                    <Text className="text-white font-medium">
                      {processing ? "Processing..." : "Start Rent Subscription"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <SocialAuth />
          )}
        </View>
      </ScrollView>
    </Container>
  );
}
