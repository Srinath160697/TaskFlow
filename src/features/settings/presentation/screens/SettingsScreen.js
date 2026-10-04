import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Card } from '../../../../core/components/Card';
import { Chip } from '../../../../core/components/Chip';
import { Button } from '../../../../core/components/Button';
import { ConfirmDialog } from '../../../../core/components/ConfirmDialog';
import { useTasksContext } from '../../../tasks/presentation/hooks/TasksContext';

const MODE_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export function SettingsScreen() {
  const { colors, spacing, typography, mode, setMode } = useTheme();
  const { clearAll } = useTasksContext();
  const [confirmClear, setConfirmClear] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h1, { color: colors.text }]}>Settings</Text>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.text }]}>Appearance</Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
            Choose a theme, or match your device's setting.
          </Text>
          <View style={[styles.row, { gap: spacing.sm, marginTop: spacing.md }]}>
            {MODE_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                selected={mode === option.value}
                onPress={() => setMode(option.value)}
              />
            ))}
          </View>
        </Card>

        <Card style={{ marginTop: spacing.lg }}>
          <Text style={[typography.h3, { color: colors.text }]}>Data</Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
            Permanently remove every task stored on this device.
          </Text>
          <Button
            title="Clear all tasks"
            variant="danger"
            onPress={() => setConfirmClear(true)}
            style={{ marginTop: spacing.md }}
          />
        </Card>
      </View>

      <ConfirmDialog
        visible={confirmClear}
        title="Clear all tasks?"
        message="This deletes every task on this device. This can't be undone."
        confirmLabel="Clear all"
        destructive
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          clearAll();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
