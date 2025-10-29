import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export type DropdownBoardMembersProps = {
  selected: string[];
  onChange: (next: string[]) => void;
  label?: string;
  people?: string[];
  initiallyOpen?: boolean;
};

const DEFAULT_PEOPLE: string[] = [
  "Alice Johnson",
  "Bob Chen",
  "Charlie Smith",
  "Dana Patel",
  "Eli Müller",
  "Fatima Khan",
];

export default function DropdownBoardMembers({
  selected,
  onChange,
  label = "Members",
  people = DEFAULT_PEOPLE,
  initiallyOpen = false,
}: DropdownBoardMembersProps) {
  const [open, setOpen] = useState(initiallyOpen);

  const togglePerson = (person: string) => {
    onChange(
      selected.includes(person)
        ? selected.filter((p) => p !== person)
        : [...selected, person]
    );
  };

  return (
    <View>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      <View style={styles.dropdownWrap}>
        <Pressable
          style={styles.dropdown}
          onPress={() => setOpen((v) => !v)}
          accessibilityRole="button"
        >
          <ThemedText style={styles.dropdownText}>
            {selected.length > 0 ? selected.join(", ") : "Add people"}
          </ThemedText>
          <ThemedText style={styles.dropdownChevron}>{open ? "▲" : "▼"}</ThemedText>
        </Pressable>
        {open && (
          <View style={styles.dropdownList}>
            {people.map((p: string) => {
              const checked = selected.includes(p);
              return (
                <Pressable
                  key={p}
                  onPress={() => togglePerson(p)}
                  style={styles.dropdownItem}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked }}
                >
                  <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                    {checked && <ThemedText style={styles.checkboxMark}>✓</ThemedText>}
                  </View>
                  <ThemedText>{p}</ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    sectionLabel: {
        marginBottom: 8,
        opacity: 0.9,
    },
    dropdownWrap: {
        position: "relative",
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "rgba(255,255,255,0.06)",
    },
    dropdownText: {
        flex: 1,
        marginRight: 8,
        opacity: 0.9,
    },
    dropdownChevron: {
        opacity: 0.7,
    },
    dropdownList: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "100%",
        marginTop: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "rgba(255, 255, 255, 0.04)",
        zIndex: 10,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 10,
        maxHeight: 200, // Limit the dropdown height
         // Ensure items outside the limit are hidden
         overflow: "scroll",
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(255,255,255,0.12)",
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    checkboxChecked: {
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
    },
    checkboxMark: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 12,
    },
});
