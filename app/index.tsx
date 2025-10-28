import { authClient } from "@/lib/auth-client";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { Container } from "@/components/container";
import { SocialAuth } from "@/components/social-auth";

export default function Home() {
	const { data: session } = authClient.useSession();

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="px-4">
					{session?.user ? (
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
								onPress={() => {
									authClient.signOut();
								}}
							>
								<Text className="text-white font-medium">Sign Out</Text>
							</TouchableOpacity>
						</View>
					) : null}
					{!session?.user && (
						<>
							{/* <SignIn />
							<SignUp /> */}
							<SocialAuth />
						</>
					)}
				</View>
			</ScrollView>
		</Container>
	);
}
