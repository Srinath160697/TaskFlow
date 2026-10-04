import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { SORT_FIELDS } from '../../../../core/utils/constants';

const SORT_OPTIONS = [
  { field: SORT_FIELDS.DUE_DATE, label: 'Due date' },
  { field: SORT_FIELDS.START_DATE, label: 'Start date' },
  { field: SORT_FIELDS.PRIORITY, label: 'Priority' },
  { field: SORT_FIELDS.CATEGORY, label: 'Category' },
];

/**
 * Bottom sheet for picking the sort field/direction for the task list.
 * @param {{ visible: boolean, field: string, direction: 'asc'|'desc', onChange: (next: {field: string, direction: 'asc'|'desc'}) => void, onClose: () => void }} props
 */
export function SortSheet({ visible, field, direction, onChange, onClose }) {
  const { colors, spacing, radius, typography } = useTheme();

  function selectField(nextField) {
    onChange({ field: nextField, direction: nextField === field ? toggleDirection(direction) : 'asc' });
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.overlay }]} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg }]}
          onPress={() => {}}
        >
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>Sort by</Text>
          {SORT_OPTIONS.map((option) => {
            const selected = option.field === field;
            return (
              <Pressable
                key={option.field}
                onPress={() => selectField(option.field)}
                style={[styles.row, { paddingVertical: spacing.sm }]}
              >
                <Text style={[typography.body, { color: selected ? colors.primary : colors.text, flex: 1 }]}>
                  {option.label}
                </Text>
                {selected ? (
                  <Ionicons
                    name={direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                    size={18}
                    color={colors.primary}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function toggleDirection(direction) {
  return direction === 'asc' ? 'desc' : 'asc';
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
