import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { ThemedText } from "@/components/themed-text";
import InputName from "@/components/input-name";
import DropdownTodoCategory from "@/components/dropdown-todo-category";

export type TodoEditModalProps = {
  visible: boolean;
  initialName?: string;
  // Category not passed out yet; UI only per request
  onSave: (name: string) => void;
  onCancel: () => void;
};

export default function TodoEditModal({ visible, initialName = "", onSave, onCancel }: TodoEditModalProps) {
  const [name, setName] = useState(initialName);
  const CATEGORIES = ["General", "Work", "Personal", "Errand", "Idea", "Urgent"] as const;
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [{ screenW, screenH }, setScreen] = useState(() => {
    const { width, height } = Dimensions.get("screen");
    return { screenW: width, screenH: height };
  });

  useEffect(() => {
    if (visible) {
      setName(initialName ?? "");
      setCategory(CATEGORIES[0]);
    }
  }, [visible, initialName]);

  const handleSave = () => {
    const trimmed = name.trim();
    onSave(trimmed.length > 0 ? trimmed : "Untitled todo");
  };

  // Keep modal sized to full screen dimensions (not window), so it doesn't shrink when keyboard opens
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ screen }) => {
      setScreen({ screenW: screen.width, screenH: screen.height });
    });
    return () => {
      sub?.remove?.();
    };
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={[styles.modalOverlay, { width: screenW, height: screenH }]}
        onPress={onCancel}
      >
        <Pressable style={{ width: "100%", height: "100%" }} onPress={() => {}}>
          <View style={styles.modalCard}>
            <View style={styles.modalBody}>
              <ThemedText type="title" style={styles.modalTitle}>
                {initialName ? "Edit todo" : "New todo"}
              </ThemedText>

              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Name</ThemedText>
                <InputName
                  value={name}
                  onChangeText={(text) => setName(text.slice(0, 80))}
                  placeholder="Todo name"
                  autoFocus
                  maxLength={100}
                  onSubmitEditing={handleSave}
                />
              </View>

              <View style={styles.section}>
                <DropdownTodoCategory 
                  selected={category} 
                  onChange={setCategory} />
              </View>
            </View>

            <View style={styles.modalActions}>
              <View style={styles.rightActions}>
                <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.btnSecondary]}>
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={[styles.btn, styles.btnPrimary]}>
                  <ThemedText>Save</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 34,
  },
  modalCard: {
    width: "100%",
    height: "70%",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(30,30,30,0.98)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  modalBody: {
    flex: 1,
  },
  modalTitle: {
    marginBottom: 10,
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    marginBottom: 8,
    opacity: 0.9,
  },
  modalActions: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  rightActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  btn: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  btnPrimary: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.32)",
  },
});
