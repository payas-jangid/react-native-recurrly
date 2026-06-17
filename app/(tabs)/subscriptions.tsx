import React, { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import SubscriptionCard from "@/components/SubscriptionCard";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { useSubscriptions } from "../../lib/subscriptions-store";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const filteredSubscriptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) => {
      return [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.paymentMethod,
        subscription.status,
        subscription.billing,
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [searchQuery, subscriptions]);

  const listHeader = (
    <View className="mb-5 gap-4">
      <View>
        <Text className="text-3xl font-sans-bold text-primary">
          Subscriptions
        </Text>
        <Text className="mt-2 text-base font-sans-medium text-muted-foreground">
          {filteredSubscriptions.length} active list
          {filteredSubscriptions.length === 1 ? " item" : " items"}
        </Text>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search subscriptions"
          placeholderTextColor="rgba(0, 0, 0, 0.45)"
          className="flex-1 text-base font-sans-medium text-primary"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {searchQuery ? (
          <Pressable onPress={() => setSearchQuery("")}>
            <Text className="text-base font-sans-semibold text-accent">
              Clear
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  const listEmptyState = (
    <Text className="py-4 text-sm font-sans-medium text-black/60">
      {searchQuery
        ? `No subscriptions match "${searchQuery.trim()}".`
        : "No subscriptions yet."}
    </Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={filteredSubscriptions}
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
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmptyState}
        contentContainerClassName="pb-30"
        extraData={expandedSubscriptionId}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
