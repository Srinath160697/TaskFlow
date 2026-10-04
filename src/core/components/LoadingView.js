import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/** Full-area loading indicator with an optional message, for data screens. */
export function LoadingView({ message = 'Loading…' }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.md }]}>{message}</Text>
      ) : null}
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
