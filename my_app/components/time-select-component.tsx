import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import InputTime from "@/components/input-time";
import InputDate from "@/components/input-date";

export type RepeatRule = {
  cycle: "day" | "week" | "biweek" | "month" | "year";
  time: string; // HH:mm 24h
  dayOfWeek?: number; // 0-6 (Sun-Sat) for week/biweek
  dayOfMonth?: number; // 1-31 for month/year
  month?: number; // 0-11 for year
};

export type Schedule = { dueAt?: number; repeat?: RepeatRule } | undefined;

export type TimeSelectComponentProps = {
  label?: string;
  initialSchedule?: Schedule;
  onChange: (schedule: Schedule) => void;
};

type Mode = "none" | "due" | "repeat";

export default function TimeSelectComponent({ label = "Schedule", initialSchedule, onChange }: TimeSelectComponentProps) {
  const [mode, setMode] = useState<Mode>("none");
  // due date
  const [dueDate, setDueDate] = useState<string>(""); // YYYY-MM-DD
  const [dueTime, setDueTime] = useState<string>("09:00"); // HH:mm
  // repeat
  const [repeatCycle, setRepeatCycle] = useState<RepeatRule["cycle"]>("day");
  const [repeatTime, setRepeatTime] = useState<string>("09:00");
  const [repeatDow, setRepeatDow] = useState<number>(1); // Monday
  const [repeatDom, setRepeatDom] = useState<number>(1);
  const [repeatMonth, setRepeatMonth] = useState<number>(0);

  // Hydrate from initialSchedule
  useEffect(() => {
    if (!initialSchedule) {
      setMode("none");
      setDueDate("");
      setDueTime("09:00");
      setRepeatCycle("day");
      setRepeatTime("09:00");
      setRepeatDow(1);
      setRepeatDom(1);
      setRepeatMonth(0);
      return;
    }
    if (initialSchedule.dueAt) {
      const d = new Date(initialSchedule.dueAt);
      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setMode("due");
      setDueDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
      setDueTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
      return;
    }
    if (initialSchedule.repeat) {
      const r = initialSchedule.repeat;
      setMode("repeat");
      setRepeatCycle(r.cycle);
      setRepeatTime(r.time || "09:00");
      if (typeof r.dayOfWeek === "number") setRepeatDow(r.dayOfWeek);
      if (typeof r.dayOfMonth === "number") setRepeatDom(r.dayOfMonth);
      if (typeof r.month === "number") setRepeatMonth(r.month);
      return;
    }
    setMode("none");
  }, [initialSchedule]);

  // Compute schedule from state
  const schedule: Schedule = useMemo(() => {
    if (mode === "due") {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dueDate.trim());
      const t = /^(\d{1,2}):(\d{2})$/.exec(dueTime.trim());
      if (m && t) {
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10) - 1;
        const d = parseInt(m[3], 10);
        const hh = Math.min(23, Math.max(0, parseInt(t[1], 10)));
        const mm = Math.min(59, Math.max(0, parseInt(t[2], 10)));
        return { dueAt: new Date(y, mo, d, hh, mm, 0, 0).getTime() };
      }
      return undefined;
    }
    if (mode === "repeat") {
      const rep: RepeatRule = { cycle: repeatCycle, time: repeatTime };
      if (repeatCycle === "week" || repeatCycle === "biweek") rep.dayOfWeek = repeatDow;
      if (repeatCycle === "month" || repeatCycle === "year") rep.dayOfMonth = repeatDom;
      if (repeatCycle === "year") rep.month = repeatMonth;
      return { repeat: rep };
    }
    return undefined;
  }, [mode, dueDate, dueTime, repeatCycle, repeatTime, repeatDow, repeatDom, repeatMonth]);

  // Notify parent on schedule changes
  useEffect(() => {
    onChange(schedule);
  }, [schedule, onChange]);

  return (
    <View>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      <View style={styles.modeRow}>
        {(["none", "due", "repeat"] as Mode[]).map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            style={[styles.modeChip, mode === m && styles.modeChipActive]}
          >
            <ThemedText style={styles.modeChipText}>
              {m === "none" ? "None" : m === "due" ? "Due by" : "Repeats"}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {mode === "due" && (
        <View style={{ gap: 10 }}>
          <InputDate mode="any" value={dueDate} onChange={setDueDate} />
          <InputTime value={dueTime} onChange={setDueTime} />
        </View>
      )}

      {mode === "repeat" && (
        <View style={{ gap: 10 }}>
          <View>
            <ThemedText style={styles.subLabel}>Cycle</ThemedText>
            <View style={styles.cycleRow}>
              {(["day", "week", "biweek", "month", "year"] as RepeatRule["cycle"][]).map((c) => (
                <Pressable
                  key={c}
                  onPress={() => setRepeatCycle(c)}
                  style={[styles.cycleChip, repeatCycle === c && styles.cycleChipActive]}
                >
                  <ThemedText style={styles.cycleChipText}>{c}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
          {(repeatCycle === "week" || repeatCycle === "biweek") && (
            <InputDate mode="week" value={repeatDow} onChange={setRepeatDow} />
          )}
          {repeatCycle === "month" && (
            <InputDate mode="month-day" value={repeatDom} onChange={setRepeatDom} />
          )}
          {repeatCycle === "year" && (
            <InputDate mode="year-day" value={{ month: repeatMonth, day: repeatDom }} onChange={(v) => { setRepeatMonth(v.month); setRepeatDom(v.day); }} />
          )}
          <InputTime value={repeatTime} onChange={setRepeatTime} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    marginBottom: 8,
    opacity: 0.9,
  },
  subLabel: {
    marginBottom: 6,
    opacity: 0.8,
    fontSize: 13,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  modeChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  modeChipActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.32)",
  },
  modeChipText: {
    fontSize: 13,
  },
  cycleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cycleChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  cycleChipActive: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.32)",
  },
  cycleChipText: {
    fontSize: 12,
    textTransform: "capitalize",
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
