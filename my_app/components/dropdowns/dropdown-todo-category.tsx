import React, { useState } from "react";
import { Pressable, StyleSheet, View, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";

export type DropdownTodoCategoryProps = {
  selected: string;
  onChange: (next: string) => void;
  label?: string;
  categories?: string[];
  initiallyOpen?: boolean;
};

const DEFAULT_CATEGORIES: string[] = [
  "General",
  "Work",
  "Personal",
  "Errand",
  "Idea",
  "Urgent",
];

export default function DropdownTodoCategory({
  selected,
  onChange,
  label = "Category",
  categories = DEFAULT_CATEGORIES,
  initiallyOpen = false,
}: DropdownTodoCategoryProps) {
  const [open, setOpen] = useState(initiallyOpen);

  return (
    <View>
      <ThemedText style={styles.sectionLabel}>{label}</ThemedText>
      <View style={styles.dropdownWrap}>
        <Pressable
          style={styles.dropdown}
          onPress={() => setOpen((v) => !v)}
          accessibilityRole="button"
        >
          <ThemedText style={styles.dropdownText}>{selected}</ThemedText>
          <ThemedText style={styles.dropdownChevron}>{open ? "▲" : "▼"}</ThemedText>
        </Pressable>
        {open && (
          <ScrollView
            style={styles.dropdownList}
            contentContainerStyle={styles.dropdownListContent}
            keyboardShouldPersistTaps="handled"
          >
            {categories.map((c) => {
              const isSelected = c === selected;
              return (
                <Pressable
                  key={c}
                  onPress={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                  style={styles.dropdownItem}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <ThemedText>{c}</ThemedText>
                </Pressable>
              );
            })}
          </ScrollView>
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
    backgroundColor: "#272627",
    zIndex: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    maxHeight: 200,
  },
  dropdownListContent: {
    paddingVertical: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  radioCircleSelected: {
    borderColor: "#fff",
    backgroundColor: "#ACABAD",
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
});
