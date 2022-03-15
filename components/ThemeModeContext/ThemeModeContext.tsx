import { createContext, useContext } from 'react';

interface ThemeModeContextValue {
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({ mode: 'light', setMode: () => {} });

export const ThemeModeContextProvider = ThemeModeContext.Provider;

export const useThemeMode = () => useContext(ThemeModeContext);
