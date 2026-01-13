import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
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
  switch (props.mode) {
    case "any":
      return <AnyDateInput {...props} />;
    case "week":
      return <WeekDateInput {...props} />;
    case "month-day":
      return <MonthDayInput {...props} />;
    default:
      return <YearDayInput {...props} />;
  }
}

type AnyProps = Extract<InputDateProps, { mode: "any" }>;
type WeekProps = Extract<InputDateProps, { mode: "week" }>;
type MonthDayProps = Extract<InputDateProps, { mode: "month-day" }>;
type YearDayProps = Extract<InputDateProps, { mode: "year-day" }>;

const isIOS = Platform.OS === "ios";
const isAndroid = Platform.OS === "android";
const isWeb = Platform.OS === "web";

function AnyDateInput({ label = "Date", value, onChange, placeholder = "YYYY-MM-DD" }: AnyProps) {
  const [pickerDate, setPickerDate] = useState(() => parseDateString(value));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  useEffect(() => {
    setPickerDate(parseDateString(value));
  }, [value]);

  if (isWeb) {
    const handleTextChange = (txt: string) => {
      const cleaned = txt.replace(/[^0-9-]/g, "").slice(0, 10);
      onChange(cleaned);
    };
    return (
      <View>
        {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
        <InputName value={value} onChangeText={handleTextChange} placeholder={placeholder} maxLength={10} />
      </View>
    );
  }

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (isAndroid) {
      setShowAndroidPicker(false);
      if (event.type !== "set" || !selectedDate) {
        return;
      }
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange(formatDate(normalized));
      return;
    }
    if (selectedDate) {
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange(formatDate(normalized));
    }
  };

  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {isIOS ? (
        <DateTimePicker value={pickerDate} mode="date" display="spinner" onChange={handlePickerChange} style={styles.pickerIOS} />
      ) : (
        <View>
          <Pressable style={styles.androidField} onPress={() => setShowAndroidPicker(true)}>
            <ThemedText style={styles.androidFieldText}>{formatDate(pickerDate)}</ThemedText>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker value={pickerDate} mode="date" display="calendar" onChange={handlePickerChange} />
          )}
        </View>
      )}
    </View>
  );
}

function WeekDateInput({ label = "Day of week", value, onChange }: WeekProps) {
  const [pickerDate, setPickerDate] = useState(() => dateForDayOfWeek(value));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  useEffect(() => {
    setPickerDate(dateForDayOfWeek(value));
  }, [value]);

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (isAndroid) {
      setShowAndroidPicker(false);
      if (event.type !== "set" || !selectedDate) {
        return;
      }
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange(normalized.getDay());
      return;
    }
    if (selectedDate) {
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange(normalized.getDay());
    }
  };

  const handleQuickSelect = (idx: number) => {
    const next = dateForDayOfWeek(idx);
    setPickerDate(next);
    onChange(idx);
  };

  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {isIOS ? (
        <DateTimePicker value={pickerDate} mode="date" display="spinner" onChange={handlePickerChange} style={styles.pickerIOS} />
      ) : (
        <View>
          <Pressable style={styles.androidField} onPress={() => setShowAndroidPicker(true)}>
            <ThemedText style={styles.androidFieldText}>{formatWeekday(pickerDate)}</ThemedText>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker value={pickerDate} mode="date" display="calendar" onChange={handlePickerChange} />
          )}
        </View>
      )}
      <View style={styles.weekRow}>
        {WEEKDAY_LABELS.map((lbl, idx) => (
          <Pressable
            key={idx}
            onPress={() => handleQuickSelect(idx)}
            style={[styles.dayChip, value === idx && styles.dayChipActive]}
          >
            <ThemedText style={styles.dayChipText}>{lbl}</ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function MonthDayInput({ label = "Day of month", value, onChange }: MonthDayProps) {
  const [pickerDate, setPickerDate] = useState(() => dateForMonthDay(value));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  useEffect(() => {
    setPickerDate(dateForMonthDay(value));
  }, [value]);

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (isAndroid) {
      setShowAndroidPicker(false);
      if (event.type !== "set" || !selectedDate) {
        return;
      }
      const normalized = normalizeMonthDay(selectedDate);
      setPickerDate(normalized);
      onChange(normalized.getDate());
      return;
    }
    if (selectedDate) {
      const normalized = normalizeMonthDay(selectedDate);
      setPickerDate(normalized);
      onChange(normalized.getDate());
    }
  };

  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {isIOS ? (
        <DateTimePicker value={pickerDate} mode="date" display="spinner" onChange={handlePickerChange} style={styles.pickerIOS} />
      ) : (
        <View>
          <Pressable style={styles.androidField} onPress={() => setShowAndroidPicker(true)}>
            <ThemedText style={styles.androidFieldText}>{formatMonthDay(pickerDate)}</ThemedText>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker value={pickerDate} mode="date" display="calendar" onChange={handlePickerChange} />
          )}
        </View>
      )}
    </View>
  );
}

function YearDayInput({ label = "Month & day", value, onChange }: YearDayProps) {
  const [pickerDate, setPickerDate] = useState(() => dateForYearDay(value));
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);

  useEffect(() => {
    setPickerDate(dateForYearDay(value));
  }, [value.month, value.day]);

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (isAndroid) {
      setShowAndroidPicker(false);
      if (event.type !== "set" || !selectedDate) {
        return;
      }
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange({ month: normalized.getMonth(), day: normalized.getDate() });
      return;
    }
    if (selectedDate) {
      const normalized = normalizeDate(selectedDate);
      setPickerDate(normalized);
      onChange({ month: normalized.getMonth(), day: normalized.getDate() });
    }
  };

  return (
    <View>
      {!!label && <ThemedText style={styles.label}>{label}</ThemedText>}
      {isIOS ? (
        <DateTimePicker value={pickerDate} mode="date" display="spinner" onChange={handlePickerChange} style={styles.pickerIOS} />
      ) : (
        <View>
          <Pressable style={styles.androidField} onPress={() => setShowAndroidPicker(true)}>
            <ThemedText style={styles.androidFieldText}>{formatYearDay(pickerDate)}</ThemedText>
          </Pressable>
          {showAndroidPicker && (
            <DateTimePicker value={pickerDate} mode="date" display="calendar" onChange={handlePickerChange} />
          )}
        </View>
      )}
    </View>
  );
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
};

const formatDate = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateString = (value: string) => {
  const match = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec((value || "").trim());
  if (!match) return normalizeDate(new Date());
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  return normalizeDate(new Date(year, month, day));
};

const dateForDayOfWeek = (dow: number) => {
  const base = normalizeDate(new Date());
  const diff = ((dow - base.getDay()) % 7 + 7) % 7;
  base.setDate(base.getDate() + diff);
  return base;
};

const dateForMonthDay = (day: number) => {
  const base = normalizeDate(new Date());
  base.setMonth(0, Math.min(31, Math.max(1, day)));
  return base;
};

const dateForYearDay = ({ month, day }: YearDay) => {
  const base = normalizeDate(new Date());
  base.setMonth(Math.min(11, Math.max(0, month)), Math.min(31, Math.max(1, day)));
  return base;
};

const normalizeMonthDay = (date: Date) => {
  const normalized = normalizeDate(date);
  normalized.setMonth(0, normalized.getDate());
  return normalized;
};

const formatWeekday = (date: Date) => WEEKDAY_NAMES[date.getDay()];

const formatMonthDay = (date: Date) => `Day ${pad(date.getDate())}`;

const formatYearDay = (date: Date) => `${MONTH_NAMES[date.getMonth()]} ${pad(date.getDate())}`;

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
