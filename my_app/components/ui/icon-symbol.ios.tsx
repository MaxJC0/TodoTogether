import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * IconSymbol component renders a symbol icon using expo-symbols.
 *
 * Props:
 * - name: The name of the symbol to display.
 * - size: The size of the icon (width and height). Default is 24.
 * - color: The color to tint the icon.
 * - style: Additional styles to apply to the icon container.
 * - weight: The weight of the symbol (e.g., 'regular', 'bold'). Default is 'regular'.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
