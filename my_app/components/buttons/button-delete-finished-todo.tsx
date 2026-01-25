import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ButtonDeleteFinishedTodoProps = {
  onPress?: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

/**
 * A circular button with a trash icon, used to delete finished todos.
 * Calls onPress when tapped, unless disabled.
 * Accepts an optional label for accessibility and custom styles.
 */
export default function ButtonDeleteFinishedTodo({
  onPress,
  label = "Delete done",
  style,
  disabled = false,
}: ButtonDeleteFinishedTodoProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[styles.btn, styles.primary, disabled && styles.disabled, style]}
    >
      <Ionicons name="trash-outline" size={24} color="#ef4444" />
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
  disabled: {
    opacity: 0.5,
  },
});
