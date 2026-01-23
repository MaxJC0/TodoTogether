import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from '@/components/shared/themed-text';

type Props = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={{ width: '100%', height: '100%' }} onPress={() => { }}>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding', android: undefined })}
            style={styles.center}
          >
            <View style={styles.card}>
              <View style={styles.body}>
                <ThemedText type="title" style={styles.title}>
                  {title}
                </ThemedText>
                {!!message && (
                  <ThemedText style={styles.message}>{message}</ThemedText>
                )}
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={onCancel} style={[styles.btn, styles.btnSecondary]}>
                  <ThemedText>{cancelLabel}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  style={[styles.btn, styles.btnDanger]}
                >
                  <ThemedText>{confirmLabel}</ThemedText>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 44,
  },
  center: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'rgba(30,30,30,0.98)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  body: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  message: {
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btn: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  btnDanger: {
    backgroundColor: '#ef4444',
  },
});
