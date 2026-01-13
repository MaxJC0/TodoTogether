import React, { useEffect, useRef } from "react";
import { StyleSheet, View, TextInput, Platform, Animated, Keyboard } from "react-native";
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
  const inputRef = useRef<TextInput | null>(null);
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const onShow = (e: any) => {
      if (!inputRef.current?.isFocused()) return;
      const height = e?.endCoordinates?.height ?? 0;
      Animated.timing(translateY, {
        toValue: -height,
        duration: (Platform.OS === "ios" ? e?.duration : undefined) ?? 250,
        useNativeDriver: true,
      }).start();
    };

    const onHide = (e: any) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: (Platform.OS === "ios" ? e?.duration : undefined) ?? 200,
        useNativeDriver: true,
      }).start();
    };

    const subShow = Keyboard.addListener(showEvent, onShow);
    const subHide = Keyboard.addListener(hideEvent, onHide);

    return () => {
      subShow.remove();
      subHide.remove();
    };
  }, [translateY]);

  return (
    <Animated.View
      style={[
        styles.overlay,
        { bottom: insets.bottom + 8, transform: [{ translateY }] },
      ]}
      pointerEvents="box-none"
    >
      <View style={styles.inner}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          selectionColor="white"
          style={styles.input}
          returnKeyType="search"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Absolute bottom overlay so only the bar moves with the resized screen
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  inner: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "rgba(21, 23, 24, 1)",
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#fff",
    backgroundColor: "#222",
    // Subtle elevation/shadow to separate from underlying content
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
});