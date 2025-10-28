import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";

type Props = {
  visible: boolean;
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
};

export default function EditBoardModal({ visible, initialName, onSave, onCancel }: Props) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={{ width: "100%" }} onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
            style={styles.modalCenter}
          >
            <View style={styles.modalCard}>
              <ThemedText type="title" style={styles.modalTitle}>
                Edit board
              </ThemedText>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Board name"
                placeholderTextColor="#aaa"
                autoFocus
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={save}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.btnSecondary]}>
                  <ThemedText>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={save}
                  style={[styles.btn, styles.btnPrimary]}
                  disabled={!name.trim()}
                >
                  <ThemedText>Save</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCenter: {
    width: "100%",
  },
  modalCard: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(30,30,30,0.98)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  modalTitle: {
    marginBottom: 10,
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  modalActions: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btn: {
    minWidth: 88,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondary: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  btnPrimary: {
    backgroundColor: "#3b82f6",
  },
});