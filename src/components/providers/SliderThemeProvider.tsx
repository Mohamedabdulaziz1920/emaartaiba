'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface SliderThemeProviderProps {
  children: React.ReactNode;
}

export function SliderThemeProvider({ children }: SliderThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}