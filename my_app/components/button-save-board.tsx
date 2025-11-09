import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export type SaveBoardPayload = {
  name: string;
  members: string[];
  notifications: boolean;
};

export type ButtonSaveBoardHandle = {
  submit: () => void;
};

type Props = {
  name: string;
  members: string[];
  notifications: boolean;
  onSave: (data: SaveBoardPayload) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

const ButtonSaveBoard = forwardRef<ButtonSaveBoardHandle, Props>(
  ({ name, members, notifications, onSave, label = 'Save', style }, ref) => {
    const trimmedName = useMemo(() => name?.trim() ?? '', [name]);
    const isDisabled = !trimmedName;

    const submit = useCallback(() => {
      if (isDisabled) return;
      onSave({ name: trimmedName, members, notifications });
    }, [isDisabled, onSave, trimmedName, members, notifications]);

    useImperativeHandle(ref, () => ({ submit }), [submit]);

    return (
      <TouchableOpacity
        onPress={submit}
        style={[styles.btn, styles.btnPrimary, style]}
        disabled={isDisabled}
      >
        <ThemedText>{label}</ThemedText>
      </TouchableOpacity>
    );
  }
);

ButtonSaveBoard.displayName = 'ButtonSaveBoard';

const styles = StyleSheet.create({
  btn: {
    minWidth: 80,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: 'rgba(159, 159, 159, 1)',
  },
});

export default ButtonSaveBoard;
