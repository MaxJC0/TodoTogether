import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ButtonPlusProps = {
  onPress: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A circular button with a plus icon, typically used for creating new items.
 * Calls onPress when tapped.
 * Accepts an optional label for accessibility and custom styles.
 */
export default function ButtonPlus({ onPress, label = "Create", style }: ButtonPlusProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[styles.btn, styles.primary, style]}
    >
      <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 28,
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false as any,
  },
});

