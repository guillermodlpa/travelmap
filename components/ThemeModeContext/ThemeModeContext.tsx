import { createContext, SetStateAction, Dispatch, useContext, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark';

export const FALLBACK_THEME_MODE = 'light';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: Dispatch<SetStateAction<ThemeMode>>;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({} as ThemeModeContextValue);

export const useThemeMode = () => useContext(ThemeModeContext);

const KEY = 'themeMode';
const ThemeModeInLocalStorage: React.FC = ({ children }) => {
  const { mode, setMode } = useThemeMode();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const localStorageValue = window.localStorage.getItem(KEY) as ThemeMode | null;
    if (localStorageValue) {
      setMode(localStorageValue);
    }
    // Leaving this out, for now. We want all users to start with light mode because it looks so much better
    // else if (matchMedia('(prefers-color-scheme: dark)').matches) {
    //   setMode('dark');
    // }
  }, [setMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    const localStorageValue = window.localStorage.getItem(KEY) as ThemeMode | null;
    if (localStorageValue !== mode) {
      window.localStorage.setItem(KEY, mode);
    }
  }, [mode]);
  return <>{children}</>;
};

export const ThemeModeContextProvider: React.FC<{ value: ThemeModeContextValue }> = ({
  children,
  value,
}) => (
  <ThemeModeContext.Provider value={value}>
    <ThemeModeInLocalStorage>{children}</ThemeModeInLocalStorage>
  </ThemeModeContext.Provider>
);
