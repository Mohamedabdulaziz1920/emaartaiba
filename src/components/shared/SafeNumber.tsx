'use client';

import { useState, useEffect } from 'react';

interface Props {
  value: number | string | null | undefined;
  locale?: string;
  suffix?: string;
  prefix?: string;
  fallback?: string;
}

export default function SafeNumber({ 
  value, 
  locale = 'ar-SA',
  suffix = '',
  prefix = '',
  fallback = '0'
}: Props) {
  const [formatted, setFormatted] = useState<string>(fallback);

  useEffect(() => {
    if (value === null || value === undefined) {
      setFormatted(fallback);
      return;
    }

    try {
      const num = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(num)) {
        setFormatted(fallback);
        return;
      }

      setFormatted(`${prefix}${num.toLocaleString(locale)}${suffix}`);
    } catch {
      setFormatted(fallback);
    }
  }, [value, locale, suffix, prefix, fallback]);

  return <span suppressHydrationWarning>{formatted}</span>;
}