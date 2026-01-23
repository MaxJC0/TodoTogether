import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/shared/themed-text';
import { ThemedView } from '@/components/shared/themed-view';
import { RadioGroup } from '@/components/ui/radio';

export default function TestScreen() {
  const [priority, setPriority] = useState<string | null>('medium');

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Choose priority</ThemedText>

      <RadioGroup
        value={priority}
        onChange={setPriority}
        direction="vertical"
        options={[
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
        ]}
      />

      <ThemedText style={{ marginTop: 12 }}>
        Selected: {priority ?? 'none'}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
});
