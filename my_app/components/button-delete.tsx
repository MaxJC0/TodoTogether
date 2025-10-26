import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";

type ButtonDeleteProps = {
	onPress: () => void;
	disabled?: boolean;
	label?: string;
	style?: StyleProp<ViewStyle>;
};

export default function ButtonDelete({
	onPress,
	disabled = false,
	label = "Delete marked",
	style,
}: ButtonDeleteProps) {
	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled }}
			onPress={disabled ? undefined : onPress}
			disabled={disabled}
			style={[styles.btn, styles.danger, disabled && styles.disabled, style]}
		>
			<ThemedText style={styles.text}>{label}</ThemedText>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	btn: {
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: 6,
	},
	danger: {
		backgroundColor: "#ef4444",
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		color: "#fff",
	},
});

