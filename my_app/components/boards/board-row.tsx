import React from "react";
import { ThemedText } from "@/components/shared/themed-text";
import { StyleSheet, View, Pressable } from "react-native";
import { router } from "expo-router";
import ButtonFavorite from "@/components/buttons/button-favorite";
import ButtonEditBoard from "@/components/buttons/button-edit-board";
import ButtonDrag from "@/components/buttons/button-drag";

type Props = {
  id: string;
  name: string;
  color?: string;
  isFavorite?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDrag?: (id: string) => void;
};

export default function BoardRow({
  id,
  name,
  color,
  isFavorite = false,
  onToggleSelect = () => { },
  onToggleFavorite = () => { },
  onEdit = () => { },
  onDrag = () => { },
}: Props) {
  // Soften the background color while preserving the border color
  const softenedBg = color ? hexToRgba(color, 0.12) : undefined;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`open-board-${id}`}
      onPress={() => router.push({ pathname: "/board/[id]", params: { id, name } })}
      style={[
        styles.row,
        color
          ? {
            backgroundColor: softenedBg,
            borderColor: "#ACABAD",
          }
          : null,
      ]}
    >
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
    </Pressable>
  );
}

// Convert common HEX formats to rgba with the given alpha.
// Falls back to the input color if parsing fails.
function hexToRgba(hex: string, alpha = 0.04): string {
  // Support already-rgba colors by replacing alpha if possible
  const rgbaMatch = hex.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i);
  if (rgbaMatch) {
    const r = clamp255(parseInt(rgbaMatch[1], 10));
    const g = clamp255(parseInt(rgbaMatch[2], 10));
    const b = clamp255(parseInt(rgbaMatch[3], 10));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (!hex || typeof hex !== "string") return hex;
  let clean = hex.trim();
  if (clean[0] === "#") clean = clean.slice(1);

  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // 8-digit hex (AARRGGBB or RRGGBBAA) appears in web but RN expects #RRGGBB/rgba — try RRGGBBAA
  if (clean.length === 8) {
    // Assume RRGGBBAA
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    const a = parseInt(clean.slice(6, 8), 16) / 255;
    const finalA = Math.min(1, Math.max(0, a * alpha));
    return `rgba(${r}, ${g}, ${b}, ${finalA})`;
  }
  return hex; // unknown format — return as-is
}

function clamp255(n: number) {
  return Math.max(0, Math.min(255, n));
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
