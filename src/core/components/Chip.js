import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Small selectable pill, used for filters, sort options, and priority badges.
 * @param {{ label: string, selected?: boolean, onPress?: () => void, color?: string, mutedColor?: string }} props
 */
export function Chip({ label, selected = false, onPress, color, mutedColor }) {
  const { colors, spacing, radius, typography } = useTheme();
  const fg = color ?? colors.primary;
  const bg = selected ? fg : mutedColor ?? colors.surfaceAlt;
  const textColor = selected ? colors.textInverse : fg;

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      style={[
        styles.base,
        {
          backgroundColor: bg,
          borderRadius: radius.pill,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <Text style={[typography.captionBold, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
  },
});
