import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  name: string;
  isFavorite?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDrag?: (id: string) => void;
};

export default function BoardRow({
  id,
  name,
  isFavorite = false,
  onToggleSelect = () => {},
  onToggleFavorite = () => {},
  onEdit = () => {},
  onDrag = () => {},
}: Props) {
  return (
    <View style={styles.row}>
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
          onLongPress={() => onDrag(id)}
          delayLongPress={150}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 6,
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