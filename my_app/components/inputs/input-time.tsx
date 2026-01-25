import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { ThemedText } from "@/components/shared/themed-text";
import InputName from "@/components/inputs/input-name";

export type InputTimeProps = {
  label?: string;
  value: string; // HH:mm
  onChange: (next: string) => void;
  minuteStep?: number; // granularity for wheel (default 1)
};

/**
 * Time input component for selecting a time of day.
 * Supports iOS, Android, and Web platforms.
 * Calls onChange with the selected time in "HH:mm" format.
 */
export default function InputTime({ label, value, onChange, minuteStep = 1 }: InputTimeProps) {
  const supportedIntervals = [1, 2, 3, 4, 5, 6, 10, 12, 15] as const;
  type SupportedInterval = (typeof supportedIntervals)[number];
  const minuteIntervalIOS: SupportedInterval | undefined = Platform.OS === "ios"
    ? supportedIntervals.find((interval) => interval === minuteStep)
    : undefined;

  const parse = (v: string) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec((v || "").trim());
    const hh = Math.min(23, Math.max(0, parseInt(m?.[1] || "9", 10) || 9));
    const mm = Math.min(59, Math.max(0, parseInt(m?.[2] || "0", 10) || 0));
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    return d;
  };
  const format = (date: Date) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const [pickerDate, setPickerDate] = useState(() => parse(value));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  useEffect(() => {
    setPickerDate(parse(value));
  }, [value]);

  const quickMinutes = useMemo(() => {
    if (minuteStep === 1) return [0, 15, 30, 45];
    return [0, 15, 30, 45]
      .map((m) => Math.round(m / minuteStep) * minuteStep)
      .filter((v, i, arr) => arr.indexOf(v) === i && v < 60);
  }, [minuteStep]);

  const commitDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setSeconds(0, 0);
    setPickerDate(normalized);
    onChange(format(normalized));
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowAndroidPicker(false);
      if (event.type !== "set" || !selectedDate) {
        return;
      }
      commitDate(selectedDate);
      return;
    }
    if (selectedDate) {
      commitDate(selectedDate);
    }
  };

  const handleQuickMinute = (minute: number) => {
    const next = new Date(pickerDate);
    next.setMinutes(minute, 0, 0);
    commitDate(next);
  };

  const handleWebChange = (text: string) => {
    const cleaned = text.replace(/[^0-9:]/g, "").slice(0, 5);
    const match = /^(\d{1,2})(?::(\d{1,2}))?$/.exec(cleaned);
    if (!match) {
      onChange(cleaned);
      return;
    }
    const hh = Math.min(23, parseInt(match[1], 10));
    const mmRaw = match[2] ? parseInt(match[2], 10) : 0;
    const mm = Math.min(59, mmRaw);
    const formatted = `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}`;
    commitDate(parse(formatted));
  };

  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {Platform.OS === "ios" && (
        <DateTimePicker
          value={pickerDate}
          mode="time"
          display="spinner"
          onChange={handlePickerChange}
          minuteInterval={minuteIntervalIOS}
          is24Hour
          style={styles.pickerIOS}
        />
      )}

      {Platform.OS === "android" && (
        <View>
          <Pressable style={styles.androidField} onPress={() => setShowAndroidPicker(true)}>
            <ThemedText style={styles.androidFieldText}>{format(pickerDate)}</ThemedText>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker
              value={pickerDate}
              mode="time"
              display="spinner"
              onChange={handlePickerChange}
              is24Hour
            />
          )}
        </View>
      )}

      {Platform.OS === "web" && (
        <InputName value={value} onChangeText={handleWebChange} placeholder="HH:MM" maxLength={5} />
      )}

      {quickMinutes.length > 0 && (
        <View style={styles.quickRow}>
          {quickMinutes.map((m) => (
            <Pressable
              key={m}
              onPress={() => handleQuickMinute(m)}
              style={[styles.chip, pickerDate.getMinutes() === m && styles.chipActive]}
            >
              <ThemedText style={styles.chipText}>{m.toString().padStart(2, "0")}</ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    opacity: 0.8,
    fontSize: 13,
  },
  pickerIOS: {
    alignSelf: "flex-start",
  },
  androidField: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  androidFieldText: {
    fontSize: 16,
    fontVariant: ["tabular-nums"],
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
