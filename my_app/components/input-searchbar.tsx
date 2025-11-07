import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function InputSearchBar({
  value,
  onChange,
  placeholder = "Search boards...",
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, { paddingBottom: insets.bottom }]}
    >
      <View style={styles.inner}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          style={styles.input}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Absolute bottom overlay so only the bar moves with the resized screen
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: "#151718",
  },
  inner: {
    paddingHorizontal: 24,
    paddingTop: 4,
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
    backgroundColor: "#ffffff0f",
  },
});