'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types
export interface SiteSettings {
  site_name: string;
  site_description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  logo?: string;
  footer_text: string;
  working_hours: string;
  google_maps_url?: string;
  meta_keywords?: string;
  meta_author?: string;
}

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
  error: string | null;
}

// Default values
const defaultSettings: SiteSettings = {
  site_name: 'شركة المقاولات',
  site_description: 'شركة مقاولات عامة في السعودية',
  phone: '+966500000000',
  whatsapp: '966500000000',
  email: 'info@construction.sa',
  address: 'الرياض، المملكة العربية السعودية',
  footer_text: 'شركة متخصصة في المقاولات العامة',
  working_hours: 'السبت - الخميس: 8 ص - 5 م',
};

// Create Context
const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
});

// Provider Component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${API_URL}/settings`, {
          next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
          throw new Error('فشل تحميل الإعدادات');
        }

        const data = await response.json();
        setSettings(data);
        setError(null);
      } catch (err) {
        console.error('Settings fetch error:', err);
        setError(err instanceof Error ? err.message : 'خطأ غير معروف');
        // Keep default settings on error
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook to use settings
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}