import { createContext, SetStateAction, Dispatch, useContext } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeModeContextValue {
  mode: ThemeMode;
  setMode: Dispatch<SetStateAction<ThemeMode>>;
}

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: 'light',
  setMode: () => 'light',
});

export const ThemeModeContextProvider = ThemeModeContext.Provider;

export const useThemeMode = () => useContext(ThemeModeContext);
