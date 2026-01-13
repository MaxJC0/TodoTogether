import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  type RepeatRule = {
    cycle: "day" | "week" | "biweek" | "month" | "year";
    time: string; // HH:mm 24h
    dayOfWeek?: number; // 0-6 (Sun-Sat) for week/biweek
    dayOfMonth?: number; // 1-31 for month
    month?: number; // 0-11 for year
  };
  type Item = {
    id: string;
    title: string;
    done: boolean;
    dueAt?: number; // epoch ms for one-time due or next repeat occurrence
    repeat?: RepeatRule; // if present, item is recurring and dueAt is next occurrence
  };
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

  // Helper to compute next occurrence from a rule given a base date
  const parseTime = (hhmm: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm?.trim() || "");
    const hh = Math.min(23, Math.max(0, parseInt(m?.[1] || "0", 10)));
    const mm = Math.min(59, Math.max(0, parseInt(m?.[2] || "0", 10)));
    return { hh, mm };
  };
  const addDays = (d: Date, days: number) => {
    const nd = new Date(d.getTime());
    nd.setDate(nd.getDate() + days);
    return nd;
  };
  const nextOccurrence = (rule: RepeatRule, from: Date = new Date()): number => {
    const { hh, mm } = parseTime(rule.time || "09:00");
    const base = new Date(from.getTime());
    base.setSeconds(0, 0);
    const candidate = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm, 0, 0);

    if (rule.cycle === "day") {
      if (candidate.getTime() <= base.getTime()) return addDays(candidate, 1).getTime();
      return candidate.getTime();
    }

    if (rule.cycle === "week" || rule.cycle === "biweek") {
      const targetDow = (rule.dayOfWeek ?? 1) % 7; // default Mon
      const currentDow = base.getDay();
      let delta = (targetDow - currentDow + 7) % 7;
      if (delta === 0 && candidate.getTime() <= base.getTime()) delta = 7;
      if (rule.cycle === "biweek") {
        // If it's exactly 7 days ahead, extend to 14 if today passed
        if (delta === 0) return addDays(candidate, 14).getTime();
        const first = addDays(candidate, delta);
        if (first.getTime() <= base.getTime()) return addDays(first, 14).getTime();
        return first.getTime();
      }
      return addDays(candidate, delta).getTime();
    }

    if (rule.cycle === "month") {
      const dom = Math.min(Math.max(1, rule.dayOfMonth ?? 1), 31);
      const attempt = new Date(base.getFullYear(), base.getMonth(), dom, hh, mm, 0, 0);
      if (attempt.getTime() <= base.getTime()) {
        // next month
        const next = new Date(base.getFullYear(), base.getMonth() + 1, dom, hh, mm, 0, 0);
        return next.getTime();
      }
      return attempt.getTime();
    }

    // year
    const month = Math.min(Math.max(0, rule.month ?? 0), 11);
    const dom = Math.min(Math.max(1, rule.dayOfMonth ?? 1), 31);
    const attempt = new Date(base.getFullYear(), month, dom, hh, mm, 0, 0);
    if (attempt.getTime() <= base.getTime()) {
      const next = new Date(base.getFullYear() + 1, month, dom, hh, mm, 0, 0);
      return next.getTime();
    }
    return attempt.getTime();
  };

  const deleteCompleted = () => {
    if (!hasCompleted) return;
    setItems((prev) =>
      prev.flatMap((it) => {
        if (!it.done) return [it];
        if (it.repeat) {
          // reschedule: hide until next due
          const dueAt = nextOccurrence(it.repeat, new Date());
          return [{ ...it, done: false, dueAt }];
        }
        return [];
      })
    );
  };

  // Modal state for create/edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [initialModalName, setInitialModalName] = useState("");
  const [initialSchedule, setInitialSchedule] = useState<
    | { dueAt?: number; repeat?: RepeatRule }
    | undefined
  >(undefined);

  const openCreate = () => {
    setEditingId(null);
    setInitialModalName("");
    setInitialSchedule(undefined);
    setModalVisible(true);
  };
  const openEdit = (id: string) => {
    const found = items.find((it) => it.id === id);
    setEditingId(id);
    setInitialModalName(found?.title ?? "");
    setInitialSchedule(found ? { dueAt: found.dueAt, repeat: found.repeat } : undefined);
    setModalVisible(true);
  };
  const handleSaveModal = (payload: { name: string; schedule?: { dueAt?: number; repeat?: RepeatRule } }) => {
    const { name, schedule } = payload;
    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? {
                ...it,
                title: name,
                dueAt: schedule?.dueAt ?? it.dueAt,
                repeat: schedule?.repeat ?? it.repeat,
              }
            : it
        )
      );
    } else {
      let dueAt = schedule?.dueAt;
      if (!dueAt && schedule?.repeat) {
        dueAt = nextOccurrence(schedule.repeat, new Date());
      }
      const newItem: Item = {
        id: Date.now().toString(),
        title: name,
        done: false,
        dueAt,
        repeat: schedule?.repeat,
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
        dueAt={item.dueAt}
        onToggleDone={toggleDone}
        onEdit={openEdit}
        onDrag={() => drag()}
      />
    ),
    [toggleDone]
  );

  const onDragEnd = useCallback(({ data }: { data: Item[] }) => {
    // 'data' contains only visible (draggable) items in new order. Merge back with hidden items.
    setItems((prev) => {
      const now = Date.now();
      const prevVisibleIds = new Set(
        prev
          .filter((it) => {
            if (!it.repeat) return true;
            if (!it.dueAt) return true;
            return it.dueAt <= now;
          })
          .map((it) => it.id)
      );
      let vi = 0;
      const merged: Item[] = [];
      for (const it of prev) {
        if (prevVisibleIds.has(it.id)) {
          merged.push(data[vi++]);
        } else {
          merged.push(it);
        }
      }
      return merged;
    });
  }, []);

  // Re-render tick to surface recurring items when due time passes
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 60000); // 1 minute
    return () => clearInterval(t);
  }, []);

  const visibleItems = useMemo(() => {
    const now = Date.now();
    return items.filter((it) => {
      if (!it.repeat) return true; // only hide recurring until due
      if (!it.dueAt) return true;
      return it.dueAt <= now;
    });
  }, [items, tick]);

  const formatDue = (ts?: number) => {
    if (!ts) return "";
    const d = new Date(ts);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          {initialTitle}
        </ThemedText>
      </View>
      <View style={styles.body}>
        <DraggableFlatList
          data={visibleItems}
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
        initialSchedule={initialSchedule}
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
