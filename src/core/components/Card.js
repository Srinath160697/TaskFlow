import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

/** Simple elevated surface container used throughout the app. */
export function Card({ children, style }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
});
