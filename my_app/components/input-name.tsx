import React, { forwardRef } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export interface InputNameProps extends Omit<TextInputProps, 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (text: string) => void;
}

const InputName = forwardRef<TextInput, InputNameProps>(
  ({ value, onChangeText, style, placeholder = 'Name', placeholderTextColor = '#aaa', ...rest }, ref) => {
    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, style]}
        returnKeyType={rest.returnKeyType || 'done'}
        {...rest}
      />
    );
  }
);

InputName.displayName = 'InputName';

const styles = StyleSheet.create({
  input: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

export default InputName;
