import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '../types';
import { db } from '../lib/database';
import { INITIAL_SITE_SETTINGS } from '../lib/seedData';
import { useToast } from './ToastContext';

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  const loadSettings = async () => {
    try {
      const data = await db.getSiteSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (updates: Partial<SiteSettings>) => {
    try {
      const updated = await db.updateSiteSettings(updates);
      setSettings(updated);
      showToast('Settings Saved', 'Company configurations have been updated.', 'success');
    } catch (err: any) {
      showToast('Update Failed', err.message || 'Failed to update settings', 'error');
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: loadSettings,
        updateSettings
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
