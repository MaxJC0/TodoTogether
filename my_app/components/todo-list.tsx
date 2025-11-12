import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import TodoRow from "@/components/todo-row";
import ButtonPlus from "./buttons/button-add-board";
import ButtonDeleteFinishedTodo from "./buttons/button-delete-finished-todo";
import TodoEditModal from "@/app/(modal)/todo-edit-modal";

export type TodoListProps = {
  initialTitle: string;
};

export default function TodoList({ initialTitle }: TodoListProps) {
  type Item = { id: string; title: string; done: boolean };
  const [items, setItems] = useState<Item[]>([
    { id: "example-1", title: "Example task", done: false },
    { id: "example-2", title: "Example task", done: true },
  ]);

  const hasCompleted = useMemo(() => items.some((i) => i.done), [items]);

  const toggleDone = (id: string, next: boolean) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, done: next } : it))
    );
  };

  const deleteCompleted = () => {
    if (!hasCompleted) return;
    setItems((prev) => prev.filter((it) => !it.done));
  };

  // Modal state for create/edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialModalName, setInitialModalName] = useState("");

  const openCreate = () => {
    setEditingId(null);
    setInitialModalName("");
    setModalVisible(true);
  };
  const openEdit = (id: string) => {
    const found = items.find((it) => it.id === id);
    setEditingId(id);
    setInitialModalName(found?.title ?? "");
    setModalVisible(true);
  };
  const handleSaveModal = (name: string) => {
    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...it, title: name } : it))
      );
    } else {
      const newItem: Item = {
        id: Date.now().toString(),
        title: name,
        done: false,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalVisible(false);
  };
  const handleCancelModal = () => setModalVisible(false);
  const renderItem = useCallback(
    ({ item, drag }: { item: Item; index: number; drag: () => void }) => (
      <TodoRow
        id={item.id}
        title={item.title}
        done={item.done}
        onToggleDone={toggleDone}
        onEdit={openEdit}
        onDrag={() => drag()}
      />
    ),
    [toggleDone]
  );

  const onDragEnd = useCallback(({ data }: { data: Item[] }) => {
    setItems(data);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {initialTitle}
        </ThemedText>
      </View>
      <View style={styles.body}>
        <DraggableFlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem as any}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onDragEnd={onDragEnd}
          activationDistance={12}
          showsVerticalScrollIndicator={true}
          ListEmptyComponent={
            <ThemedText style={{ opacity: 0.8 }}>
                No tasks yet
            </ThemedText>
          }
        />
      </View>
      <View style={styles.footer}>
        <ButtonPlus onPress={openCreate} />
        <ButtonDeleteFinishedTodo
          disabled={!hasCompleted}
          onPress={deleteCompleted}
          label="Delete completed tasks"
        />
      </View>

      {/* Create/Edit modal */}
      <TodoEditModal
        visible={modalVisible}
        initialName={initialModalName}
        onSave={handleSaveModal}
        onCancel={handleCancelModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  listContent: {
    paddingVertical: 4,
  },
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
