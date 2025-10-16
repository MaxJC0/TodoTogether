import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type RadioOption = { label: string; value: string; disabled?: boolean };

type Props = {
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  direction?: 'vertical' | 'horizontal';
  size?: number;
};

export function RadioGroup({ options, value, onChange, direction = 'vertical', size = 20 }: Props) {
  return (
    <ThemedView style={[styles.group, { flexDirection: direction === 'horizontal' ? 'row' : 'column' }]}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => !opt.disabled && onChange(opt.value)}
            style={styles.item}
            disabled={!!opt.disabled}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled: !!opt.disabled }}
            hitSlop={8}
          >
            <View
              style={[
                styles.outer(size),
                { borderColor: selected ? '#2563eb' : '#9ca3af', opacity: opt.disabled ? 0.5 : 1 },
              ]}
            >
              {selected && <View style={styles.inner(size)} />}
            </View>
            <ThemedText style={{ marginLeft: 8 }}>{opt.label}</ThemedText>
          </Pressable>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  group: { gap: 12 },
  item: { flexDirection: 'row', alignItems: 'center' },
  outer: (size: number) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  inner: (size: number) => ({
    width: size / 2,
    height: size / 2,
    borderRadius: size / 4,
    backgroundColor: '#2563eb',
  }),
});