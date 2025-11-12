import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TodoList from "@/components/todo-list";

export default function BoardScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const initialTitle = (typeof name === 'string' && name.length > 0) ? name : `Board ${id}`;

  return (
    <>
      <Stack.Screen
        options={{
          title: initialTitle,
          headerShown: true,
        }}
      />
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <TodoList initialTitle={initialTitle} />
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
});
