import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import InputName from "@/components/input-name";

export type InputDateMode = "any" | "week" | "month-day" | "year-day";

export type YearDay = { month: number; day: number }; // month 0-11, day 1-31

export type InputDateProps =
  | { mode: "any"; label?: string; value: string; onChange: (v: string) => void; placeholder?: string }
  | { mode: "week"; label?: string; value: number; onChange: (v: number) => void }
  | { mode: "month-day"; label?: string; value: number; onChange: (v: number) => void }
  | { mode: "year-day"; label?: string; value: YearDay; onChange: (v: YearDay) => void };

export default function InputDate(props: InputDateProps) {
  if (props.mode === "any") {
    const { label = "Date (YYYY-MM-DD)", value, onChange, placeholder = "YYYY-MM-DD" } = props;
    const handleChange = (txt: string) => {
      const cleaned = txt.replace(/[^0-9-]/g, "").slice(0, 10);
      onChange(cleaned);
    };
    return (
      <View>
        {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <InputName value={value} onChangeText={handleChange} placeholder={placeholder} maxLength={10} />
      </View>
    );
  }

  if (props.mode === "week") {
    const { label = "Day of week", value, onChange } = props;
    const labels = ["S", "M", "T", "W", "T", "F", "S"]; // 0-6
    return (
      <View>
        {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <View style={styles.weekRow}>
          {labels.map((lbl, idx) => (
            <Pressable key={idx} onPress={() => onChange(idx)} style={[styles.dayChip, value === idx && styles.dayChipActive]}>
              <ThemedText style={styles.dayChipText}>{lbl}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  if (props.mode === "month-day") {
    const { label = "Day of month (1-31)", value, onChange } = props;
    const handleChange = (txt: string) => {
      const n = Math.min(31, Math.max(1, parseInt(txt || "1", 10) || 1));
      onChange(n);
    };
    return (
      <View>
        {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <InputName value={String(value)} onChangeText={handleChange} placeholder="1-31" keyboardType="numeric" maxLength={2} />
      </View>
    );
  }

  // year-day
  const { label = "Month/Day (1-12 / 1-31)", value, onChange } = props;
  const handleMonth = (txt: string) => {
    const m = Math.min(12, Math.max(1, parseInt(txt || "1", 10) || 1)) - 1;
    onChange({ month: m, day: value.day });
  };
  const handleDay = (txt: string) => {
    const d = Math.min(31, Math.max(1, parseInt(txt || "1", 10) || 1));
    onChange({ month: value.month, day: d });
  };
  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <View style={{ gap: 8 }}>
        <InputName value={String(value.month + 1)} onChangeText={handleMonth} placeholder="1-12" keyboardType="numeric" maxLength={2} />
        <InputName value={String(value.day)} onChangeText={handleDay} placeholder="1-31" keyboardType="numeric" maxLength={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
    opacity: 0.8,
    fontSize: 13,
  },
  weekRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
  },
  dayChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  dayChipActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.32)",
  },
  dayChipText: {
    fontSize: 12,
  },
});
