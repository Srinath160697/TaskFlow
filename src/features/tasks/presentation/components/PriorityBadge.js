import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Chip } from '../../../../core/components/Chip';

const PRIORITY_COLOR_KEYS = {
  Low: ['priorityLow', 'priorityLowMuted'],
  Medium: ['priorityMedium', 'priorityMediumMuted'],
  High: ['priorityHigh', 'priorityHighMuted'],
};

/** Color-coded, read-only priority pill shown on task list items and details. */
export function PriorityBadge({ priority }) {
  const { colors } = useTheme();
  const [colorKey, mutedKey] = PRIORITY_COLOR_KEYS[priority] ?? PRIORITY_COLOR_KEYS.Medium;
  return <Chip label={priority} selected color={colors[colorKey]} mutedColor={colors[mutedKey]} />;
}
