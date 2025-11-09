import React, { useState } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import BoardList from "@/components/board-list";
import InputSearchBar from "@/components/input-searchbar";

type Board = { id: string; name: string };

export default function TestScreen() {
  const [boards, setBoards] = useState<Board[]>([
    { id: "1", name: "Board Alpha" },
    { id: "2", name: "Board Beta" },
    { id: "3", name: "Board Gamma" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: "height" })}
        keyboardVerticalOffset={insets.top}
      >
        <ThemedView style={styles.container}>
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
      </KeyboardAvoidingView>
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