import React, { useState } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import ConfirmDialog from '@/components/ui/confirm-dialog';

type Props = {
  boardId: string;
  boardName?: string;
  onDelete: (id: string) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export default function ButtonDeleteBoard({
  boardId,
  boardName,
  onDelete,
  label = 'Delete',
  style,
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirm = () => setShowConfirm(true);
  const handleConfirm = () => {
    setShowConfirm(false);
    onDelete(boardId);
  };

  return (
    <>
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={confirm}
        style={[styles.btn, styles.danger, style]}
      >
        <ThemedText style={styles.text}>{label}</ThemedText>
      </TouchableOpacity>
      <ConfirmDialog
        visible={showConfirm}
        title="Delete board?"
        message={
          boardName
            ? `Are you sure you want to delete "${boardName}"? This cannot be undone.`
            : 'Are you sure you want to delete this board? This cannot be undone.'
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  danger: {
    backgroundColor: '#ef4444',
  },
  text: {
    color: '#fff',
  },
});
