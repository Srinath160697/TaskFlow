import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Centered placeholder for screens/lists with no data. Used for both
 * "no tasks yet" and "no search results" style messages.
 * @param {{ icon?: string, title: string, message?: string, children?: React.ReactNode }} props
 */
export function EmptyState({ icon = 'file-tray-outline', title, message, children }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <Ionicons name={icon} size={48} color={colors.textMuted} />
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
        {title}
      </Text>
      {message ? (
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' }]}>
          {message}
        </Text>
      ) : null}
      {children ? <View style={{ marginTop: spacing.lg }}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
