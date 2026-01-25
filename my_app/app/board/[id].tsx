import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/components/shared/themed-view";
import PagerView from "react-native-pager-view";
import TodoList from "@/components/todo/todo-list";
import ButtonPlus from "@/components/buttons/button-add-board";

/**
 * Screen component for displaying a board with multiple todo lists.
 * Users can add new todo lists dynamically.
 */
export default function BoardScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const initialTitle =
    typeof name === "string" && name.length > 0 ? name : `Board ${id}`;

  const [lists, setLists] = useState([0]);

  return (
    <>
      <Stack.Screen
        options={{
          title: initialTitle,
          headerShown: true,
        }}
      />

      <ThemedView style={styles.container}>
        <PagerView style={{ flex: 1 }} initialPage={0}>
          {lists.map((listId) => (
            <View key={`list-${listId}`} style={{ flex: 1 }}>
              <TodoList initialTitle={`${initialTitle} - List ${listId + 1}`} />
            </View>
          ))}
        </PagerView>
      </ThemedView>

      <ButtonPlus
        onPress={() => {
          setLists((prev) => [...prev, prev.length]);
        }}
        label="Add TodoList"
        style={{ position: "absolute", bottom: 24, right: 24 }}
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
});
