import React, { useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/components/shared/themed-text";
import DropdownBoardMembers from "@/components/dropdowns/dropdown-board-members";
import ToggleNotification from "@/components/inputs/toggle-notification";
import ButtonSaveBoard, { ButtonSaveBoardHandle } from "@/components/buttons/button-save-board";
import ButtonDeleteBoard from "@/components/buttons/button-delete-board";
import InputName from "@/components/inputs/input-name";
import ColorPicker from "@/components/inputs/color-picker";

type Props = {
  visible: boolean;
  initialName: string;
  initialMembers: string[];
  initialNotifications?: boolean;
  boardId?: string;
  initialColor?: string;
  onSave: (data: { name: string; members: string[]; notifications: boolean; color?: string }) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
};

export default function EditBoardModal({
  visible,
  initialName,
  initialMembers,
  initialNotifications = true,
  boardId,
  initialColor = 'rgba(21, 23, 24, 1)',
  onSave,
  onDelete,
  onCancel,
}: Props) {
  const saveBtnRef = useRef<ButtonSaveBoardHandle | null>(null);
  const [name, setName] = useState(initialName);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [color, setColor] = useState(initialColor);
  const [{ screenW, screenH }, setScreen] = useState(() => {
    const { width, height } = Dimensions.get("screen");
    return { screenW: width, screenH: height };
  });

  useEffect(() => {
    if (visible) {
      setName(initialName);
      setSelectedPeople(initialMembers ?? []);
      setNotificationsEnabled(initialNotifications ?? true);
      setColor(initialColor);
    }
  }, [visible, initialName, initialMembers, initialNotifications, initialColor]);

  // Keep modal sized to full screen dimensions (not window), so it doesn't shrink when keyboard opens
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ screen }) => {
      setScreen({ screenW: screen.width, screenH: screen.height });
    });
    return () => {
      // RN supports .remove() or direct return depending on version
      // @ts-ignore
      sub?.remove?.();
    };
  }, []);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={[
          styles.modalOverlay,
          { width: screenW, height: screenH },
        ]}
        onPress={onCancel}
      >
        <Pressable style={{ width: "100%", height: "100%" }} onPress={() => { }}>
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

              {/* Color selector */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>Color</ThemedText>
                <ColorPicker
                  colors={[
                    "rgba(21, 23, 24, 1)",
                    "rgba(59, 130, 246, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(245, 158, 11, 1)",
                    "rgba(239, 68, 68, 1)",
                    "rgba(168, 85, 247, 1)"
                  ]}
                  value={color}
                  onChange={setColor}
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
                  color={color}
                  onSave={({ name, members, notifications, color }) =>
                    onSave({ name, members, notifications, color })
                  }
                />
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
    alignItems: "center",
    justifyContent: "center",
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
