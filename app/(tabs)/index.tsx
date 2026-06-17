import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from "../../lib/subscriptions-store";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  const { user } = useUser();
  const { subscriptions, addSubscription } = useSubscriptions();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [isCreateSubscriptionVisible, setIsCreateSubscriptionVisible] =
    useState(false);

  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.emailAddresses[0]?.emailAddress ||
    "User";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <CreateSubscriptionModal
        visible={isCreateSubscriptionVisible}
        onClose={() => setIsCreateSubscriptionVisible(false)}
        onCreate={addSubscription}
      />
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user flex-1 min-w-0">
                <Image
                  source={
                    user?.imageUrl ? { uri: user.imageUrl } : images.avatar
                  }
                  className="home-avatar"
                />
                <View className="min-w-0 flex-1">
                  <Text className="home-user-name" numberOfLines={1}>
                    {displayName}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setIsCreateSubscriptionVisible(true)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Add subscription"
                className="home-add-button"
              >
                <Image source={icons.add} className="home-add-icon" />
                <Text className="home-add-text">New</Text>
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-stater">
                    No Upcoming Subscriptions
                  </Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions yet.</Text>
        }
        contentContainerClassName="pb-30"
      />
    </SafeAreaView>
  );
}
