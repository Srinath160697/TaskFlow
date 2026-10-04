import { Modal, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { Button } from './Button';

/**
 * Themed confirmation modal, used before destructive actions (delete task,
 * clear all tasks, etc).
 * @param {{ visible: boolean, title: string, message?: string, confirmLabel?: string, cancelLabel?: string, destructive?: boolean, onConfirm: () => void, onCancel: () => void }} props
 */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg }]}>
          <Text style={[typography.h3, { color: colors.text }]}>{title}</Text>
          {message ? (
            <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.sm }]}>{message}</Text>
          ) : null}
          <View style={[styles.actions, { marginTop: spacing.lg, gap: spacing.sm }]}>
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} style={{ flex: 1 }} />
            <Button
              title={confirmLabel}
              variant={destructive ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  actions: {
    flexDirection: 'row',
  },
});
