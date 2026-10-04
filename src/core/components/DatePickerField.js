import { useState } from 'react';
import { View, Text, Pressable, Modal, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/ThemeProvider';
import { formatDisplayDate, parseIsoDate, toIsoDate } from '../utils/date';
import { Button } from './Button';

/**
 * Labeled date field that opens the native date picker and stores/returns
 * the chosen date as a 'YYYY-MM-DD' string.
 * @param {{ label: string, value: string, onChange: (iso: string) => void, error?: string, required?: boolean, minimumDate?: string }} props
 */
export function DatePickerField({ label, value, onChange, error, required = false, minimumDate }) {
  const { colors, spacing, radius, typography } = useTheme();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState(() => parseIsoDate(value) ?? new Date());

  function openPicker() {
    setDraft(parseIsoDate(value) ?? new Date());
    setVisible(true);
  }

  function handleAndroidChange(event, selectedDate) {
    setVisible(false);
    if (event.type === 'set' && selectedDate) {
      onChange(toIsoDate(selectedDate));
    }
  }

  function handleIosChange(_event, selectedDate) {
    if (selectedDate) setDraft(selectedDate);
  }

  function confirmIos() {
    onChange(toIsoDate(draft));
    setVisible(false);
  }

  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[typography.label, { color: colors.textMuted, marginBottom: spacing.xs }]}>
        {label}
        {required ? ' *' : ''}
      </Text>
      <Pressable
        onPress={openPicker}
        style={[
          styles.field,
          {
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.surface,
            borderRadius: radius.md,
          },
        ]}
      >
        <Text style={[typography.body, { color: value ? colors.text : colors.textMuted }]}>
          {value ? formatDisplayDate(value) : 'Select a date'}
        </Text>
      </Pressable>
      {error ? (
        <Text style={[typography.caption, { color: colors.danger, marginTop: spacing.xs }]}>{error}</Text>
      ) : null}

      {visible && Platform.OS === 'android' ? (
        <DateTimePicker
          value={draft}
          mode="date"
          display="default"
          minimumDate={parseIsoDate(minimumDate) ?? undefined}
          onChange={handleAndroidChange}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.sheet, { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg }]}>
              <DateTimePicker
                value={draft}
                mode="date"
                display="inline"
                minimumDate={parseIsoDate(minimumDate) ?? undefined}
                onChange={handleIosChange}
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
                <Button title="Cancel" variant="secondary" onPress={() => setVisible(false)} style={{ flex: 1 }} />
                <Button title="Done" onPress={confirmIos} style={{ flex: 1 }} />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
  },
});
