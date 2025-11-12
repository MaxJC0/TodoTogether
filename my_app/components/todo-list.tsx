import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import TodoRow from "@/components/todo-row";

export type TodoListProps = {
  initialTitle: string;
};

export default function TodoList({ initialTitle }: TodoListProps) {
  const [exampleDone, setExampleDone] = useState(false);
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {initialTitle}
        </ThemedText>
      </View>
      <View style={styles.body}>
        {/* Example row */}
        <TodoRow
          id="example-1"
          title="Example task"
          done={exampleDone}
          onToggleDone={(_, next) => setExampleDone(next)}
          onEdit={() => {}}
          onDrag={() => {}}
        />
        <TodoRow
          id="example-2"
          title="Example task"
          done={exampleDone}
          onToggleDone={(_, next) => setExampleDone(next)}
          onEdit={() => {}}
          onDrag={() => {}}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(21, 23, 24, 1)",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  title: {
    marginBottom: 0,
    fontSize: 20,
  },
  body: {
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
});
