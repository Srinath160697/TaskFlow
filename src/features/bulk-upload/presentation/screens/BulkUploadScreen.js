import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../../../core/components/Button";
import { Card } from "../../../../core/components/Card";
import { ErrorView } from "../../../../core/components/ErrorView";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { formatFileSize } from "../../../../core/utils/format";
import { ErrorList } from "../components/ErrorList";
import { ImportSummaryCard } from "../components/ImportSummaryCard";
import { useBulkUpload } from "../hooks/useBulkUpload";

/** Pick a CSV, review it, import valid rows, and see a full summary. */
export function BulkUploadScreen() {
  const { colors, spacing, typography } = useTheme();
  const {
    file,
    summary,
    error,
    isProcessing,
    pickFile,
    loadSample,
    importFile,
    reset,
  } = useBulkUpload();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <ScrollView contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}>
        <Text style={[typography.body, { color: colors.textMuted }]}>
          Expected columns: id, title, description, category, priority,
          start_date, due_date, status.
        </Text>

        <Card style={{ marginTop: spacing.lg }}>
          {file ? (
            <View>
              <View style={styles.fileRow}>
                <Ionicons
                  name="document-text-outline"
                  size={28}
                  color={colors.primary}
                />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text
                    style={[typography.bodyBold, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {file.name}
                  </Text>
                  <Text
                    style={[typography.caption, { color: colors.textMuted }]}
                  >
                    {formatFileSize(file.size)} · {file.mimeType}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: spacing.sm,
                  marginTop: spacing.lg,
                }}
              >
                <Button
                  title="Choose another file"
                  variant="secondary"
                  onPress={pickFile}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Import"
                  onPress={importFile}
                  loading={isProcessing}
                  disabled={isProcessing}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: spacing.md }}>
              <Ionicons
                name="cloud-upload-outline"
                size={40}
                color={colors.textMuted}
              />
              <Text
                style={[
                  typography.body,
                  {
                    color: colors.textMuted,
                    marginTop: spacing.sm,
                    textAlign: "center",
                  },
                ]}
              >
                Load the bundled sample file, or pick your own .csv to import
                tasks in bulk.
              </Text>
              <Button
                title="Use sample CSV"
                onPress={loadSample}
                style={{ marginTop: spacing.md, minWidth: 220 }}
              />
              <Button
                title="Pick from device"
                variant="secondary"
                onPress={pickFile}
                style={{ marginTop: spacing.sm, minWidth: 220 }}
              />
            </View>
          )}
        </Card>

        {error ? (
          <View style={{ marginTop: spacing.lg }}>
            <ErrorView message={error} onRetry={reset} />
          </View>
        ) : null}

        {summary ? (
          <View style={{ marginTop: spacing.lg }}>
            <ImportSummaryCard summary={summary} />
            <ErrorList
              title="Invalid rows"
              items={summary.errors}
              tone="danger"
            />
            <ErrorList
              title="Duplicates skipped"
              items={summary.duplicates}
              tone="warning"
            />
            <Button
              title="Done"
              variant="secondary"
              onPress={reset}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
