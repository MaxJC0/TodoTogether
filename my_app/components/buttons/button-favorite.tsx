import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isFavorite: boolean;
  onPress: () => void;
  accessibilityLabel?: string;
};

/**
 * Button that toggles the favorite status of an item.
 * Displays a filled heart icon if isFavorite is true, otherwise an outlined heart.
 * Calls onPress when tapped.
 */
export default function ButtonFavorite({ isFavorite, onPress, accessibilityLabel }: Props) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.iconButton}
    >
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={24}
        color={isFavorite ? "#ff4d4d" : "#9aa0a6"}
      />
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
