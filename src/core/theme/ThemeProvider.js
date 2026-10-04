import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';
import { getItem, setItem } from '../storage/asyncStorage';

const THEME_MODE_KEY = '@taskflow/theme-mode';

/** @typedef {'light' | 'dark' | 'system'} ThemeMode */

const ThemeContext = createContext(null);

/**
 * Provides the resolved color scheme + design tokens app-wide, and persists
 * the user's light/dark/system preference across launches.
 */
export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getItem(THEME_MODE_KEY).then((saved) => {
      if (isMounted && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setModeState(saved);
      }
      if (isMounted) setIsLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const setMode = useCallback((nextMode) => {
    setModeState(nextMode);
    setItem(THEME_MODE_KEY, nextMode);
  }, []);

  const scheme = mode === 'system' ? systemScheme ?? 'light' : mode;
  const colors = scheme === 'dark' ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      scheme,
      mode,
      setMode,
      colors,
      spacing,
      radius,
      typography,
      isLoaded,
    }),
    [scheme, mode, setMode, colors, isLoaded]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** @returns {{scheme: 'light'|'dark', mode: ThemeMode, setMode: (m: ThemeMode) => void, colors: object, spacing: object, radius: object, typography: object, isLoaded: boolean}} */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
