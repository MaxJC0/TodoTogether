import React, { useMemo, useState, memo } from "react";
import { StyleSheet, View, SectionList, TextInput } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TodoRow from "@/components/todo-row";
import ButtonPlus from "@/components/button-plus";
import ButtonDelete from "@/components/button-delete";

type Board = { id: string; name: string };

export default function TestScreen() {
  const [boards, setBoards] = useState<Board[]>([
    { id: "1", name: "Board Alpha" },
    { id: "2", name: "Board Beta" },
    { id: "3", name: "Board Gamma" },
  ]);

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const createBoard = () => {
    // dummy create: append a new row
    const n = boards.length + 1;
    setBoards((prev) => [...prev, { id: String(Date.now()), name: `Board ${n}` }]);
  };

  const deleteMarked = () => {
    setBoards((prev) => prev.filter((b) => !selected[b.id]));
    setSelected((prev) => {
      const next: Record<string, boolean> = {};
      return next;
    });
  };

  const hasSelected = Object.values(selected).some(Boolean);

  const filteredBoards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((b) => b.name.toLowerCase().includes(q));
  }, [boards, searchQuery]);

  const sections = useMemo(() => {
    const favs = filteredBoards.filter((b) => !!favorites[b.id]);
    const others = filteredBoards.filter((b) => !favorites[b.id]);
    return [
      { key: "favorites", title: "Favorites", data: favs },
      { key: "all", title: "All boards", data: others },
    ];
  }, [filteredBoards, favorites]);

  const renderItem = ({ item }: { item: Board }) => (
    <TodoRow
      key={item.id}
      id={item.id}
      name={item.name}
      isFavorite={!!favorites[item.id]}
      selected={!!selected[item.id]}
      onToggleSelect={toggleSelect}
      onToggleFavorite={toggleFavorite}
      onEdit={() => {}}
      onDrag={() => {}}
    />
  );

  const Separator = memo(() => <View style={styles.separator} />);
  const SectionHeader = ({ title, count }: { title: string; count: number }) => {
    if (count === 0) return null;
    return (
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionHeaderText}>{title}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Your Boards</ThemedText>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <SectionHeader title={section.title as string} count={(section.data as Board[]).length} />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <View key="list-footer" style={styles.footerButtons}>
            <ButtonPlus onPress={createBoard} />
            <ButtonDelete onPress={deleteMarked} disabled={!hasSelected} />
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Persistent bottom search bar */}
      <View style={styles.bottomBar}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search boards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            placeholderTextColor="#aaa"
          />
        </View>
      </View>
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
  listContent: {
    paddingVertical: 8,
    paddingBottom: 100, // ensure content isn't hidden behind bottom bar
  },
  separator: {
    height: 1,
    backgroundColor: "#ffffff",
    width: "100%",
    marginVertical: 8,
  },
  sectionHeader: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  sectionHeaderText: {
    fontWeight: "600",
    opacity: 0.8,
  },
  footer: {
    marginTop: 16,
  },
  footerButtons: {
    gap: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  searchContainer: {
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
  bottomBar: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
});