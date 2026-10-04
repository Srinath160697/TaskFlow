import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';

/**
 * Full-area error state with an optional retry action, for data screens
 * that failed to load.
 * @param {{ message?: string, onRetry?: () => void }} props
 */
export function ErrorView({ message = 'Something went wrong.', onRetry }) {
  const { colors, spacing, typography } = useTheme();
  return (
    <View style={[styles.container, { padding: spacing.xxl }]}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.md, textAlign: 'center' }]}>
        {message}
      </Text>
      {onRetry ? (
        <Button title="Try again" onPress={onRetry} variant="secondary" style={{ marginTop: spacing.lg }} />
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
