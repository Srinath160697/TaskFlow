import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Tappable checkbox used for marking tasks complete.
 * @param {{ checked: boolean, onToggle: () => void, size?: number }} props
 */
export function Checkbox({ checked, onToggle, size = 24 }) {
  const { colors, radius } = useTheme();
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.sm,
          borderColor: checked ? colors.success : colors.border,
          backgroundColor: checked ? colors.success : 'transparent',
        },
      ]}
    >
      {checked ? <Ionicons name="checkmark" size={size * 0.7} color={colors.textInverse} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
