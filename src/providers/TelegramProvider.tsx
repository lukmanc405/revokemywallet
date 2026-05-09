import {
  createContext,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

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
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
}

export interface TelegramContextValue {
  isReady: boolean;
  colorScheme: 'light' | 'dark';
  hapticFeedback: {
    impact: (style?: 'light' | 'medium' | 'heavy') => void;
    notification: (type: 'error' | 'success' | 'warning') => void;
    selection: () => void;
  };
  webApp: TelegramWebApp | null;
}

export const TelegramContext = createContext<TelegramContextValue>({
  isReady: false,
  colorScheme: 'dark',
  hapticFeedback: {
    impact: () => {},
    notification: () => {},
    selection: () => {},
  },
  webApp: null,
});

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      // Not in Telegram — still allow usage (dev mode)
      setIsReady(true);
      return;
    }

    tg.ready();
    tg.expand();

    setWebApp(tg);
    setColorScheme(tg.colorScheme);
    setIsReady(true);
  }, []);

  const hapticFeedback = useMemo(
    () => ({
      impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
        webApp?.HapticFeedback.impactOccurred(style);
      },
      notification: (type: 'error' | 'success' | 'warning') => {
        webApp?.HapticFeedback.notificationOccurred(type);
      },
      selection: () => {
        webApp?.HapticFeedback.selectionChanged();
      },
    }),
    [webApp]
  );

  const value = useMemo(
    () => ({
      isReady,
      colorScheme,
      hapticFeedback,
      webApp,
    }),
    [isReady, colorScheme, hapticFeedback, webApp]
  );

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}
