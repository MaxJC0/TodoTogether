import React, { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { ThemedText } from '@/components/shared/themed-text';

export type SaveBoardPayload = {
  name: string;
  members: string[];
  notifications: boolean;
  color?: string;
};

export type ButtonSaveBoardHandle = {
  submit: () => void;
};

type Props = {
  name: string;
  members: string[];
  notifications: boolean;
  color?: string;
  onSave: (data: SaveBoardPayload) => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Button that saves board settings.
 * Disabled if the board name is empty or only whitespace.
 * On press, calls onSave with the current board data.
 * Exposes a submit method via ref to trigger save programmatically.
 */
const ButtonSaveBoard = forwardRef<ButtonSaveBoardHandle, Props>(
  ({ name, members, notifications, color, onSave, label = 'Save', style }, ref) => {
    const trimmedName = useMemo(() => name?.trim() ?? '', [name]);
    const isDisabled = !trimmedName;

    const submit = useCallback(() => {
      if (isDisabled) return;
      onSave({ name: trimmedName, members, notifications, color });
    }, [isDisabled, onSave, trimmedName, members, notifications, color]);

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
