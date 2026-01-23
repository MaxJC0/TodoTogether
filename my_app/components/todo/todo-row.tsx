import React from "react";
import { StyleSheet, View, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/shared/themed-text";
import ButtonDrag from "@/components/buttons/button-drag";

export type TodoRowProps = {
  id: string;
  title: string;
  done?: boolean;
  dueAt?: number;
  onToggleDone?: (id: string, next: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDrag?: (id: string) => void;
};

export default function TodoRow({
  id,
  title,
  done = false,
  onToggleDone = () => { },
  onEdit = () => { },
  onDelete = () => { },
  onDrag = () => { },
  dueAt,
}: TodoRowProps) {
  const dueLabel = (() => {
    if (!dueAt) return "";
    const d = new Date(dueAt);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  })();
  return (
    <View style={[styles.row, done && styles.rowDone]}>
      {/* Left: checkbox + title */}
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: done }}
        onPress={() => onToggleDone(id, !done)}
        style={styles.left}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name={done ? "checkmark-circle" : "ellipse-outline"}
          size={22}
          color={done ? "#10b981" : "#9aa0a6"}
          style={{ marginRight: 10 }}
        />
        <View style={{ flexShrink: 1 }}>
          {!!dueLabel && (
            <ThemedText style={styles.meta} numberOfLines={1}>
              {dueLabel}
            </ThemedText>
          )}
          <ThemedText style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
            {title}
          </ThemedText>
        </View>
      </Pressable>

      {/* Right: actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`edit-todo-${id}`}
          onPress={() => onEdit(id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.iconButton}
        >
          <Ionicons name="create-outline" size={22} color="#9aa0a6" />
        </TouchableOpacity>

        <ButtonDrag
          accessibilityLabel={`drag-todo-${id}`}
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
    backgroundColor: "rgba(21, 23, 24, 1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2d2f",
    marginVertical: 6,
  },
  rowDone: {
    opacity: 0.85,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  title: {
    flexShrink: 1,
  },
  meta: {
    fontSize: 11,
    opacity: 0.7,
    marginBottom: 2,
  },
  titleDone: {
    textDecorationLine: "line-through",
    opacity: 0.65,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
