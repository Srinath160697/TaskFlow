import { useNavigation, useRoute } from "@react-navigation/native";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../../core/components/Button";
import { DatePickerField } from "../../../../core/components/DatePickerField";
import { Input } from "../../../../core/components/Input";
import { SelectField } from "../../../../core/components/SelectField";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import {
  PRIORITIES,
  STATUSES,
  TITLE_MAX_LENGTH,
} from "../../../../core/utils/constants";
import { useTaskForm } from "../hooks/useTaskForm";

const PRIORITY_COLOR_KEY = {
  Low: "priorityLow",
  Medium: "priorityMedium",
  High: "priorityHigh",
};
const PRIORITY_MUTED_COLOR_KEY = {
  Low: "priorityLowMuted",
  Medium: "priorityMediumMuted",
  High: "priorityHighMuted",
};

/** Shared Add/Edit Task form. Routed with an optional `taskId` param to edit. */
export function AddEditTaskScreen() {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { taskId } = route.params ?? {};
  const { values, setField, errors, isSaving, save, isEditing } =
    useTaskForm(taskId);

  async function handleSave() {
    const result = await save();
    if (result.success) navigation.goBack();
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="Title"
            required
            value={values.title}
            onChangeText={(text) => setField("title", text)}
            error={errors.title}
            placeholder="What needs to be done?"
            maxLength={TITLE_MAX_LENGTH}
          />
          <Input
            label="Description"
            value={values.description}
            onChangeText={(text) => setField("description", text)}
            placeholder="Add more detail (optional)"
            multiline
          />
          <Input
            label="Category"
            value={values.category}
            onChangeText={(text) => setField("category", text)}
            placeholder="e.g. Work, Personal"
          />
          <SelectField
            label="Priority"
            required
            value={values.priority}
            options={PRIORITIES}
            onChange={(v) => setField("priority", v)}
            colorForOption={(opt) => colors[PRIORITY_COLOR_KEY[opt]]}
            mutedColorForOption={(opt) => colors[PRIORITY_MUTED_COLOR_KEY[opt]]}
          />
          <DatePickerField
            label="Start date"
            required
            value={values.startDate}
            onChange={(iso) => setField("startDate", iso)}
            error={errors.startDate}
          />
          <DatePickerField
            label="Due date"
            required
            value={values.dueDate}
            onChange={(iso) => setField("dueDate", iso)}
            error={errors.dueDate}
            minimumDate={values.startDate}
          />
          <SelectField
            label="Status"
            required
            value={values.status}
            options={STATUSES}
            onChange={(v) => setField("status", v)}
          />

          <Button
            title={isEditing ? "Update task" : "Save task"}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
