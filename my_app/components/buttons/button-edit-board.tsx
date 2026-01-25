import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/**
 * Button that triggers editing a board.
 * Displays an edit icon and calls onPress when tapped.
 */
export default function ButtonEditBoard({ onPress, accessibilityLabel }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.iconButton}
    >
      <Ionicons name="create-outline" size={24} color="#9aa0a6" />
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
