import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import TodoRow from "@/components/todo-row";
import ButtonPlus from "./buttons/button-add-board";
import ButtonDeleteFinishedTodo from "./buttons/button-delete-finished-todo";

export type TodoListProps = {
  initialTitle: string;
};

export default function TodoList({ initialTitle }: TodoListProps) {
  type Item = { id: string; title: string; done: boolean };
  const [items, setItems] = useState<Item[]>([
    { id: "example-1", title: "Example task", done: false },
    { id: "example-2", title: "Example task", done: true },
  ]);

  const hasCompleted = useMemo(() => items.some(i => i.done), [items]);

  const toggleDone = (id: string, next: boolean) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, done: next } : it));
  };

  const deleteCompleted = () => {
    if (!hasCompleted) return;
    setItems(prev => prev.filter(it => !it.done));
  };
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {initialTitle}
        </ThemedText>
      </View>
      <View style={styles.body}>
        {items.length === 0 ? (
          <ThemedText style={{ opacity: 0.8 }}>No tasks yet</ThemedText>
        ) : (
          items.map((it) => (
            <TodoRow
              key={it.id}
              id={it.id}
              title={it.title}
              done={it.done}
              onToggleDone={toggleDone}
              onEdit={() => {}}
              onDrag={() => {}}
            />
          ))
        )}
      </View>
      <View style={styles.footer}>
        <ButtonPlus onPress={() => {}} />
        <ButtonDeleteFinishedTodo
          disabled={!hasCompleted}
          onPress={deleteCompleted}
          label="Delete completed tasks"
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
    paddingVertical: 6,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
});
