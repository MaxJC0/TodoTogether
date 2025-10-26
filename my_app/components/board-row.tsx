import { ThemedText } from "@/components/themed-text";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  name: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDrag?: (id: string) => void;
};

export default function BoardRow({
  id,
  name,
  isFavorite = false,
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