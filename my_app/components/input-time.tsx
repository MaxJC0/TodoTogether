import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, View, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";

export type InputTimeProps = {
  label?: string;
  value: string; // HH:mm
  onChange: (next: string) => void;
  minuteStep?: number; // granularity for wheel (default 1)
};

export default function InputTime({ value, onChange, minuteStep = 1 }: InputTimeProps) {
  const parse = (v: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec((v || "").trim());
    let hh = Math.min(23, Math.max(0, parseInt(m?.[1] || "9", 10) || 9));
    let mm = Math.min(59, Math.max(0, parseInt(m?.[2] || "0", 10) || 0));
    return { hh, mm };
  };
  const format = (hh: number, mm: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(hh)}:${pad(mm)}`;
  };

  const [{ hh, mm }, setHM] = useState(() => parse(value));
  const hourRef = useRef<ScrollView | null>(null);
  const minRef = useRef<ScrollView | null>(null);
  const ITEM_HEIGHT = 36;
  const WHEEL_VISIBLE_COUNT = 5; // for styling center highlight
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(() => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep), [minuteStep]);
  useEffect(() => {
    const parsed = parse(value);
    setHM(parsed);
    // Scroll wheels to match external value when it changes
    requestAnimationFrame(() => {
      hourRef.current?.scrollTo({ y: parsed.hh * ITEM_HEIGHT, animated: false });
      const minuteIndex = minutes.indexOf(minutes.find((m) => m === parsed.mm) ?? 0);
      minRef.current?.scrollTo({ y: minuteIndex * ITEM_HEIGHT, animated: false });
    });
  }, [value, minutes]);

  const update = (nh: number, nm: number) => {
    const clampedH = ((nh % 24) + 24) % 24; // wrap 0-23
    const clampedM = ((nm % 60) + 60) % 60; // wrap 0-59
    setHM({ hh: clampedH, mm: clampedM });
    onChange(format(clampedH, clampedM));
  };

  // Press-and-hold repeat
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startHold = (fn: () => void) => {
    fn();
    if (holdTimer.current) clearInterval(holdTimer.current);
    holdTimer.current = setInterval(fn, 150);
  };
  const stopHold = () => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
  };

  const incHour = () => update(hh + 1, mm);
  const decHour = () => update(hh - 1, mm);
  const incMin = (step = minuteStep) => update(hh, mm + step);
  const decMin = (step = minuteStep) => update(hh, mm - step);

  const quickMinutes = useMemo(() => {
    if (minuteStep === 1) return [0, 15, 30, 45];
    // adapt quick chips to nearest multiples
    return [0, 15, 30, 45].map((m) => Math.round(m / minuteStep) * minuteStep).filter((v, i, a) => a.indexOf(v) === i && v < 60);
  }, [minuteStep]);

  // Wheel scroll handlers
  const onHourScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newH = hours[Math.min(hours.length - 1, Math.max(0, index))];
    update(newH, mm);
  };
  const onMinuteScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const newM = minutes[Math.min(minutes.length - 1, Math.max(0, index))];
    update(hh, newM);
  };

  return (
    <View>
      <View style={styles.wheelsRow}>
        <View style={styles.wheelWrap}>
          <ScrollView
            ref={hourRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={"fast"}
            onMomentumScrollEnd={onHourScrollEnd}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          >
            {hours.map((h) => (
              <View key={h} style={[styles.wheelItem, { height: ITEM_HEIGHT }]}
              >
                <ThemedText style={[styles.wheelText, hh === h && styles.wheelTextActive]}>{h.toString().padStart(2, "0")}</ThemedText>
              </View>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.centerHighlight} />
        </View>
        <ThemedText style={styles.colon}>:</ThemedText>
        <View style={styles.wheelWrap}>
          <ScrollView
            ref={minRef}
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={"fast"}
            onMomentumScrollEnd={onMinuteScrollEnd}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
          >
            {minutes.map((m) => (
              <View key={m} style={[styles.wheelItem, { height: ITEM_HEIGHT }]}
              >
                <ThemedText style={[styles.wheelText, mm === m && styles.wheelTextActive]}>{m.toString().padStart(2, "0")}</ThemedText>
              </View>
            ))}
          </ScrollView>
          <View pointerEvents="none" style={styles.centerHighlight} />
        </View>
      </View>

      <View style={styles.quickRow}>
        {quickMinutes.map((m) => (
          <Pressable
            key={m}
            onPress={() => update(hh, m)}
            style={[styles.chip, mm === m && styles.chipActive]}
          >
            <ThemedText style={styles.chipText}>{m.toString().padStart(2, "0")}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheelsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  wheelWrap: {
    width: 72,
    height: 180,
    position: "relative",
    overflow: "hidden",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  wheelItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  wheelText: {
    fontSize: 16,
    opacity: 0.55,
  },
  wheelTextActive: {
    fontSize: 18,
    opacity: 1,
    fontWeight: "600",
  },
  centerHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    marginTop: -18,
    height: 36,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  colon: {
    fontSize: 20,
    opacity: 0.8,
    width: 10,
    textAlign: "center",
  },
  quickRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  chipActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.32)",
  },
  chipText: {
    fontSize: 12,
  },
});
