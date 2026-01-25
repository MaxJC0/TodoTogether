import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/shared/themed-view";
import PagerView from "react-native-pager-view";
import TodoList from "@/components/todo/todo-list";
import ButtonPlus from "@/components/buttons/button-add-board";
import ButtonDelete from "@/components/buttons/button-delete-finished-todo";

/**
 * Screen component for displaying a board with multiple todo lists.
 * Users can add new todo lists dynamically.
 */
export default function BoardScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const initialTitle =
    typeof name === "string" && name.length > 0 ? name : `Board ${id}`;

  const [lists, setLists] = useState([0]);
  const [currentPage, setCurrentPage] = useState(0);

  const pagerRef = useRef<PagerView>(null);

  useEffect(() => {
    if (lists.length > 1) {
      const newIndex = lists.length - 1;

      setTimeout(() => {
        pagerRef.current?.setPage(newIndex);
        setCurrentPage(newIndex);
      }, 50);
    }
  }, [lists.length]);

  return (
    <>
      <Stack.Screen
        options={{
          title: initialTitle,
          headerShown: true,
        }}
      />

      <ThemedView style={styles.container}>
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {lists.map((listId) => (
            <View key={`list-${listId}`} style={{ flex: 1 }}>
              <TodoList initialTitle={`${initialTitle} - List ${listId + 1}`} />
            </View>
          ))}
        </PagerView>

        <View style={styles.indicatorContainer}>
          {lists.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.indicatorDot,
                currentPage === index && styles.indicatorDotActive,
              ]}
            />
          ))}
        </View>
      </ThemedView>

      <ButtonPlus
        onPress={() => {
          setLists((prev) => [...prev, prev.length]);
        }}
        label="Add TodoList"
        style={{ position: "absolute", bottom: 24, right: 24 }}
      />

      <ButtonDelete
        onPress={() => {
          setLists((prev) => {
            if (prev.length <= 1) return prev;
            const newLists = prev.slice(0, -1);
            if (currentPage >= newLists.length) {
              setCurrentPage(newLists.length - 1);
              pagerRef.current?.setPage(newLists.length - 1);
            }
            return newLists;
          });
        }}
        label="Delete TodoList"
        style={{ position: "absolute", bottom: 24, left: 24 }}
        disabled={lists.length <= 1}
      />

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 22,
    paddingBottom: 40,
    backgroundColor: "rgba(21, 23, 24, 1)",
    gap: 8,
  },

  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "gray",
    opacity: 0.4,
  },

  indicatorDotActive: {
    backgroundColor: "white",
    opacity: 1,
  },
});
