import React from 'react';
import { Alert, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/themed-text';

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
  const confirm = () => {
    Alert.alert(
      'Delete board?',
      boardName ? `Are you sure you want to delete "${boardName}"? This cannot be undone.` :
        'Are you sure you want to delete this board? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(boardId),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={confirm}
      style={[styles.btn, styles.danger, style]}
    >
      <ThemedText style={styles.text}>{label}</ThemedText>
    </TouchableOpacity>
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
