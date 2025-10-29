import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import BoardList from "@/components/board-list";

type Board = { id: string; name: string };

export default function TestScreen() {
  const [boards, setBoards] = useState<Board[]>([
    { id: "1", name: "Board Alpha" },
    { id: "2", name: "Board Beta" },
    { id: "3", name: "Board Gamma" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  return (
  <GestureHandlerRootView style={{ flex: 1 }}>
  <ThemedView style={styles.container}>
  <ThemedText type="title" style={styles.title}>Your Boards</ThemedText>

      {/* Use the FlatList inside BoardList as the primary scroll container */}
      <View style={styles.listContainer}>
        <BoardList
          boards={boards}
          setBoards={setBoards}
          searchQuery={searchQuery}
        />
      </View>

      {/* Persistent bottom search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search boards..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          placeholderTextColor="#aaa"
        />
      </View>
    </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  title: {
    marginBottom: 8,

  },
  listContainer: {
    flex: 1,
    width: "100%",
  },
  searchInput: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  searchContainer: {
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
  }
});