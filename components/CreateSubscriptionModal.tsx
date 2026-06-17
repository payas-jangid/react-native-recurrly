import clsx from "clsx";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { icons } from "@/constants/icons";

const SafeContent = styled(View);

const FREQUENCIES = ["Monthly", "Yearly"] as const;
const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#f7cf74",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#d9e7ff",
  Design: "#b8e8d0",
  Productivity: "#f6d4bf",
  Cloud: "#d2e8f8",
  Music: "#f4c7d9",
  Other: "#d9d9d9",
};

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] =
    useState<(typeof FREQUENCIES)[number]>("Monthly");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]>("Other");
  const [errorMessage, setErrorMessage] = useState("");

  const parsedPrice = useMemo(() => Number(price.replace(/,/g, ".")), [price]);
  const nameIsValid = name.trim().length > 0;
  const priceIsValid = Number.isFinite(parsedPrice) && parsedPrice > 0;
  const canSubmit = nameIsValid && priceIsValid;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    setErrorMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!nameIsValid) {
      setErrorMessage("Enter a subscription name.");
      return;
    }

    if (!priceIsValid) {
      setErrorMessage("Enter a price greater than zero.");
      return;
    }

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(
        frequency === "Monthly" ? 1 : 1,
        frequency === "Monthly" ? "month" : "year",
      )
      .toISOString();

    onCreate({
      id: `subscription-${Date.now()}`,
      name: name.trim(),
      price: parsedPrice,
      frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category],
    });

    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="modal-overlay justify-end">
        <Pressable className="absolute inset-0" onPress={handleClose} />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full"
        >
          <SafeContent className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>

              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerClassName="modal-body pb-8"
            >
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Name</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errorMessage && !nameIsValid && "auth-input-error",
                    )}
                    placeholder="Enter subscription name"
                    placeholderTextColor="#8f8f8f"
                    value={name}
                    onChangeText={(value) => {
                      setName(value);
                      if (errorMessage) setErrorMessage("");
                    }}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Price</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errorMessage && !priceIsValid && "auth-input-error",
                    )}
                    placeholder="Enter price"
                    placeholderTextColor="#8f8f8f"
                    keyboardType="decimal-pad"
                    value={price}
                    onChangeText={(value) => {
                      setPrice(value);
                      if (errorMessage) setErrorMessage("");
                    }}
                  />
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Frequency</Text>
                  <View className="picker-row">
                    {FREQUENCIES.map((option) => {
                      const isActive = frequency === option;

                      return (
                        <Pressable
                          key={option}
                          className={clsx(
                            "picker-option",
                            isActive && "picker-option-active",
                          )}
                          onPress={() => setFrequency(option)}
                        >
                          <Text
                            className={clsx(
                              "picker-option-text",
                              isActive && "picker-option-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                <View className="auth-field">
                  <Text className="auth-label">Category</Text>
                  <View className="category-scroll">
                    {CATEGORIES.map((option) => {
                      const isActive = category === option;

                      return (
                        <Pressable
                          key={option}
                          className={clsx(
                            "category-chip",
                            isActive && "category-chip-active",
                          )}
                          onPress={() => setCategory(option)}
                        >
                          <Text
                            className={clsx(
                              "category-chip-text",
                              isActive && "category-chip-text-active",
                            )}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

                {errorMessage ? (
                  <Text className="auth-error">{errorMessage}</Text>
                ) : null}

                <Pressable
                  className={clsx(
                    "auth-button",
                    !canSubmit && "auth-button-disabled",
                  )}
                  onPress={handleSubmit}
                  disabled={!canSubmit}
                >
                  <Text className="auth-button-text">Create subscription</Text>
                </Pressable>
              </View>
            </ScrollView>
          </SafeContent>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default CreateSubscriptionModal;
