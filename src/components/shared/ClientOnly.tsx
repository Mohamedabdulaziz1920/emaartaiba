'use client';

import { useState, useEffect, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ✅ يعرض children فقط بعد mount في client
 * يمنع Hydration mismatch نهائياً
 */
export default function ClientOnly({ children, fallback = null }: Props) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}