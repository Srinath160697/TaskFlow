import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Horizontal segmented control, used for the All/Pending/Completed filter.
 * @param {{ options: string[], value: string, onChange: (v: string) => void }} props
 */
export function SegmentedTabs({ options, value, onChange }) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md, padding: spacing.xs / 2 }]}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.segment,
              {
                backgroundColor: selected ? colors.surface : 'transparent',
                borderRadius: radius.sm,
              },
            ]}
          >
            <Text style={[typography.captionBold, { color: selected ? colors.primary : colors.textMuted }]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});
