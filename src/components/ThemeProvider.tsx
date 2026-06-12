'use client';

import { useEffect, useState } from 'react';
import { getSiteColors, applyColorsToRoot, SiteColors } from '@/lib/colors';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<SiteColors | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteColors()
      .then((colorsData) => {
        setColors(colorsData);
        applyColorsToRoot(colorsData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to load colors:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
