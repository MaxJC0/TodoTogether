import React from "react";
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";

type ButtonPlusProps = {
	onPress: () => void;
	label?: string;
	style?: StyleProp<ViewStyle>;
};

export default function ButtonPlus({ onPress, label = "Create", style }: ButtonPlusProps) {
	return (
		<TouchableOpacity
			accessibilityRole="button"
			accessibilityLabel={label}
			onPress={onPress}
			style={[styles.btn, styles.primary, style]}
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
	primary: {
		backgroundColor: "#3b82f6",
	},
	text: {
		color: "#fff",
	},
});

