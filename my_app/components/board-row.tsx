import React from "react";
import { ThemedText } from "@/components/themed-text";
import { StyleSheet, View } from "react-native";
import ButtonFavorite from "@/components/button-favorite";
import ButtonEditBoard from "@/components/button-edit_board";
import ButtonDrag from "@/components/button-drag";

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
        <ButtonFavorite
          accessibilityLabel={`favorite-${id}`}
          isFavorite={isFavorite}
          onPress={() => onToggleFavorite(id)}
        />
        <ButtonEditBoard
          accessibilityLabel={`edit-${id}`}
          onPress={() => onEdit(id)}
        />
        <ButtonDrag
          accessibilityLabel={`drag-${id}`}
          onLongPress={() => onDrag(id)}
        />
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
  boardName: {
    flex: 1,
    marginRight: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});