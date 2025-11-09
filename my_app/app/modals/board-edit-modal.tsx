import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import DropdownBoardMembers from "@/components/dropdown-board_members";
import ToggleNotification from "@/components/toggle-notification";
import ButtonSaveBoard, { ButtonSaveBoardHandle } from "@/components/button-save-board";
import ButtonDeleteBoard from "@/components/button-delete-board";
import { useRef } from "react";
import InputName from "@/components/input-name";

type Props = {
  visible: boolean;
  initialName: string;
  initialMembers: string[];
  initialNotifications?: boolean;
  boardId?: string;
  onSave: (data: { name: string; members: string[]; notifications: boolean }) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
};

export default function EditBoardModal({
  visible,
  initialName,
  initialMembers,
  initialNotifications = true,
  boardId,
  onSave,
  onDelete,
  onCancel,
}: Props) {
  const saveBtnRef = useRef<ButtonSaveBoardHandle | null>(null);
  const [name, setName] = useState(initialName);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setSelectedPeople(initialMembers ?? []);
      setNotificationsEnabled(initialNotifications ?? true);
    }
  }, [visible, initialName, initialMembers, initialNotifications]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.modalOverlay} onPress={onCancel}>
        <Pressable style={{ width: "100%", height: "100%" }} onPress={() => {}}>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
            style={styles.modalCenter}
          >
            <View style={styles.modalCard}>
              <View style={styles.modalBody}>
                <ThemedText type="title" style={styles.modalTitle}>
                  Edit board
                </ThemedText>

                <View style={styles.section}>
                  <ThemedText style={styles.sectionLabel}>Name</ThemedText>
                  <InputName
                    value={name}
                    onChangeText={(text) => setName(text.slice(0, 40))}
                    placeholder="Board name"
                    autoFocus
                    maxLength={50}
                    onSubmitEditing={() => saveBtnRef.current?.submit()}
                  />
                </View>

                {/* People selector */}
                <View style={styles.section}>
                  <DropdownBoardMembers selected={selectedPeople} onChange={setSelectedPeople} />
                </View>

                {/* Notifications toggle */}
                <View style={styles.section}>
                  <ToggleNotification
                    value={notificationsEnabled}
                    onChange={setNotificationsEnabled}
                  />
                </View>
              </View>

              <View style={styles.modalActions}>
                <View style={styles.leftActions}>
                  {boardId && onDelete && (
                    <ButtonDeleteBoard
                      boardId={boardId}
                      boardName={initialName}
                      onDelete={(id) => {
                        onDelete(id);
                        onCancel();
                      }}
                      label="Delete"
                    />
                  )}
                </View>
                <View style={styles.rightActions}>
                  <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.btnSecondary]}>
                    <ThemedText>Cancel</ThemedText>
                  </TouchableOpacity>
                  <ButtonSaveBoard
                    ref={saveBtnRef}
                    name={name}
                    members={selectedPeople}
                    notifications={notificationsEnabled}
                    onSave={({ name, members, notifications }) =>
                      onSave({ name, members, notifications })
                    }
                  />
                </View>
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
    paddingHorizontal: 44,
  },
  modalCenter: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: "120%",
    height: "80%",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "rgba(30,30,30,0.98)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
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
    justifyContent: "space-between",
  },
  leftActions: {
    flexDirection: "row",
    gap: 8,
    flex: 1,
  },
  rightActions: {
    flexDirection: "row",
    gap: 10,
    alignItems: 'center'
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
});