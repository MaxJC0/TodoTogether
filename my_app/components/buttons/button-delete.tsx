import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "@/components/shared/themed-text";

type Board = { id: string; name: string };
type SelectedMap = Record<string, boolean>;

type ButtonDeleteProps = {
  selected: SelectedMap;
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  setSelected: React.Dispatch<React.SetStateAction<SelectedMap>>;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Button that deletes all selected boards.
 * Disabled if no boards are selected.
 * On press, removes selected boards from the list and clears selection.
 */
export default function ButtonDelete({
  selected,
  setBoards,
  setSelected,
  label = "Delete marked",
  style,
}: ButtonDeleteProps) {
  const hasSelected = Object.values(selected).some(Boolean);

  const handleDelete = () => {
    if (!hasSelected) return;
    setBoards((prev) => prev.filter((b) => !selected[b.id]));
    setSelected({});
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !hasSelected }}
      onPress={hasSelected ? handleDelete : undefined}
      disabled={!hasSelected}
      style={[styles.btn, styles.danger, !hasSelected && styles.disabled, style]}
    >
      <ThemedText style={styles.text}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  danger: {
    backgroundColor: "#ef4444",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: "#fff",
  },
});

