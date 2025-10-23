import React, { JSX, useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import BoardRow from "@/components/board-row";

export default function TestScreen() {
  const [priority, setPriority] = useState<string | null>("medium");

  // dummy data for now
  const [boards] = useState([
    { id: "1", name: "Board Alpha" },
    { id: "2", name: "Board Beta" },
    { id: "3", name: "Board Gamma" },
  ]);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    return (
      <BoardRow
        id={item.id}
        name={item.name}
        isFavorite={!!favorites[item.id]}
        onToggleFavorite={toggleFavorite}
        onEdit={(id) => {
          /* placeholder for edit action */
        }}
        onDrag={(id) => {
          /* placeholder for drag/reorder action */
        }}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Boards</ThemedText>

      <FlatList
        
        data={boards}
        keyExtractor={(b) => b.id}
        renderItem={renderItem}
        style={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  list: {
    width: "100%",
  },
});