import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';

export type ColorPickerProps = {
  colors: string[];
  value: string;
  onChange: (color: string) => void;
  size?: number; // diameter of each swatch
  style?: StyleProp<ViewStyle>;
};

export default function ColorPicker({ colors, value, onChange, size = 28, style }: ColorPickerProps) {
  return (
    <View style={[styles.row, style] as StyleProp<ViewStyle>}>
      {colors.map((c) => {
        const selected = value === c;
        return (
          <Pressable
            key={c}
            onPress={() => onChange(c)}
            style={[
              { width: size, height: size, borderRadius: size / 2, borderWidth: 2.5 },
              { backgroundColor: c, borderColor: selected ? '#fff' : 'rgba(255,255,255,0.4)' },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Select color ${c}`}
            accessibilityState={{ selected }}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
});
