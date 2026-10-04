import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../core/theme/ThemeProvider';
import { ROUTES } from './routes';
import { DashboardScreen } from '../features/dashboard/presentation/screens/DashboardScreen';
import { TaskListScreen } from '../features/tasks/presentation/screens/TaskListScreen';
import { SettingsScreen } from '../features/settings/presentation/screens/SettingsScreen';

const TAB_ICONS = {
  [ROUTES.HOME]: 'home-outline',
  [ROUTES.TASKS]: 'checkbox-outline',
  [ROUTES.SETTINGS]: 'settings-outline',
};

const Tab = createBottomTabNavigator();

/** Bottom tabs: Home (Dashboard), Tasks, Settings. */
export function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      <Tab.Screen name={ROUTES.HOME} component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name={ROUTES.TASKS} component={TaskListScreen} options={{ title: 'Tasks' }} />
      <Tab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
