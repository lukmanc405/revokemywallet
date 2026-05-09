import { useCallback, useContext, useMemo } from 'react';
import { TelegramContext } from '@/providers/TelegramProvider';

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  colorScheme: 'light' | 'dark';
  HapticFeedback: {
    impactOccurred: (
      style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
    ) => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
}

export interface UseTelegramWebAppReturn {
  webApp: TelegramWebApp | null;
  isInTelegram: boolean;
  sendToBot: (data: object) => void;
  haptic: (type: 'success' | 'error' | 'warning') => void;
  hapticImpact: (style?: 'light' | 'medium' | 'heavy') => void;
  openExplorer: (url: string) => void;
  closeApp: () => void;
}

export function useTelegramWebApp(): UseTelegramWebAppReturn {
  const ctx = useContext(TelegramContext);

  // Fallback for dev mode: try to read directly from window
  const webApp = useMemo(
    () => ctx.webApp ?? (window.Telegram?.WebApp as TelegramWebApp) ?? null,
    [ctx.webApp]
  );

  const isInTelegram = webApp !== null;

  const sendToBot = useCallback(
    (data: object) => {
      if (!webApp) {
        console.warn('[useTelegramWebApp] Not in Telegram, cannot send data');
        return;
      }
      webApp.sendData(JSON.stringify(data));
    },
    [webApp]
  );

  const haptic = useCallback(
    (type: 'success' | 'error' | 'warning') => {
      if (!webApp) return;
      webApp.HapticFeedback.notificationOccurred(type);
    },
    [webApp]
  );

  const hapticImpact = useCallback(
    (style: 'light' | 'medium' | 'heavy' = 'medium') => {
      if (!webApp) return;
      webApp.HapticFeedback.impactOccurred(style);
    },
    [webApp]
  );

  const openExplorer = useCallback(
    (url: string) => {
      if (!webApp) {
        window.open(url, '_blank', 'noopener,noreferrer');
        return;
      }
      webApp.openLink(url, { try_instant_view: false });
    },
    [webApp]
  );

  const closeApp = useCallback(() => {
    if (!webApp) return;
    webApp.close();
  }, [webApp]);

  return {
    webApp,
    isInTelegram,
    sendToBot,
    haptic,
    hapticImpact,
    openExplorer,
    closeApp,
  };
}
