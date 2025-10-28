import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/themed-text";

type Props = {
  onLongPress: () => void;
  accessibilityLabel?: string;
  delayLongPress?: number;
};

export default function ButtonDrag({
  onLongPress,
  accessibilityLabel,
  delayLongPress = 150,
}: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onLongPress={onLongPress}
      delayLongPress={delayLongPress}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={styles.iconButton}
    >
      <ThemedText>☰</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 6,
  },
});