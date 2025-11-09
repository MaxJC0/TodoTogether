import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { ThemedText } from "@/components/themed-text";
import ButtonPlus from "@/components/button-add-board";
import BoardRow from "@/components/board-row";
import EditBoardModal from "@/app/modals/board-edit-modal";

export type Board = {
  id: string;
  name: string;
  members?: string[];
  notificationsEnabled?: boolean;
  color?: string;
};

type Props = {
  boards: Board[];
  setBoards: React.Dispatch<React.SetStateAction<Board[]>>;
  searchQuery: string;
};

export default function BoardList({ boards, setBoards, searchQuery }: Props) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const editingBoard = useMemo(
    () => boards.find((b) => b.id === editingBoardId) ?? null,
    [boards, editingBoardId]
  );
  const filteredBoards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return boards;
    return boards.filter((b) => b.name.toLowerCase().includes(q));
  }, [boards, searchQuery]);

  const favs = useMemo(
    () => filteredBoards.filter((b) => !!favorites[b.id]),
    [filteredBoards, favorites]
  );
  const others = useMemo(
    () => filteredBoards.filter((b) => !favorites[b.id]),
    [filteredBoards, favorites]
  );
  const combinedData = useMemo(() => [...favs, ...others], [favs, others]);

  const MemoRow = memo(BoardRow);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const startEdit = useCallback((id: string) => {
    setEditingBoardId(id);
    setIsCreating(false);
  }, []);

  const startCreate = useCallback(() => {
    setIsCreating(true);
    setEditingBoardId(null);
  }, []);

  const handleSave = useCallback(
    (data: { name: string; members: string[]; notifications: boolean; color?: string }) => {
      if (isCreating) {
        const newBoard: Board = {
          id: String(Date.now()),
          name: data.name,
          members: data.members,
          notificationsEnabled: data.notifications,
          color: data.color,
        };
        setBoards((prev) => [...prev, newBoard]);
        setIsCreating(false);
        return;
      }
      if (editingBoardId) {
        setBoards((prev) =>
          prev.map((b) =>
            b.id === editingBoardId
              ? {
                  ...b,
                  name: data.name,
                  members: data.members,
                  notificationsEnabled: data.notifications,
                  ...(data.color ? { color: data.color } : {}),
                }
              : b
          )
        );
        setEditingBoardId(null);
      }
    },
    [isCreating, editingBoardId, setBoards]
  );

  const cancelEdit = useCallback(() => {
    setEditingBoardId(null);
    setIsCreating(false);
  }, []);

  const renderItem = useCallback(
    ({ item, index, drag }: { item: Board; index: number; drag: () => void }) => {
      const shouldShowFavHeader = index === 0 && favs.length > 0;
      const shouldShowAllHeader = index === favs.length && others.length > 0;
      return (
        <View>
          {shouldShowFavHeader && (
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionHeaderText}>Favorites</ThemedText>
            </View>
          )}
          {shouldShowAllHeader && (
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionHeaderText}>All boards</ThemedText>
            </View>
          )}

          <MemoRow
            id={item.id}
            name={item.name}
            color={item.color}
            isFavorite={!!favorites[item.id]}
            onToggleFavorite={toggleFavorite}
            onEdit={startEdit}
            onDrag={() => drag()}
          />
        </View>
      );
    },
    [favs.length, others.length, favorites, toggleFavorite]
  );

  // Removed separators to avoid re-layout jank during drag

  // Track drag metadata to allow cross-section favorite toggling
  const dragMetaRef = useRef<{ favCount: number; id: string } | null>(null);

  const onDragBegin = useCallback(
    (index: number) => {
      const item = combinedData[index];
      dragMetaRef.current = { favCount: favs.length, id: item?.id ?? "" };
    },
    [combinedData, favs.length]
  );

  const onDragEnd = useCallback(
    ({ data, from, to }: { data: Board[]; from: number; to: number }) => {
      if (searchQuery.trim().length > 0) return;
      const meta = dragMetaRef.current;
      let newFavsMap = favorites;
      if (meta && meta.id) {
        const wasFav = !!favorites[meta.id];
        if (to < meta.favCount) {
          if (!wasFav) newFavsMap = { ...favorites, [meta.id]: true };
        } else {
          if (wasFav) {
            const { [meta.id]: _, ...rest } = favorites;
            newFavsMap = rest;
          }
        }
      }
      const orderedFavs = data.filter((b) => !!newFavsMap[b.id]);
      const orderedOthers = data.filter((b) => !newFavsMap[b.id]);
      setFavorites(newFavsMap);
      setBoards([...orderedFavs, ...orderedOthers]);
      dragMetaRef.current = null;
    },
    [favorites, searchQuery, setBoards]
  );

  // When favorites change via heart toggle, regroup boards to keep favorites first
  useEffect(() => {
    const orderedFavs = boards.filter((b) => !!favorites[b.id]);
    const orderedOthers = boards.filter((b) => !favorites[b.id]);
    const next = [...orderedFavs, ...orderedOthers];
    const same = next.length === boards.length && next.every((b, i) => b.id === boards[i].id);
    if (!same) setBoards(next);
  }, [favorites]);

  return (
    <>
      <DraggableFlatList
        data={combinedData}
        keyExtractor={(item: Board) => item.id}
        renderItem={renderItem as any}
        style={styles.list}
        containerStyle={{ flex: 1}}
        contentContainerStyle={styles.listContent}
        onDragBegin={onDragBegin}
        onDragEnd={onDragEnd}
        activationDistance={12}
        showsVerticalScrollIndicator={true}
        ListFooterComponent={
          <View style={styles.footer}>
            <ButtonPlus onPress={startCreate} />
          </View>
        }
      />

      <EditBoardModal
        visible={isCreating || !!editingBoardId}
        initialName={isCreating ? "" : editingBoard?.name ?? ""}
        initialMembers={isCreating ? [] : editingBoard?.members ?? []}
        initialNotifications={isCreating ? true : editingBoard?.notificationsEnabled ?? true}
        boardId={isCreating ? undefined : editingBoard?.id}
        initialColor={isCreating ? undefined : editingBoard?.color ?? undefined}
        onSave={handleSave}
        onDelete={isCreating ? undefined : (id) => {
          setBoards((prev) => prev.filter((b) => b.id !== id));
          setFavorites((prev) => {
            const { [id]: _, ...rest } = prev;
            return rest;
          });
          cancelEdit();
        }}
        onCancel={cancelEdit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 54,
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
    alignItems: "center",
    paddingVertical: 12,
  },
});
