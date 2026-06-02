import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/client";
import { DEFAULT_SITE_SETTINGS, type SiteSettings } from "../../shared/siteSettings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SITE_SETTINGS,
  refreshSettings: async () => {}
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await api.getSiteSettings();
      setSettings(data);
    } catch {
      setSettings(DEFAULT_SITE_SETTINGS);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext).settings;
}

export function useRefreshSiteSettings() {
  return useContext(SiteSettingsContext).refreshSettings;
}
