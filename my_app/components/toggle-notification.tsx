import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, Pressable, Animated, Easing } from "react-native";
import { ThemedText } from "@/components/themed-text";

export type ToggleNotificationProps = {
  value: boolean;
  onChange: (next: boolean) => void;
  label?: string;
};

export default function ToggleNotification({ value, onChange, label = "Notifications" }: ToggleNotificationProps) {
  // Dimensions derived from the Uiverse example
  const TRACK_WIDTH = 40; // ~3.5em at ~16px
  const TRACK_HEIGHT = 8; // ~0.5em
  const CIRCLE_SIZE = 24; // ~3em
  const RING_SIZE = Math.round(CIRCLE_SIZE * 0.766); // ~2.3em
  const DOT_SIZE = Math.round(CIRCLE_SIZE * 0.567); // ~1.7em

  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: value ? 1 : 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-(CIRCLE_SIZE / 2), TRACK_WIDTH - CIRCLE_SIZE / 2],
  });

  const dotScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  const ringBg = useMemo(() => (value ? "#e1e1e1" : "rgb(182,182,182)"), [value]);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
        onPress={() => onChange(!value)}
        style={{ paddingVertical: 8, paddingHorizontal: 4 }}
      >
        <View style={[styles.track, { width: TRACK_WIDTH, height: TRACK_HEIGHT }]}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.circle,
              {
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                top: (TRACK_HEIGHT - CIRCLE_SIZE) / 2,
                transform: [{ translateX }],
              },
            ]}
          >
            <View
              style={[
                styles.ring,
                {
                  width: RING_SIZE,
                  height: RING_SIZE,
                  backgroundColor: ringBg,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.dot,
                {
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    opacity: 0.9,
  },
  track: {
    backgroundColor: "#5B5B5B",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  circle: {
    position: "absolute",
    left: 0,
    borderRadius: 9999,
    backgroundColor: "#212121",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    borderRadius: 9999,
  },
  dot: {
    position: "absolute",
    borderRadius: 9999,
    backgroundColor: "#212121",
  },
});
