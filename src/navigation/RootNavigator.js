import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../core/theme/ThemeProvider';
import { ROUTES } from './routes';
import { TabNavigator } from './TabNavigator';
import { TaskDetailsScreen } from '../features/tasks/presentation/screens/TaskDetailsScreen';
import { AddEditTaskScreen } from '../features/tasks/presentation/screens/AddEditTaskScreen';
import { BulkUploadScreen } from '../features/bulk-upload/presentation/screens/BulkUploadScreen';

const Stack = createNativeStackNavigator();

/**
 * Root native-stack navigator. Hosts the bottom tabs plus the screens that
 * should render full-screen, on top of the tabs: TaskDetails, AddEditTask,
 * and BulkUpload.
 */
export function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name={ROUTES.TABS} component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name={ROUTES.TASK_DETAILS} component={TaskDetailsScreen} options={{ title: 'Task Details' }} />
      <Stack.Screen
        name={ROUTES.ADD_EDIT_TASK}
        component={AddEditTaskScreen}
        options={({ route }) => ({ title: route.params?.taskId ? 'Edit Task' : 'Add Task' })}
      />
      <Stack.Screen name={ROUTES.BULK_UPLOAD} component={BulkUploadScreen} options={{ title: 'Bulk Upload' }} />
    </Stack.Navigator>
  );
}
