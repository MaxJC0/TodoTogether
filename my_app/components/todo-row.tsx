import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "@/components/themed-text";

type Props = {
  id: string;
  name: string;
  isFavorite?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDrag?: (id: string) => void;
};

export default function BoardRow({
  id,
  name,
  isFavorite = false,
  selected = false,
  onToggleSelect = () => {},
  onToggleFavorite = () => {},
  onEdit = () => {},
  onDrag = () => {},
}: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        accessibilityLabel={`select-${id}`}
        onPress={() => onToggleSelect(id)}
        style={styles.checkbox}
      >
        <ThemedText>{selected ? "☑" : "☐"}</ThemedText>
      </TouchableOpacity>

      <ThemedText style={styles.boardName}>{name}</ThemedText>

      <View style={styles.actions}>
        <TouchableOpacity
          accessibilityLabel={`favorite-${id}`}
          onPress={() => onToggleFavorite(id)}
          style={styles.iconButton}
        >
          <ThemedText>{isFavorite ? "❤️" : "♡"}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`edit-${id}`}
          onPress={() => onEdit(id)}
          style={styles.iconButton}
        >
          <ThemedText>✏️</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={`drag-${id}`}
          onPress={() => onDrag(id)}
          style={styles.iconButton}
        >
          <ThemedText>☰</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "transparent",
    borderRadius: 6,
  },
  checkbox: {
    marginRight: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  boardName: {
    flex: 1,
    marginRight: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 6,
  },
});