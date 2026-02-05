import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { boardsApi } from "@/lib/api/boards";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/shared/themed-text";
import { ThemedView } from "@/components/shared/themed-view";
import BoardList from "@/components/boards/board-list";
import InputSearchBar from "@/components/inputs/input-searchbar";

type Board = { id: string; name: string };

export default function TestScreen() {
  useEffect(() => {
    boardsApi.getBoards()
      .then(data => {
        console.log("Boards:", data);
      })
      .catch(err => {
        console.log("API error:", err);
      });
  }, []);

  const [boards, setBoards] = useState<Board[]>([
    { id: "1", name: "Board Alpha" },
    { id: "2", name: "Board Beta" },
    { id: "3", name: "Board Gamma" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={{ flex: 1 }}
      >
        <ThemedView style={[styles.container, { paddingBottom: insets.bottom + 64 }]}>
          <ThemedText type="title" style={styles.title}>
            Your Boards
          </ThemedText>

          <View style={styles.listContainer}>
            <BoardList
              boards={boards}
              setBoards={setBoards}
              searchQuery={searchQuery}
            />
          </View>

          <InputSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search boards..."
          />
        </ThemedView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    paddingHorizontal: 24,
    paddingTop: 26
  },
  title: {
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    minHeight: 0,
  },
});
