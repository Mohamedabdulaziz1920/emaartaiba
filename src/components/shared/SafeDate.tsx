'use client';

import { useState, useEffect } from 'react';

interface Props {
  date: string | Date | null | undefined;
  format?: 'date' | 'datetime' | 'time' | 'year';
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  fallback?: string;
}

export default function SafeDate({ 
  date, 
  format = 'date',
  locale = 'ar-SA',
  options,
  fallback = ''
}: Props) {
  const [formatted, setFormatted] = useState<string>(fallback);

  useEffect(() => {
    if (!date) {
      setFormatted(fallback);
      return;
    }

    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        setFormatted(fallback);
        return;
      }

      let result = '';
      
      if (options) {
        result = d.toLocaleDateString(locale, options);
      } else {
        switch (format) {
          case 'date':
            result = d.toLocaleDateString(locale);
            break;
          case 'datetime':
            result = d.toLocaleString(locale);
            break;
          case 'time':
            result = d.toLocaleTimeString(locale);
            break;
          case 'year':
            result = String(d.getFullYear());
            break;
          default:
            result = d.toLocaleDateString(locale);
        }
      }
      
      setFormatted(result);
    } catch {
      setFormatted(fallback);
    }
  }, [date, format, locale, options, fallback]);

  return <span suppressHydrationWarning>{formatted}</span>;
}